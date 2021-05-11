import { LaboratorioService } from './../services/laboratorio.service';
import { Component, OnInit } from '@angular/core';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(private laboratorioService: LaboratorioService,
    private router: Router,
     private tokenService: TokenService) { }

  laboratorioAtivo: any = null;

  ngOnInit() {
    this.laboratorioService.findSessaoAtiva().subscribe((resp: any) => {
      if(resp === null || resp === []) {
        return;
      }
      this.laboratorioAtivo = resp;
      if(this.laboratorioAtivo.matricula == this.tokenService.getMatricula()) {
        this.router.navigateByUrl("/experimento");
      }
    })

  }

}
