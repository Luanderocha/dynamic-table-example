// src/app/accordion-list/accordion-list.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { AccordionItem, Account, Profile } from '../models/accordion-item';

@Component({
  selector: 'app-accordion-list',
  templateUrl: './accordion-list.component.html',
  styleUrls: ['./accordion-list.component.scss']
})
export class AccordionListComponent implements OnInit {

  form: FormGroup;

  // Mock de dados (permanece o mesmo)
  public mockData: AccordionItem[] = [
    {
      clientIbpjId: 1,
      document: '00.000.000/0001-00',
      corporateName: 'Empresa Alpha LTDA',
      status: 'Configurada',
      isSelected: true,
      profiles: [
        { id: 10, name: 'Cobrança Online + Consultas' },
        { id: 11, name: 'Cobrança Completo' },
        { id: 12, name: 'Cobrança Padrão' }
      ],
      accounts: [
        { accountNumber: '4.785.096-7', accountType: 'Conta Corrente', accountModel: 'Conta Investimento - PJ', accessProfile: 11 },
        { accountNumber: '4.785.096-8', accountType: 'Conta Corrente', accountModel: 'Conta Investimento - PJ' }
      ]
    },
    {
      clientIbpjId: 2,
      document: '00.000.000/0001-01',
      corporateName: 'Empresa Beta S/A',
      status: 'Pendente',
      isSelected: false,
      profiles: [
        { id: 10, name: 'Cobrança Online + Consultas' },
        { id: 11, name: 'Cobrança Completo' }
      ],
      accounts: [
        { accountNumber: '5.123.456-1', accountType: 'Conta Corrente', accountModel: 'Conta Investimento - PJ' }
      ]
    }
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      clients: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.mockData.forEach(client => {
      this.clients.push(this.createClientFormGroup(client));
    });
  }

  get clients(): FormArray {
    return this.form.get('clients') as FormArray;
  }

  getAccountControls(clientControl: AbstractControl): AbstractControl[] {
    const accounts = (clientControl as FormGroup).get('accounts') as FormArray;
    return accounts.controls;
  }

  // ==================== NOVA FUNÇÃO ====================
  onSubmit(): void {
    console.log('--- VALOR COMPLETO DO FORMULÁRIO ---');
    console.log(this.form.value);

    // Para pegar apenas os clientes selecionados
    const selectedClients = this.form.value.clients.filter((client:any) => client.isSelected);
    
    console.log('--- APENAS CLIENTES SELECIONADOS ---');
    console.log(selectedClients);

    console.log('--- STATUS DE VALIDAÇÃO DO FORMULÁRIO ---');
    console.log(this.form.status);
  }
  // ======================================================

  createClientFormGroup(client: AccordionItem): FormGroup {
    return this.fb.group({
      isSelected: [client.isSelected],
      clientIbpjId: [client.clientIbpjId],
      corporateName: [client.corporateName],
      document: [client.document],
      status: [client.status],
      profiles: [client.profiles], 
      accounts: this.createAccountsFormArray(client.accounts)
    });
  }

  createAccountsFormArray(accounts: Account[]): FormArray {
    const accountFormGroups = accounts.map(acc => this.createAccountFormGroup(acc));
    return this.fb.array(accountFormGroups);
  }

  createAccountFormGroup(account: Account): FormGroup {
    return this.fb.group({
      accountNumber: [account.accountNumber],
      accountType: [account.accountType],
      accountModel: [account.accountModel],
      // Adicionando o valor inicial do mock no accessProfile
      accessProfile: [account.accessProfile || null, Validators.required] 
    });
  }
}