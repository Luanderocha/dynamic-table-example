// src/app/accordion-list/accordion-list.component.ts

import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Pagination, Profile } from '../services/client-management.models';
import { UserRegisterStateService } from '../services/user-register-state.service';

@Component({
  selector: 'app-accordion-list',
  templateUrl: './accordion-list.component.html',
  styleUrls: ['./accordion-list.component.scss'],
})
export class AccordionListComponent implements OnInit, OnDestroy {
  form!: FormGroup;
  isLoadingClients = true;

  public paginationInfo: Pagination | null = null;
  private paginationSub!: Subscription;

  // O array completo com todos os clientes (do serviço)
  private allClientControls: AbstractControl[] = [];

  // O array fatiado com os clientes visíveis (CORRIGIDO: Tipo FormGroup[])
  public paginatedClientControls: FormGroup[] = [];

  constructor(private stateService: UserRegisterStateService) {}

  ngOnInit(): void {
    this.form = this.stateService.getForm();
    this.allClientControls = (this.form.get('clients') as FormArray).controls;

    

    // A subscrição da paginação ainda é necessária para MUDANÇAS de página
    this.paginationSub = this.stateService.paginationInfo.subscribe((info) => {
      // SÓ atualiza a paginação E a view SE NÃO for o carregamento inicial
      // (a view inicial será atualizada pelo initializeClientState)
      if (!this.isLoadingClients) {
        this.paginationInfo = info;
        this.updatePaginatedView();
      }
    });

    // Se o array de clientes no serviço está vazio, chama o inicializador
    if (this.allClientControls.length === 0) {
      this.isLoadingClients = true;
      this.stateService.initializeClientState().subscribe({
        next: () => {
          // --- CORREÇÃO ---
          // Define a info de paginação APÓS carregar TUDO
          this.paginationInfo = this.stateService.paginationInfo.value;
          // Atualiza a view APÓS carregar TUDO
          this.updatePaginatedView();
          this.isLoadingClients = false; // Só libera a tela agora
        },
        error: (err) => {
          console.error('Erro ao inicializar estado:', err);
          this.isLoadingClients = false;
        },
      });
    } else {
      // O estado já estava carregado. Pega a paginação atual do serviço.
      this.paginationInfo = this.stateService.paginationInfo.value;
      this.isLoadingClients = false;
      this.updatePaginatedView(); // Atualiza a view com a página correta
    }
  }

  ngOnDestroy(): void {
    if (this.paginationSub) {
      this.paginationSub.unsubscribe();
    }
  }

  /**
   * Chamado pelo (pageChange) do paginador.
   * Apenas informa o serviço da nova página. Não chama API.
   */
  onPageChange(page: number): void {
    this.stateService.setCurrentPage(page);
  }

  /**
   * Pega o array completo de clientes (allClientControls)
   * e o fatia com base no paginationInfo.
   */
  private updatePaginatedView(): void {
    // Se não houver info de paginação (antes da 1ª carga), não faz nada ou mostra vazio
    if (!this.paginationInfo) {
      this.paginatedClientControls = []; // Mostra vazio até carregar
      return;
    }

    // Declaração correta das variáveis
    const page = this.paginationInfo.number;
    const size = this.paginationInfo.size;
    const startIndex = (page - 1) * size;
    const endIndex = page * size;

    // Fatia o array e garante que o tipo seja FormGroup[]
    this.paginatedClientControls = this.allClientControls.slice(
      startIndex,
      endIndex
    ) as FormGroup[];
  }

  // --- O resto dos métodos permanece o mesmo ---

  onAccordionOpen(clientGroup: AbstractControl): void {
    const group = clientGroup as FormGroup;
    if (group.get('isDataLoaded')?.value === true) {
      return;
    }

    const clientId = group.get('clientIbpjId')?.value;
    group.get('isLoadingDetails')?.setValue(true);

    this.stateService.getAccountDetails(clientId).subscribe((response) => {
      if (!response) {
        group.get('isLoadingDetails')?.setValue(false);
        return;
      }

      const semAcessoProfile: Profile = {
        profileId: 0,
        profileName: 'Sem acesso',
      };
      group.get('profiles')?.setValue([semAcessoProfile, ...response.profiles]);

      const accountsFormArray = group.get('accounts') as FormArray;
      response.accounts.forEach((account) => {
        accountsFormArray.push(
          this.stateService.buildAccountFormGroup(account)
        );
      });

      this.stateService.setupProfilePropagation(accountsFormArray);

      group.get('isDataLoaded')?.setValue(true);
      group.get('isLoadingDetails')?.setValue(false);
    });
  }

  limparSelecao(clientGroup: AbstractControl): void {
    const group = clientGroup as FormGroup;
    const accountsArray = group.get('accounts') as FormArray;

    accountsArray.controls.forEach((accountControl) => {
      accountControl.get('accessProfile')?.setValue(0);
    });
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
    console.log(this.stateService.getMappedValue());
  }

  getAccountControls(clientControl: AbstractControl): AbstractControl[] {
    const accounts = (clientControl as FormGroup).get('accounts') as FormArray;
    return accounts ? accounts.controls : [];
  }

  getProfileOptions(clientControl: AbstractControl): Profile[] {
    const profilesControl = (clientControl as FormGroup).get('profiles');
    return profilesControl ? profilesControl.value : [];
  }
}
