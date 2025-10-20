// src/app/accordion-list/accordion-list.component.ts

import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { ClientManagementService } from '../services/client-management.service';
import { Account, Client, Profile } from '../services/client-management.models';
import { Subscription, merge, of } from 'rxjs';
import { startWith, catchError } from 'rxjs/operators';

@Component({
  selector: 'app-accordion-list',
  templateUrl: './accordion-list.component.html',
  styleUrls: ['./accordion-list.component.scss']
})
export class AccordionListComponent implements OnInit, OnDestroy {

  form: FormGroup;
  isLoadingClients = true;
  private subscriptions = new Subscription();

  constructor(
    private fb: FormBuilder,
    private clientService: ClientManagementService
  ) {
    this.form = this.fb.group({
      clients: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadInitialClients();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  get clients(): FormArray {
    return this.form.get('clients') as FormArray;
  }

  loadInitialClients(): void {
    this.isLoadingClients = true;
    const sub = this.clientService.getClients().subscribe(response => {
      response.clients.forEach(client => {
        this.clients.push(this.createClientFormGroup(client));
      });
      this.isLoadingClients = false;
    });
    this.subscriptions.add(sub);
  }

  createClientFormGroup(client: Client): FormGroup {
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
      const statusSub = merge(
        isSelectedControl.valueChanges,
        accountsControl.statusChanges
      ).pipe(startWith(null)).subscribe(() => {
        const isSelected = isSelectedControl.value;
        const accountsValid = accountsControl.valid;
        if (isSelected && accountsValid) {
          statusControl.setValue('Configurada', { emitEvent: false });
        } else {
          statusControl.setValue('Pendente', { emitEvent: false });
        }
      });
      this.subscriptions.add(statusSub);
    }
    return clientFormGroup;
  }

  onAccordionOpen(clientGroup: AbstractControl): void {
    const group = clientGroup as FormGroup;
    if (group.get('isDataLoaded')?.value === true) { return; }
    const clientId = group.get('clientIbpjId')?.value;
    if (!clientId) { console.error('ID do cliente não encontrado'); return; }
    
    group.get('isLoadingDetails')?.setValue(true);
    
    const sub = this.clientService.getAccountDetails(clientId).pipe(
      catchError(error => {
        console.error('Erro ao buscar detalhes das contas:', error);
        group.get('isLoadingDetails')?.setValue(false);
        return of(null);
      })
    ).subscribe(response => {
      if (!response) { return; }
      
      const semAcessoProfile: Profile = { profileId: 0, profileName: "Sem acesso" };
      const completeProfiles = [semAcessoProfile, ...response.profiles];
      group.get('profiles')?.setValue(completeProfiles);
      
      const accountsFormArray = group.get('accounts') as FormArray;
      if (accountsFormArray) {
        response.accounts.forEach(account => {
          accountsFormArray.push(this.createAccountFormGroup(account));
        });
        
        // Chama a nova lógica de propagação
        this.setupProfilePropagation(accountsFormArray);
      }
      group.get('isDataLoaded')?.setValue(true);
      group.get('isLoadingDetails')?.setValue(false);
    });
    this.subscriptions.add(sub);
  }

  createAccountFormGroup(account: Account): FormGroup {
    return this.fb.group({
      // Dados da API (para exibição)
      accountNumber: [account.accountNumber],
      accountTypeLabel: [account.accountTypeLabel], // <-- NOVO CAMPO
      accountModel: [account.accountModel],
      branchNumber: [account.branchNumber],
      bank: [account.bank],
      accountType: [account.accountType],
      
      // Controles de Formulário
      accessProfile: [0, Validators.required],
      useProfileForAll: [false] // <-- NOVO CONTROLE
    });
  }

  /**
   * Ouve as mudanças no 'accessProfile' e 'useProfileForAll' da PRIMEIRA linha
   * e propaga o valor para as demais linhas.
   */
  private setupProfilePropagation(accountsArray: FormArray): void {
    if (accountsArray.length <= 1) {
      return; // Não há para onde propagar
    }

    const firstAccount = accountsArray.at(0) as FormGroup;
    const profileControl = firstAccount.get('accessProfile');
    const useForAllControl = firstAccount.get('useProfileForAll');

    if (!profileControl || !useForAllControl) {
      return;
    }

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

  getAccountControls(clientControl: AbstractControl): AbstractControl[] {
    const accounts = (clientControl as FormGroup).get('accounts') as FormArray;
    return accounts ? accounts.controls : [];
  }

  getProfileOptions(clientControl: AbstractControl): Profile[] {
    const profilesControl = (clientControl as FormGroup).get('profiles');
    return profilesControl ? profilesControl.value : [];
  }

  limparSelecao(clientGroup: AbstractControl): void {
    const group = clientGroup as FormGroup;
    const accountsArray = group.get('accounts') as FormArray;

    accountsArray.controls.forEach(accountControl => {
      accountControl.get('accessProfile')?.setValue(0);
    });
    // Reseta também o checkbox "Usar em todas"
    accountsArray.at(0)?.get('useProfileForAll')?.setValue(false);

    group.get('isSelected')?.setValue(false);
  }

  salvarConfiguracao(clientGroup: AbstractControl): void {
    const group = clientGroup as FormGroup;
    if (group.get('accounts')?.invalid) {
      return;
    }
    group.get('isSelected')?.setValue(true);
  }
  
  onSubmit(): void {
    console.log('%c--- PAYLOAD MAPEADO PARA O BACKEND ---', 'color: #007bff; font-weight: bold;');
    const rawFormValue = this.form.getRawValue();
    const selectedClientsRaw = rawFormValue.clients.filter((client: any) => client.isSelected);
    const payload = {
      clients: selectedClientsRaw.map((client: any) => ({
        clientId: client.clientIbpjId,
        accounts: client.accounts.map((account: any) => ({
          accountType: account.accountType, agency: account.branchNumber, 
          accountNumber: account.accountNumber, profileId: account.accessProfile 
        }))
      }))
    };
    console.log(payload);
  }
}