import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalAlertComponent } from './modal-alert/modal-alert.component';



@NgModule({
  declarations: [ModalAlertComponent],
  imports: [
    CommonModule
  ],
  exports: [ModalAlertComponent]
})
export class ComponentsModule { }
