import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ExperimentoComponent } from './experimento.component';
import { CountdownModule } from 'ngx-countdown';

@NgModule({
  declarations: [ExperimentoComponent],
  imports: [
    CommonModule,
    CountdownModule
  ]
})
export class ExperimentoModule { }
