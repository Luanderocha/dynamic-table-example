// src/app/accordion/accordion.component.ts

import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
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
      multi: true,
    },
  ],
})
export class AccordionComponent implements OnInit, ControlValueAccessor {
  @Input() title: string = '';
  @Input() disabled = false;
  @Input() isLoading = false; // Este @Input ainda pode ser usado por você
  @Input() isOpen = false;

  @Output() opened: EventEmitter<void> = new EventEmitter<void>();

  public contentId: string = '';
  public checked: boolean = false;

  private onChange: (value: boolean) => void = () => {};
  private onTouched: () => void = () => {};

  constructor() {}

  writeValue(value: boolean): void {
    this.checked = value;
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  ngOnInit(): void {
    const randomPart = Math.random().toString(36).substring(2);
    this.contentId =
      (this.title.toLowerCase().replace(/\s/g, '-') || randomPart) + '-content';
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
    }
  }
}
