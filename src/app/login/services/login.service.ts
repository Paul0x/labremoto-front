import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { SharedDataService } from 'src/app/services/SharedDataService';
import { environment } from 'src/environments/environment';
import { LoginDTO } from '../dto/login-dto';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private _http: HttpClient) { }

  authUser(dto: LoginDTO) {
    return this._http.post(environment.URLS.login, dto);
  }
}
