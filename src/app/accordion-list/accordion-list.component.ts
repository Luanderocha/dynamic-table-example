// src/app/accordion-list/accordion-list.component.ts

import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription, merge, of } from 'rxjs';
import { catchError, startWith } from 'rxjs/operators';
import { Account, Client, Profile } from '../services/client-management.models';
import { ClientManagementService } from '../services/client-management.service';
// 1. A importação do AccordionComponent foi REMOVIDA

@Component({
  selector: 'app-accordion-list',
  templateUrl: './accordion-list.component.html',
  styleUrls: ['./accordion-list.component.scss'],
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
      clients: this.fb.array([]),
    });
  }

  // ... (ngOnInit, ngOnDestroy, get clients, loadInitialClients, createClientFormGroup) ...
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
    const sub = this.clientService.getClients().subscribe((response) => {
      response.clients.forEach((client) => {
        this.clients.push(this.createClientFormGroup(client));
      });
      this.isLoadingClients = false;
    });
    this.subscriptions.add(sub);
  }
  createClientFormGroup(client: Client): FormGroup {
    const clientFormGroup = this.fb.group({
      clientIbpjId: [client.clientIbpjId],
      corporateName: [client.corporateName],
      document: [client.document],
      currentClient: [client.currentClient],
      isSelected: [false],
      status: ['Pendente'],
      profiles: [[]],
      isDataLoaded: [false],
      isLoadingDetails: [false],
      accounts: this.fb.array([]),
    });
    const isSelectedControl = clientFormGroup.get('isSelected');
    const accountsControl = clientFormGroup.get('accounts') as FormArray;
    const statusControl = clientFormGroup.get('status');
    if (isSelectedControl && accountsControl && statusControl) {
      const statusSub = merge(
        isSelectedControl.valueChanges,
        accountsControl.statusChanges
      )
        .pipe(startWith(null))
        .subscribe(() => {
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
  // ==================== MÉTODO ATUALIZADO ====================
  // 2. Assinatura simplificada (não precisa mais do 'accordion')
  onAccordionOpen(clientGroup: AbstractControl): void {
    const group = clientGroup as FormGroup;

    if (group.get('isDataLoaded')?.value === true) {
      return;
    }

    const clientId = group.get('clientIbpjId')?.value;
    if (!clientId) {
      console.error('ID do cliente não encontrado para carregar contas.');
      return;
    }

    group.get('isLoadingDetails')?.setValue(true);

    const sub = this.clientService
      .getAccountDetails(clientId)
      .pipe(
        catchError((error) => {
          console.error('Erro ao buscar detalhes das contas:', error);
          group.get('isLoadingDetails')?.setValue(false);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (!response) {
          return;
        }

        const semAcessoProfile: Profile = {
          profileId: 0,
          profileName: 'Sem acesso',
        };
        const completeProfiles = [semAcessoProfile, ...response.profiles];
        group.get('profiles')?.setValue(completeProfiles);

        const accountsFormArray = group.get('accounts') as FormArray;
        if (accountsFormArray) {
          response.accounts.forEach((account) => {
            accountsFormArray.push(this.createAccountFormGroup(account));
          });
        }

        group.get('isDataLoaded')?.setValue(true);
        group.get('isLoadingDetails')?.setValue(false);

        // 3. A chamada para 'accordion.calculateAndSetHeight()' foi REMOVIDA.
        // Não é mais necessária.
      });
    this.subscriptions.add(sub);
  }
  // ==========================================================

  createAccountFormGroup(account: Account): FormGroup {
    return this.fb.group({
      accountNumber: [account.accountNumber],
      accountModel: [account.accountModel],
      branchNumber: [account.branchNumber],
      bank: [account.bank],
      accountType: [account.accountType],
      accessProfile: [0, Validators.required],
    });
  }

  getAccountControls(clientControl: AbstractControl): AbstractControl[] {
    const accounts = (clientControl as FormGroup).get('accounts') as FormArray;
    return accounts ? accounts.controls : [];
  }

  getProfileOptions(clientControl: AbstractControl): Profile[] {
    const profilesControl = (clientControl as FormGroup).get('profiles');
    return profilesControl ? profilesControl.value : [];
  }

  onSubmit(): void {
    console.log('--- VALOR COMPLETO DO FORMULÁRIO (RAW) ---');
    console.log(this.form.getRawValue());
    const rawFormValue = this.form.getRawValue();
    const selectedClientsRaw = rawFormValue.clients.filter(
      (client: any) => client.isSelected
    );
    const payload = {
      clients: selectedClientsRaw.map((client: any) => {
        return {
          clientId: client.clientIbpjId,
          accounts: client.accounts.map((account: any) => {
            return {
              accountType: account.accountType,
              agency: account.branchNumber,
              accountNumber: account.accountNumber,
              profileId: account.accessProfile,
            };
          }),
        };
      }),
    };
    console.log(
      '%c--- PAYLOAD MAPEADO PARA O BACKEND ---',
      'color: #007bff; font-weight: bold;'
    );
    console.log(payload);
  }
}
