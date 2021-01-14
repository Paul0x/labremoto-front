import { Component, OnInit, OnDestroy } from '@angular/core';
import { LaboratorioService } from 'app/services/laboratorio.service';
import { Router } from '@angular/router';
import { TokenService } from 'app/services/token.service';
import { environment } from 'environments/environment';
import { ExperimentoService } from './experimento.service';
import { Ev3Data } from './entities/ev3data';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ParametrosExperimentoRequest } from './entities/parametrosExperimentoRequest';
import { ToastrService } from 'ngx-toastr';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-experimento',
  templateUrl: './experimento.component.html',
  styleUrls: ['./experimento.component.css']
})
export class ExperimentoComponent implements OnInit, OnDestroy {

  sessaoAtiva: any = null;
  user: any = null;
  sessionCountdown = null;
  cameraVideoUrl;
  cameraTimestamp = 0;
  interval;
  currentExperimento = null;
  experimentos = [];

  ev3Data: Ev3Data = new Ev3Data();
  experimentoParametroForm: FormGroup;


  constructor(private labolatorioService: LaboratorioService,
    private tokenService: TokenService,
    private toastrService: ToastrService,
    private experimentoService: ExperimentoService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngOnDestroy() {
    clearInterval(this.interval);
  }

  ngOnInit() {
    this.interval = setInterval(() => { this.updateExperimentoData(); }, 153000);
    this.cameraVideoUrl = environment.URLS.cameraImg;
    this.labolatorioService.findSessaoAtiva().subscribe((resp: any) => {
      console.log(resp)
      if (resp == null || resp == undefined || resp.ativo === 0 || resp.matricula != this.tokenService.getMatricula()) {
        this.router.navigateByUrl("/");
      } else {
        this.sessaoAtiva = resp;
        this.sessaoAtiva.dtFim = new Date(resp.dtFim);
        const now = new Date();
        let countDown = Math.floor((this.sessaoAtiva.dtFim.getTime() - now.getTime()) / 1000);


        this.sessionCountdown = {
          leftTime: countDown
        }
        this.user = this.tokenService.getNome();
      }
    });
    this.getExperimentoAtivo();
  }

  getCameraImage() {
    return this.cameraVideoUrl + "?t" + this.cameraTimestamp;
  }

  updateExperimentoData() {
    this.cameraTimestamp++;
    this.getEv3Data()
  }

  getEv3Data() {
    this.experimentoService.getEv3Data(this.cameraTimestamp).subscribe((resp: Ev3Data) => {
      this.ev3Data = resp;
    });
  }

  openNewExperimentoModal() {
    $('#novoExperimentoModal').modal('show');
    this.experimentoService.getExperimentos().subscribe((resp: any) => {
      this.experimentos = resp;
    });
  }

  startExperimento(codigo: number) {
    if (isNaN(codigo)) {
      return;
    }

    this.experimentoService.startExperimento(codigo).subscribe((resp: any) => {
      if (resp.status === 200) {
        window.location.reload();
      }

    }, (err: any) => {

    });

  }

  getExperimentoAtivo() {
    this.experimentoService.getExperimentoAtivo().subscribe((resp: any) => {
      this.currentExperimento = resp;
      if (resp != null) {
        this.experimentoParametroForm = this.formBuilder.group(
          {
            algoritmoBusca: new FormControl(1),
            obstaculos: new FormControl(true, Validators.required),
            kp: new FormControl(0, Validators.required),
            kd: new FormControl(0, Validators.required),
            ki: new FormControl(0, Validators.required),
          }
        );

      }
    })
  }

  salvarParametrosExperimento() {
    const parametrosRequest = new ParametrosExperimentoRequest();
    if (this.currentExperimento.codExperimento === 1) {
      parametrosRequest.algoritmoBusca = this.experimentoParametroForm.get("algoritmoBusca").value;
    } else {
      parametrosRequest.algoritmoBusca = 0
    }

    parametrosRequest.obstaculos = this.experimentoParametroForm.get("obstaculos").value;
    parametrosRequest.kp = this.experimentoParametroForm.get("kp").value;
    parametrosRequest.ki = this.experimentoParametroForm.get("ki").value;
    parametrosRequest.kd = this.experimentoParametroForm.get("kd").value;

    this.experimentoService.setExperimentoParametros(parametrosRequest).subscribe((resp: any) => {
      console.log(resp);
      if(resp.body === true) {
        this.toastrService.success("Parâmetros salvos com sucesso.", "Sucesso", {
          positionClass: "toast-top-center",
          progressBar: true
        });
      }

    });

  }

}
