import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'custom-table';

  currentPage = 1;
  itemsPerPage = 5; // Defina o número de itens por página desejado

  // Definição das colunas para a tabela dinâmica
  colunasTabela: any[] = [
    { field: 'id', header: 'ID', sortable: true },
    { field: 'nome', header: 'Nome' , sortable: true},
    { field: 'idade', header: 'Idade' },
    { field: 'cidade', header: 'Cidade' },
    { field: 'test1', header: 'test1' },
    { field: 'test2', header: 'test2' },
    { field: 'test3', header: 'test3' },
    { field: 'test4', header: 'test4' },
    { field: 'test5', header: 'test5' },

  ];

  // Dados de exemplo para a tabela dinâmica
  dadosTabela: any[] = [
    { id: 1, nome: 'Carla Dias', idade: 42, cidade: 'São Paulo', test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4', test5: 'test5' }, // Idade maior
    { id: 2, nome: 'Ana Silva', idade: 30, cidade: 'Rio de Janeiro' , test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4', test5: 'test5' }, // Nome começa com A
    { id: 3, nome: 'Carla Dias', idade: 42, cidade: 'Belo Horizonte' , test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4', test5: 'test5' },
    { id: 4, nome: 'Daniel Souza', idade: 19, cidade: 'Salvador' , test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4', test5: 'test5' }, // Idade menor
    { id: 5, nome: 'Igor Rocha', idade: 31, cidade: 'Curitiba' , test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4', test5: 'test5' }, // Nome com I
    { id: 6, nome: 'Fernanda Almeida', idade: 35, cidade: 'Porto Alegre' , test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4', test5: 'test5' },
    { id: 7, nome: 'Gabriel Martins', idade: 22, cidade: 'Florianópolis' , test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4', test5: 'test5' },
    { id: 8, nome: 'Helena Ferreira', idade: 27, cidade: 'Recife' , test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4', test5: 'test5' },
    { id: 9, nome: 'Eduardo Lima', idade: 28, cidade: 'Fortaleza' , test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4', test5: 'test5' }, // Nome com E
    { id: 10, nome: 'Bruno Costa', idade: 25, cidade: 'Brasília' , test1: 'test1', test2: 'test2', test3: 'test3', test4: 'test4', test5: 'test5' } // Adicionado mais um
  ];

  onPageChanged(newPage: number): void {
    this.currentPage = newPage;
  }
}
