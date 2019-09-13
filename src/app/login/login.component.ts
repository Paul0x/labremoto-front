import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoginDTO } from './dto/login-dto';
import { LoginService } from './services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  loginDTO: LoginDTO = new LoginDTO();
  constructor( private loginService: LoginService) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      login: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required)
    });
  }

  authUser() {
      // this.loginService.authUser(this.loginDTO);
  }
}
