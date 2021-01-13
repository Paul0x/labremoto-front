import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ExperimentoComponent } from './experimento.component';
import { CountdownModule } from 'ngx-countdown';
import { ExperimentoService } from './experimento.service';
import { ComponentsModule } from 'app/components/components.module';

@NgModule({
  declarations: [ExperimentoComponent],
  imports: [
    CommonModule,
    ComponentsModule,
    CountdownModule
  ],
  providers: [ExperimentoService]
})
export class ExperimentoModule { }
