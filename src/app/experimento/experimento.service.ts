import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExperimentoService {

  constructor(private http: HttpClient) { }

  getEv3Data(timeStamp: number) {
    return this.http.get(environment.URLS.ev3Data + '?' + timeStamp);
  }
}
