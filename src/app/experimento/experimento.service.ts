import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';
import { ParametrosExperimentoRequest } from './entities/parametrosExperimentoRequest';

@Injectable({
  providedIn: 'root'
})
export class ExperimentoService {

  constructor(private http: HttpClient) { }

  getEv3Data(timeStamp: number) {
    return this.http.get(environment.URLS.ev3Data + '?' + timeStamp);
  }

  getExperimentos() {
    return this.http.get(environment.URLS.getExperimentos);
  }

  startExperimento(codigo: number) {
    return this.http.post(environment.URLS.setExperimento, { codigo: codigo }, { observe: 'response' });
  }

  getExperimentoAtivo() {
    return this.http.get(environment.URLS.getExperimentoAtivo);
  }

  getExperimentoParametros(codigo: number) {
    return this.http.get(environment.URLS.experimentoParametros + "&codigo=" + codigo);
  }

  setExperimentoParametros(parametros: ParametrosExperimentoRequest) {
    return this.http.post(environment.URLS.experimentoParametros, parametros, { observe: "response" });
  }

}
