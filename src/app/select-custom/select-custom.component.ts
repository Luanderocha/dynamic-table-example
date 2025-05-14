// /home/luanderson/projects/custom-table/src/app/select-custom/select-custom.component.ts
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  HostListener,
  OnInit,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';

// Defina a interface aqui ou importe-a se já existir em outro lugar
export interface SelectItem {
  label: string;
  value: any;
}

@Component({
  selector: 'app-select-custom',
  templateUrl: './select-custom.component.html',
  styleUrls: ['./select-custom.component.scss'],
})
export class SelectCustomComponent implements OnInit, OnChanges {
  @Input() suaLista: SelectItem[] = [
    { label: 'Opção 1', value: 'valor1' },
    { label: 'Opção 2', value: 'valor2' },
    { label: 'Opção 3', value: 'valor3' },
  ];
  @Input() selectedValue: any;
  @Input() placeholder: string = 'Selecione';
  @Input() dropDirection: 'up' | 'down' | 'auto' = 'up';
  @Input() optionsMaxHeight: number = 200; // Altura máxima em pixels para a lista de opções

  @Output() selectionChange = new EventEmitter<any>();

  @ViewChild('optionsList') optionsList!: ElementRef<HTMLUListElement>;

  isOpen = false;
  actualDropDirection: 'up' | 'down' = 'down'; // Padrão para baixo

  constructor(private elRef: ElementRef) {}

  ngOnInit() {
    this.calculateAndSetDropDirection();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (
      changes['dropDirection'] ||
      changes['suaLista'] ||
      changes['optionsMaxHeight']
    ) {
      // Recalcular se a direção preferida ou o conteúdo/altura máxima mudarem
      // A recalcularão principal ocorre ao abrir, mas isso pode ajustar o estado inicial
      if (!this.isOpen) {
        this.calculateAndSetDropDirection();
      }
    }
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target) && this.isOpen) {
      this.isOpen = false;
    }
  }

  private calculateAndSetDropDirection() {
    if (this.dropDirection === 'up') {
      this.actualDropDirection = 'up';
      return;
    }
    if (this.dropDirection === 'down') {
      this.actualDropDirection = 'down';
      return;
    }

    // Modo 'auto'
    if (this.elRef && this.elRef.nativeElement) {
      const selectRect = this.elRef.nativeElement.getBoundingClientRect();
      const spaceBelow = window.innerHeight - selectRect.bottom;
      const spaceAbove = selectRect.top;
      const requiredHeight = this.optionsMaxHeight;

      if (spaceBelow >= requiredHeight) {
        this.actualDropDirection = 'down'; // Espaço suficiente abaixo
      } else if (spaceAbove >= requiredHeight) {
        this.actualDropDirection = 'up'; // Não há espaço suficiente abaixo, mas há acima
      } else {
        // Não há espaço suficiente em nenhuma direção para a altura máxima
        // Escolhe a direção com mais espaço. Em caso de empate, prefere para baixo.
        this.actualDropDirection = spaceAbove > spaceBelow ? 'up' : 'down';
      }
    } else {
      this.actualDropDirection = 'down'; // Fallback
    }
  }

  toggleOptions() {
    if (!this.isOpen) {
      // Calcula a direção pouco antes de abrir, pois a posição do elemento pode ter mudado (scroll, etc.)
      this.calculateAndSetDropDirection();
    }
    this.isOpen = !this.isOpen;
  }

  selectOption(item: SelectItem) {
    this.selectedValue = item.value;
    this.isOpen = false;
    this.selectionChange.emit(item.value);
    // $event.stopPropagation() será adicionado no template
  }

  get displayLabel(): string {
    if (this.selectedValue !== undefined && this.selectedValue !== null) {
      const selectedItem = this.suaLista.find(
        (item) => item.value === this.selectedValue
      );
      return selectedItem ? selectedItem.label : String(this.selectedValue); // Fallback para o valor se o label não for encontrado
    }
    return this.placeholder;
  }
}
