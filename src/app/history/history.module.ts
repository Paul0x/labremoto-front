import { NgModule } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HistoryListComponent } from './history-list/history-list.component';
import { HistoryService } from './history.service';
import { RouterModule } from '@angular/router';
import { HistoryExperimentoComponent } from './history-experimento/history-experimento.component';

@NgModule({
  declarations: [HistoryListComponent, HistoryExperimentoComponent],
  imports: [
    CommonModule,
    RouterModule
  ],
  providers: [HistoryService, DatePipe]
})
export class HistoryModule { }
