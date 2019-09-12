import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgHttpLoaderModule } from 'ng-http-loader';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginModule } from './login/login.module';
import { SharedDataService } from './services/SharedDataService';
import { HeaderInterceptorService } from './services/header-interceptor.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';

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
  providers: [SharedDataService, HeaderInterceptorService, HttpClient],
  bootstrap: [AppComponent]
})
export class AppModule { }
