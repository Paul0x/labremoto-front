import { HistoryListComponent } from './history/history-list/history-list.component';
import { CalendarComponent } from './calendar/calendar.component';
import { SetupComponent } from './session/setup/setup.component';
import { MainPageComponent } from './main-page/main-page.component';
import { WonderwallComponent } from './wonderwall/wonderwall.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ExperimentoComponent } from './experimento/experimento.component';


const routes: Routes = [
    {path: '', component: MainPageComponent},
    {path: 'login', component: LoginComponent},
    {path: 'wonderwall/:token', component: WonderwallComponent},
    {path: 'logout/:token', component: WonderwallComponent},
    {path: 'setup', component: SetupComponent},
    {path: 'agenda', component: CalendarComponent},
    {path: 'historico', component: HistoryListComponent},
    {path: 'experimento', component: ExperimentoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
