import { Component, OnInit } from '@angular/core';
import { LaboratorioService } from 'app/services/laboratorio.service';
import { Router } from '@angular/router';
import { TokenService } from 'app/services/token.service';
import { environment } from 'environments/environment';

@Component({
  selector: 'app-experimento',
  templateUrl: './experimento.component.html',
  styleUrls: ['./experimento.component.css']
})
export class ExperimentoComponent implements OnInit {

  constructor(private labolatorioService: LaboratorioService,
    private tokenService: TokenService,
    private router: Router) { }

  sessaoAtiva: any = null;
  user: any = null;
  sessionCountdown = null;
  cameraVideoUrl;
  cameraTimestamp = 0;
  interval;

  ngOnInit() {
    this.interval = setInterval(() => { this.updateCameraTimestamp(); }, 300);
    this.cameraVideoUrl = environment.URLS.cameraImg;
    this.labolatorioService.findSessaoAtiva().subscribe((resp: any) => {
      if (resp == null || resp.ativo === 0 || resp.matricula != this.tokenService.getMatricula()) {
        this.router.navigateByUrl("/");
      } else {
        this.sessaoAtiva = resp;
        this.sessaoAtiva.dt_fim = new Date(resp.dt_fim);
        const now = new Date();
        let countDown = Math.floor((this.sessaoAtiva.dt_fim.getTime() - now.getTime())  / 1000);

        
        this.sessionCountdown = {
          leftTime: countDown
        }
        this.user = this.tokenService.getNome();
      }
    });
  }

  getCameraImage() {
    return this.cameraVideoUrl + "?t" + this.cameraTimestamp;
  }

  updateCameraTimestamp() {
    this.cameraTimestamp++;
  }

}
