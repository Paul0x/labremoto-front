import { LoginService } from './login/services/login.service';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';
import { SharedDataService } from './services/SharedDataService';
import { HeaderInterceptorService } from './services/header-interceptor.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LoginModule,
    HttpClientModule,
    NgHttpLoaderModule,
    AppRoutingModule
  ],
  providers: [SharedDataService, LoginService],
  bootstrap: [AppComponent]
})
export class AppModule { }
