import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, Renderer2 } from '@angular/core';
import { UserRegisterStateService } from './services/user-register-state.service';
import { Step } from './stepper/step.interface';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [UserRegisterStateService],
})
export class AppComponent implements OnInit {
  title = 'custom-table';

  currentPage = 1;
  itemsPerPage = 5;

  colunasTabela: any[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'nome', header: 'Nome', sortable: true },
    { field: 'idade', header: 'Idade' },
    { field: 'cidade', header: 'Cidade' },
    { field: 'test1', header: 'test1' },
    { field: 'test2', header: 'test2' },
    { field: 'test3', header: 'test3' },
    { field: 'test4', header: 'test4' },
    { field: 'test5', header: 'test5' },
  ];

  dadosTabela: any[] = [
    {
      id: 1,
      nome: 'Carla Dias',
      idade: 42,
      cidade: 'São Paulo',
      test1: 'test1',
      test2: 'test2',
      test3: 'test3',
      test4: 'test4',
      test5: 'test5',
    }, // Idade maior
    {
      id: 2,
      nome: 'Ana Silva',
      idade: 30,
      cidade: 'Rio de Janeiro',
      test1: 'test1',
      test2: 'test2',
      test3: 'test3',
      test4: 'test4',
      test5: 'test5',
    }, // Nome começa com A
    {
      id: 3,
      nome: 'Carla Dias',
      idade: 42,
      cidade: 'Belo Horizonte',
      test1: 'test1',
      test2: 'test2',
      test3: 'test3',
      test4: 'test4',
      test5: 'test5',
    },
    {
      id: 4,
      nome: 'Daniel Souza',
      idade: 19,
      cidade: 'Salvador',
      test1: 'test1',
      test2: 'test2',
      test3: 'test3',
      test4: 'test4',
      test5: 'test5',
    }, // Idade menor
    {
      id: 5,
      nome: 'Igor Rocha',
      idade: 31,
      cidade: 'Curitiba',
      test1: 'test1',
      test2: 'test2',
      test3: 'test3',
      test4: 'test4',
      test5: 'test5',
    }, // Nome com I
    {
      id: 6,
      nome: 'Fernanda Almeida',
      idade: 35,
      cidade: 'Porto Alegre',
      test1: 'test1',
      test2: 'test2',
      test3: 'test3',
      test4: 'test4',
      test5: 'test5',
    },
    {
      id: 7,
      nome: 'Gabriel Martins',
      idade: 22,
      cidade: 'Florianópolis',
      test1: 'test1',
      test2: 'test2',
      test3: 'test3',
      test4: 'test4',
      test5: 'test5',
    },
    {
      id: 8,
      nome: 'Helena Ferreira',
      idade: 27,
      cidade: 'Recife',
      test1: 'test1',
      test2: 'test2',
      test3: 'test3',
      test4: 'test4',
      test5: 'test5',
    },
    {
      id: 9,
      nome: 'Eduardo Lima',
      idade: 28,
      cidade: 'Fortaleza',
      test1: 'test1',
      test2: 'test2',
      test3: 'test3',
      test4: 'test4',
      test5: 'test5',
    }, // Nome com E
    {
      id: 10,
      nome: 'Bruno Costa',
      idade: 25,
      cidade: 'Brasília',
      test1: 'test1',
      test2: 'test2',
      test3: 'test3',
      test4: 'test4',
      test5: 'test5',
    }, // Adicionado mais um
  ];

  meusSteps: Step[] = [
    { label: 'Dados Cadastrais' },
    { label: 'Empresas, Contas e Perfis' },
    { label: 'Valor de alçada' },
    { label: 'Etapa louca' },
    { label: 'Confirmação' },
  ];

  isDarkMode = false;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document,
    private stateService: UserRegisterStateService
  ) {}

  ngOnInit(): void {
    // Opcional: Verificar preferência de tema salva no localStorage
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      this.isDarkMode = true;
      this.renderer.addClass(this.document.body, 'dark-theme');
    } else {
      this.isDarkMode = false;
      // Garanta que a classe dark-theme não esteja presente se o tema salvo for light ou não existir
      this.renderer.removeClass(this.document.body, 'dark-theme');
    }
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    if (this.isDarkMode) {
      this.renderer.addClass(this.document.body, 'dark-theme');
      localStorage.setItem('theme', 'dark'); // Salva a preferência
    } else {
      this.renderer.removeClass(this.document.body, 'dark-theme');
      localStorage.setItem('theme', 'light'); // Salva a preferência
    }
  }

  onPageChanged(newPage: number): void {
    this.currentPage = newPage;
  }

  // O botão 'Continuar' do seu stepper vai checar isso
  isStepValid(): boolean {
    return this.stateService.isFormValid;
  }

  // O botão 'Continuar' do seu stepper vai chamar isso
  onContinue(): void {
    if (this.isStepValid()) {
      const formData = this.stateService.getMappedValue();
      console.log('Dados do passo 2:', formData);
      // ... (navega para o próximo passo)
    }
  }
}
