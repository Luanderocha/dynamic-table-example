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
export class AccordionComponent implements OnInit, AfterViewInit, OnChanges, ControlValueAccessor {

  @Input() title: string = '';
  @Input() disabled = false;
  @Input() isLoading = false;
  @Input() isOpen = false;

  @Output() opened: EventEmitter<void> = new EventEmitter<void>();

  @ViewChild('bodyEl') bodyEl!: ElementRef<HTMLDivElement>;

  public contentId: string = '';
  public checked: boolean = false;

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
    this.setHeight(0);
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    const isLoading = changes['isLoading']?.currentValue;
    if (this.isOpen && isLoading) {
      this.calculateAndSetHeight();
    }
  }

  onCheckboxChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.checked = input.checked;
    this.onTouched();
    this.onChange(this.checked);
  }

  toggle(): void {
    if (this.disabled) return;
    
    this.isOpen = !this.isOpen;

    if (this.isOpen) {
      this.opened.emit();
      // Esta chamada inicial mede o spinner
      this.calculateAndSetHeight();
    } else {
      this.setHeight(0);
    }
  }

  // ==================== MÉTODO ATUALIZADO ====================
  // Agora é 'public' e verifica se está aberto
  public calculateAndSetHeight(): void {
    // Se não estiver aberto, não há o que calcular
    if (!this.isOpen) {
      return;
    }
    
    setTimeout(() => {
      if (this.bodyEl?.nativeElement) {
        const height = this.bodyEl.nativeElement.scrollHeight;
        this.setHeight(height);
      }
    }, 0); 
  }
  // ==========================================================

  private setHeight(height: number): void {
    if (this.bodyEl?.nativeElement) {
      this.renderer.setStyle(this.bodyEl.nativeElement, 'height', `${height}px`);
    }
  }
}