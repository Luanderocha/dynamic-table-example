// src/app/accordion/accordion.component.ts

import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  OnInit,
  Output,
  Renderer2,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AccordionComponent),
      multi: true
    }
  ]
})
// O ngAfterViewChecked não é mais necessário aqui
export class AccordionComponent implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor {

  @Input() title: string = '';
  @Input() disabled = false;
  @Input() isLoading = false;
  @Input() isOpen = false;

  @Output() opened: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('bodyEl') bodyEl!: ElementRef<HTMLDivElement>;

  public contentId: string = '';
  public checked: boolean = false;

  // A propriedade 'shouldUpdateHeight' foi removida.
  // A propriedade 'lastHeight' foi removida.

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  constructor(private readonly renderer: Renderer2) { }

  writeValue(value: boolean): void { this.checked = value; }
  registerOnChange(fn: any): void { this.onChange = fn; }
  registerOnTouched(fn: any): void { this.onTouched = fn; }
  setDisabledState?(isDisabled: boolean): void { this.disabled = isDisabled; }

  ngOnInit(): void {
    const randomPart = Math.random().toString(36).substring(2);
    this.contentId = (this.title.toLowerCase().replace(/\s/g, '-') || randomPart) + '-content';
  }

  ngAfterViewInit(): void {
    // Garantimos que ele comece fechado visualmente
    this.setHeight(0);
  }
  
  // A lógica do isLoading continua útil para o futuro
  ngOnChanges(changes: SimpleChanges): void {
    const isLoading = changes['isLoading']?.currentValue;
    // Se estiver aberto E o isLoading mudar para true, recalculamos a altura
    if (this.isOpen && isLoading) {
      this.calculateAndSetHeight();
    }
  }

  // O ngAfterViewChecked foi completamente removido.

  onCheckboxChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    this.onTouched();
    this.onChange(this.checked);
  }

  // ==================== MÉTODO 'toggle' ATUALIZADO ====================
  toggle(): void {
    if (this.disabled) return;
    
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.opened.emit();
      // Em vez de usar uma flag, calculamos a altura diretamente,
      // mas adiamos com setTimeout para esperar a renderização.
      this.calculateAndSetHeight();
    } else {
      // Para fechar, a altura é sempre 0.
      this.setHeight(0);
    }
  }

  // ==================== NOVO MÉTODO HELPER ====================
  private calculateAndSetHeight(): void {
    setTimeout(() => {
      if (this.bodyEl?.nativeElement) {
        const height = this.bodyEl.nativeElement.scrollHeight;
        this.setHeight(height);
      }
    }, 0); // O '0' é a chave!
  }

  private setHeight(height: number): void {
    if (this.bodyEl?.nativeElement) {
      this.renderer.setStyle(this.bodyEl.nativeElement, 'height', `${height}px`);
    }
  }
}