import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnChanges {

  @Input() currentPage: number = 1;
  @Input() totalPages: number = 1;
  
  // Emite o NOVO número da página
  @Output() pageChange: EventEmitter<number> = new EventEmitter<number>();

  public pages: number[] = [];

  constructor() { }

  ngOnChanges(changes: SimpleChanges): void {
    // Se 'totalPages' mudar, recalcula o array de números [1, 2, 3]
    if (changes['totalPages']) {
      this.pages = this.generatePagesArray(this.totalPages);
    }
  }

  private generatePagesArray(totalPages: number): number[] {
    // Cria um array [1, 2, 3, ..., totalPages]
    return Array(totalPages).fill(0).map((x, i) => i + 1);
  }

  goToPage(page: number): void {
    if (page === this.currentPage || page < 1 || page > this.totalPages) {
      return; // Não faz nada se a página for inválida ou a mesma
    }
    this.pageChange.emit(page);
  }

  onPrevious(): void {
    this.goToPage(this.currentPage - 1);
  }

  onNext(): void {
    this.goToPage(this.currentPage + 1);
  }
}