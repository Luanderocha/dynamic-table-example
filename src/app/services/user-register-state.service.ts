// src/app/user-register/user-register-state.service.ts

import { Injectable, OnDestroy } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { ClientManagementService } from '../services/client-management.service';
import { Account, Client, Profile, AccountDetailsResponse, ClientResponse, Pagination } from '../services/client-management.models';
import { Observable, of, Subscription, merge, BehaviorSubject, forkJoin } from 'rxjs';
import { shareReplay, catchError, startWith, tap, switchMap } from 'rxjs/operators';

@Injectable()
export class UserRegisterStateService implements OnDestroy {

  private clientsForm: FormGroup;
  private accountsApiCache = new Map<number, Observable<AccountDetailsResponse>>();
  
  // Armazena o estado da paginação (para o componente de UI saber a página)
  public paginationInfo = new BehaviorSubject<Pagination | null>(null);
  
  // Flag para garantir que só carregamos tudo UMA VEZ
  private hasLoadedAllClients = false;

  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private clientService: ClientManagementService
  ) {
    this.clientsForm = this.fb.group({
      clients: this.fb.array([])
    });
  }

  // --- Getters Públicos para o PAI (UserRegister) ---
  get isFormValid(): boolean { return this.clientsForm.valid; }
  getMappedValue(): any {
    const rawFormValue = this.clientsForm.getRawValue();
    const selectedClientsRaw = rawFormValue.clients.filter((client: any) => client.isSelected);
    return {
      clients: selectedClientsRaw.map((client: any) => ({
        clientId: client.clientIbpjId,
        accounts: client.accounts.map((account: any) => ({
          accountType: account.accountType, agency: account.branchNumber, 
          accountNumber: account.accountNumber, profileId: account.accessProfile 
        }))
      }))
    };
  }

  // --- Getters Públicos para o FILHO (AccordionList) ---
  getForm(): FormGroup { return this.clientsForm; }
  get clientsArray(): FormArray { return this.clientsForm.get('clients') as FormArray; }

  /**
   * Chamado pelo AccordionList.
   * Carrega a página 1, descobre o total de páginas, e
   * carrega todas as outras páginas em paralelo.
   */
  initializeClientState(): Observable<any> {
    if (this.hasLoadedAllClients) {
      return of(true); // Já carregou, não faz nada
    }

    // 1. Pega a primeira página (com 5 itens)
    return this.clientService.getClients(1, 5).pipe(
      switchMap(firstPageResponse => {
        // Armazena a paginação (importante para o UI)
        this.paginationInfo.next(firstPageResponse.pagination);
        
        // Popula o FormArray com a Página 1
        firstPageResponse.clients.forEach(client => {
          this.clientsArray.push(this.buildClientFormGroup(client));
        });

        const totalPages = firstPageResponse.pagination.totalPages; // ex: 3
        const pageRequests: Observable<ClientResponse>[] = [];

        // 2. Cria um array de chamadas para as páginas restantes (ex: 2 e 3)
        for (let page = 2; page <= totalPages; page++) {
          pageRequests.push(this.clientService.getClients(page, 5));
        }
        
        // Se só havia 1 página, já terminamos
        if (pageRequests.length === 0) {
          return of(true);
        }

        // 3. Executa todas as chamadas restantes em paralelo
        return forkJoin(pageRequests).pipe(
          tap(otherPageResponses => {
            // Adiciona os clientes das páginas 2 e 3 ao FormArray
            otherPageResponses.forEach(response => {
              response.clients.forEach(client => {
                this.clientsArray.push(this.buildClientFormGroup(client));
              });
            });
          })
        );
      }),
      tap(() => {
        this.hasLoadedAllClients = true; // Marca que o carregamento completo foi feito
      })
    );
  }

  /**
   * Chamado pelo paginador. Apenas atualiza o BehaviorSubject.
   * Não chama mais a API.
   */
  setCurrentPage(page: number): void {
    const currentPagination = this.paginationInfo.value;
    if (currentPagination && currentPagination.number !== page) {
      // Emite um novo objeto de paginação com o número da página atualizado
      this.paginationInfo.next({ ...currentPagination, number: page });
    }
  }

  // --- O resto do serviço (getAccountDetails, buildClientFormGroup, etc.) ---
  
  getAccountDetails(clientId: number): Observable<AccountDetailsResponse> {
    let cachedCall = this.accountsApiCache.get(clientId);
    if (!cachedCall) {
      cachedCall = this.clientService.getAccountDetails(clientId).pipe(
        shareReplay(1)
      );
      this.accountsApiCache.set(clientId, cachedCall);
    }
    return cachedCall;
  }

  buildClientFormGroup(client: Client): FormGroup {
    const clientFormGroup = this.fb.group({
      clientIbpjId: [client.clientIbpjId], corporateName: [client.corporateName],
      document: [client.document], currentClient: [client.currentClient],
      isSelected: [false], status: ['Pendente'], profiles: [[]],
      isDataLoaded: [false], isLoadingDetails: [false],
      accounts: this.fb.array([])
    });
    const isSelectedControl = clientFormGroup.get('isSelected');
    const accountsControl = clientFormGroup.get('accounts') as FormArray;
    const statusControl = clientFormGroup.get('status');
    if (isSelectedControl && accountsControl && statusControl) {
      const statusSub = merge(isSelectedControl.valueChanges, accountsControl.statusChanges)
        .pipe(startWith(null)).subscribe(() => {
          const isSelected = isSelectedControl.value;
          const accountsValid = accountsControl.valid;
          if (isSelected && accountsValid) { statusControl.setValue('Configurada', { emitEvent: false });
          } else { statusControl.setValue('Pendente', { emitEvent: false }); }
        });
      this.subscriptions.add(statusSub);
    }
    return clientFormGroup;
  }

  buildAccountFormGroup(account: Account): FormGroup {
    return this.fb.group({
      accountNumber: [account.accountNumber], accountTypeLabel: [account.accountTypeLabel],
      accountModel: [account.accountModel], branchNumber: [account.branchNumber],
      bank: [account.bank], accountType: [account.accountType],
      accessProfile: [0, Validators.required],
      useProfileForAll: [false]
    });
  }
  
  setupProfilePropagation(accountsArray: FormArray): void {
     if (accountsArray.length <= 1) { return; }
     const firstAccount = accountsArray.at(0) as FormGroup;
     const profileControl = firstAccount.get('accessProfile');
     const useForAllControl = firstAccount.get('useProfileForAll');
 
     if (!profileControl || !useForAllControl) { return; }
 
     const sub = merge(profileControl.valueChanges, useForAllControl.valueChanges)
       .subscribe(() => {
         if (useForAllControl.value === true) {
           const profileIdToSet = profileControl.value;
           accountsArray.controls.forEach((control, index) => {
             if (index > 0) {
               control.get('accessProfile')?.setValue(profileIdToSet);
             }
           });
         }
       });
     this.subscriptions.add(sub);
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}