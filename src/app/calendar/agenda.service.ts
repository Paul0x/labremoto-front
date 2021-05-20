import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AgendaService {

  constructor(private http: HttpClient) { }

  getListaAgendaUsuario() {
    return this.http.get(environment.URLS.getListAgendaUsuario);
  }

  getListaAgendaFull(dtInicio: string, dtFim: string) {
    return this.http.get(environment.URLS.getListAgendaAll + '&dtInicio=' + dtInicio + '&dtFim=' + dtFim );
  }
}
