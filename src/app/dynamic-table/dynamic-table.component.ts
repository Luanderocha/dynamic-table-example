import { Component, Input, OnInit, OnChanges, SimpleChanges, Output, EventEmitter, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-dynamic-table',
  templateUrl: './dynamic-table.component.html',
  styleUrls: ['./dynamic-table.component.scss'],
  encapsulation: ViewEncapsulation.ShadowDom, // Mantido ShadowDom conforme configuração anterior
})
// Implementa OnInit e OnChanges
export class DynamicTableComponent implements OnInit, OnChanges {
  public readonly Math = Math;
  @Input() columns: any[] = [];
  @Input() data: any[] = [];
  @Input() itemsPerPage: number = 5;
  @Input() currentPage: number = 1;

  @Output() pageChange = new EventEmitter<number>(); // Evento para notificar mudança de página

  // Propriedades para controlar a ordenação
  sortedColumn: string | null = null;
  sortDirection: 'asc' | 'desc' = 'asc';

  // Propriedades calculadas para paginação
  totalPages: number = 1;
  paginatedData: any[] = []; // Dados a serem exibidos na página atual


  constructor() {}

  ngOnInit(): void {
    // Calcula a paginação inicial quando o componente é carregado
    this.calculatePagination();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Recalcula a paginação se dados, página atual ou itens por página mudarem
    // Verifica se a propriedade existe em 'changes' e se o valor realmente mudou
    const dataChanged = changes['data'] && !changes['data'].firstChange; // Não recalcular na primeira vez aqui, ngOnInit cuida disso
    const currentPageChanged = changes['currentPage'] && !changes['currentPage'].firstChange;
    const itemsPerPageChanged = changes['itemsPerPage'] && !changes['itemsPerPage'].firstChange;

    // Recalcula se qualquer um dos inputs relevantes mudou *após* a inicialização
    if (dataChanged || currentPageChanged || itemsPerPageChanged) {
       this.calculatePagination();
    }
    // Caso especial: Se os dados mudam e a página atual se torna inválida (ex: deletar itens)
    // A lógica em calculatePagination já ajusta currentPage se necessário.
  }

  // Calcula a fatia de dados para a página atual e o total de páginas
  calculatePagination(): void {
    if (!this.data || this.data.length === 0) {
      this.totalPages = 1;
      this.paginatedData = [];
      // Garante que a página atual seja 1 se não houver dados
      if (this.currentPage !== 1) {
         // Se a página atual não for 1, notifica o pai para resetar.
         // Isso evita inconsistência se os dados forem removidos enquanto em outra página.
         // this.pageChange.emit(1); // Opcional: Forçar reset no pai
      }
      return;
    }

    this.totalPages = Math.ceil(this.data.length / this.itemsPerPage);

    // Garante que a página atual esteja dentro dos limites válidos (1 a totalPages)
    // Importante fazer isso *antes* de calcular o slice
    const validCurrentPage = Math.max(1, Math.min(this.currentPage, this.totalPages));

    // Se a página atual precisou ser ajustada (ex: era 5, mas só há 3 páginas agora),
    // notifica o componente pai sobre a página válida.
    if (validCurrentPage !== this.currentPage) {
        // É importante notificar o pai para que o estado fique sincronizado.
        this.pageChange.emit(validCurrentPage);
        // Nota: O ngOnChanges será acionado novamente devido à mudança no Input currentPage,
        // e calculatePagination será chamado de novo com a página correta.
        // Por isso, não precisamos definir this.paginatedData aqui neste if.
        return; // Sai para evitar calcular com a página antiga
    }


    const startIndex = (validCurrentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    // Pega a fatia dos dados *completos* (this.data)
    this.paginatedData = this.data.slice(startIndex, endIndex);
  }

  // Método chamado ao clicar no cabeçalho de uma coluna
  sortTable(field: string): void {
    // Encontra a definição da coluna para verificar se é ordenável
    const columnDefinition = this.columns.find(col => col.field === field);
    if (!columnDefinition?.sortable) {
      return; // Não faz nada se a coluna não for ordenável
    }

    if (this.sortedColumn === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortedColumn = field;
      this.sortDirection = 'asc';
    }

    // Cria uma cópia para não modificar o array original diretamente se ele vier de fora
    // Embora neste caso o pai passe uma cópia, é uma boa prática.
    const dataToSort = [...this.data];

    // Ordena a cópia do array 'data' completo
    dataToSort.sort((a, b) => {
      const valueA = a[field];
      const valueB = b[field];

      // Tratamento básico para comparação (pode ser melhorado para tipos específicos)
      let comparison = 0;
      if (valueA > valueB || valueA === undefined) {
        comparison = 1;
      } else if (valueA < valueB || valueB === undefined) {
        comparison = -1;
      }
      return this.sortDirection === 'desc' ? comparison * -1 : comparison;
    });

    // Atualiza o array de dados principal com a versão ordenada
    // Isso é crucial porque calculatePagination usa this.data
    this.data = dataToSort;

    // Após ordenar, recalcula a página atual para exibir os dados corretos
    // Isso usará o this.data já ordenado
    this.calculatePagination();
  }

  // Emite o evento para mudar de página
  goToPage(page: number): void {
    // Verifica se a página solicitada é válida e diferente da atual
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page); // Notifica o componente pai
    }
  }
}
