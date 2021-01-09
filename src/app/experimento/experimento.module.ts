import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ExperimentoComponent } from './experimento.component';
import { CountdownModule } from 'ngx-countdown';
import { ExperimentoService } from './experimento.service';

@NgModule({
  declarations: [ExperimentoComponent],
  imports: [
    CommonModule,
    CountdownModule
  ],
  providers: [ExperimentoService]
})
export class ExperimentoModule { }
