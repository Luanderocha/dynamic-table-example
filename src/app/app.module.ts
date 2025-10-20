import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AccordionListComponent } from './accordion-list/accordion-list.component';
import { AccordionComponent } from './accordion/accordion.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DynamicTableComponent } from './dynamic-table/dynamic-table.component';
import { SelectCustomComponent } from './select-custom/select-custom.component';
import { StepperComponent } from './stepper/stepper.component';
import { SelectComponent } from './select/select.component';

@NgModule({
  declarations: [
    AppComponent,
    DynamicTableComponent,
    SelectCustomComponent,
    StepperComponent,
    AccordionListComponent,
    AccordionComponent,
    SelectComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
