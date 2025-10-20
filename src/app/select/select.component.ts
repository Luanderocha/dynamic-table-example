import { Component, Input, OnChanges, SimpleChanges, forwardRef, HostListener, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectComponent),
      multi: true
    }
  ]
})
export class SelectComponent implements ControlValueAccessor, OnChanges {

  @Input() options: any[] = [];
  @Input() optionValue: string = 'value'; // A propriedade do objeto-opção a ser usada como valor
  @Input() optionLabel: string = 'label'; // A propriedade do objeto-opção a ser usada como texto
  @Input() placeholder: string = 'Selecione';

  public isOpen: boolean = false;
  public selectedLabel: string = '';
  private selectedValue: any = null;

  // Funções 'onChange' e 'onTouched' que o Angular Forms nos dará
  private onChange: (value: any) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private elRef: ElementRef) {
    this.selectedLabel = this.placeholder;
  }

  // Detecta cliques fora do componente para fechá-lo
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    if (!this.elRef.nativeElement.contains(event.target)) {
      this.isOpen = false;
    }
  }

  // Chamado pelo Angular Forms quando o valor do modelo muda
  writeValue(value: any): void {
    this.selectedValue = value;
    this.updateSelectedLabel(value);
  }

  // Registra a função de callback para quando o valor muda
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registra a função de callback para quando o componente é "tocado"
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Detecta mudanças nas 'options' (ex: quando chegam da API)
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['options'] && this.options) {
      // Re-atualiza o label caso as opções cheguem depois do valor
      this.updateSelectedLabel(this.selectedValue);
    }
  }

  // Abre/fecha o dropdown
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
    this.onTouched(); // Marca o controle como "tocado"
  }

  // Chamado quando o usuário clica em uma opção
  selectOption(option: any): void {
    const newValue = option[this.optionValue];
    
    this.selectedValue = newValue;
    this.selectedLabel = option[this.optionLabel];
    
    this.onChange(newValue); // Informa ao Angular Forms sobre o novo valor
    this.onTouched();
    
    this.isOpen = false;
  }

  // Helper para atualizar o label exibido
  private updateSelectedLabel(value: any): void {
    if (this.options && this.options.length > 0) {
      const selectedOption = this.options.find(o => o[this.optionValue] == value);
      this.selectedLabel = selectedOption ? selectedOption[this.optionLabel] : this.placeholder;
    } else {
      this.selectedLabel = this.placeholder;
    }
  }
}