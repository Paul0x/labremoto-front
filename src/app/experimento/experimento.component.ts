import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import { LaboratorioService } from 'app/services/laboratorio.service';
import { Router } from '@angular/router';
import { TokenService } from 'app/services/token.service';
import { environment } from 'environments/environment';
import { ExperimentoService } from './experimento.service';
import { Ev3Data } from './entities/ev3data';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ParametrosExperimentoRequest } from './entities/parametrosExperimentoRequest';
import { ToastrService } from 'ngx-toastr';
import { InstrucaoTrajetoria } from './entities/instrucaoTrajetoria';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/fromEvent';

declare var jquery: any;
declare var $: any;

@Component({
  selector: 'app-experimento',
  templateUrl: './experimento.component.html',
  styleUrls: ['./experimento.component.css']
})
export class ExperimentoComponent implements OnInit, OnDestroy, AfterViewInit {

  sessaoAtiva: any = null;
  user: any = null;
  sessionCountdown = null;
  cameraVideoUrl;
  cameraTimestamp = 0;
  interval;
  currentExperimento = null;
  currentExperimentoInstrucoes = [];
  experimentos = [];
  apontar = {
    goalX: 0,
    goalY: 0
  }
  experimentoRunStatus = 0;
  ev3Data: Ev3Data = new Ev3Data();
  
  experimentoParametroForm: FormGroup;
  parametrosSalvosErr = false;
  parametrosSalvosOk = false;
  expInstrucaoForm: FormGroup;

  @ViewChild('cameraWrap', { static: false }) cameraWrapEl: ElementRef;

  constructor(private labolatorioService: LaboratorioService,
    private tokenService: TokenService,
    private toastrService: ToastrService,
    private experimentoService: ExperimentoService,
    private formBuilder: FormBuilder,
    private router: Router) { }

  ngAfterViewInit() {

  }
  ngOnDestroy() {
    clearInterval(this.interval);
  }

  ngOnInit() {
    this.updateExperimentoData();
    this.interval = setInterval(() => { this.updateExperimentoData(); }, 20000);
    this.cameraVideoUrl = environment.URLS.cameraImg;
    this.labolatorioService.findSessaoAtiva().subscribe((resp: any) => {
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
        this.getExperimentoAtivo();
      }
    });

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
      if(this.ev3Data.running == 1) {
        this.experimentoRunStatus = 2;
      }
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
        this.getExperimentoParametros();
        if (resp.codExperimento == 2) {
          this.getExperimentoInstrucoes();
        }
      }
    })
  }

  getExperimentoParametros() {
    if (this.currentExperimento == null) {
      return;
    }

    this.experimentoService.getExperimentoParametros(this.currentExperimento.codigo).subscribe((resp: any) => {
      this.experimentoParametroForm.get("obstaculos").setValue(Boolean(resp.obstaculos));
      this.experimentoParametroForm.get("kp").setValue(resp.kp);
      this.experimentoParametroForm.get("ki").setValue(resp.ki);
      this.experimentoParametroForm.get("kd").setValue(resp.kd);
      if (this.currentExperimento.codExperimento === 1) {
        this.experimentoParametroForm.get("algoritmoBusca").setValue(resp.algoritmoBusca);
      }
    });

  }

  salvarParametrosExperimento() {
    const parametrosRequest = new ParametrosExperimentoRequest();
    if (parseInt(this.currentExperimento.codExperimento) === 1) {
      parametrosRequest.objetivoX = this.apontar.goalX;
      parametrosRequest.objetivoY = this.apontar.goalY;
      parametrosRequest.algoritmoBusca = this.experimentoParametroForm.get("algoritmoBusca").value;
    } else {
      parametrosRequest.algoritmoBusca = 0
    }

    parametrosRequest.obstaculos = this.experimentoParametroForm.get("obstaculos").value;
    parametrosRequest.kp = this.experimentoParametroForm.get("kp").value;
    parametrosRequest.ki = this.experimentoParametroForm.get("ki").value;
    parametrosRequest.kd = this.experimentoParametroForm.get("kd").value;

    this.experimentoService.setExperimentoParametros(parametrosRequest).subscribe((resp: any) => {
      if (resp.body === true) {
        this.toastrService.success("Parâmetros salvos com sucesso.", "Sucesso");
        this.parametrosSalvosErr = false;
        this.parametrosSalvosOk = true;
      } else {
        this.parametrosSalvosErr = true;
        this.parametrosSalvosOk = false;
      }
    }, (err: any) => {
      this.parametrosSalvosErr = true;
      this.parametrosSalvosOk = false;
    });

  }

  openInstrucoesModal() {
    $('#instrucoesModal').modal('show');
    this.expInstrucaoForm = this.formBuilder.group({
      tipoInstrucao: new FormControl(1),
      velLinear: new FormControl(null),
      velAngular: new FormControl(null),
      rotAngulo: new FormControl(null),
      timer: new FormControl(null)
    });
  }

  resetExpInstrucaoQuant() {
    this.expInstrucaoForm.get("velLinear").setValue(null);
    this.expInstrucaoForm.get("velAngular").setValue(null);
    this.expInstrucaoForm.get("rotAngulo").setValue(null);

  }

  addInstrucaoToArray() {
    const instrucao = new InstrucaoTrajetoria();
    instrucao.tipo = parseInt(this.expInstrucaoForm.get("tipoInstrucao").value);

    switch (instrucao.tipo) {
      case 1:
        instrucao.velLinear = this.expInstrucaoForm.get("velLinear").value;
        instrucao.timer = this.expInstrucaoForm.get("timer").value;
        break;
      case 2:
        instrucao.velLinear = this.expInstrucaoForm.get("velLinear").value;
        instrucao.velAngular = this.expInstrucaoForm.get("velAngular").value;
        instrucao.timer = this.expInstrucaoForm.get("timer").value;
        break;
      case 3:
        instrucao.rotAngulo = this.expInstrucaoForm.get("rotAngulo").value;
        instrucao.timer = this.expInstrucaoForm.get("timer").value;
        break;
      case 4:
        instrucao.timer = this.expInstrucaoForm.get("timer").value;
        break;
    }

    this.currentExperimentoInstrucoes.push(instrucao);
    this.resetExpInstrucaoQuant();
    console.log(this.currentExperimentoInstrucoes);


  }

  getTipoInstrucaoLabel(tipo: number) {
    switch (tipo) {
      case 1:
        return "Andar Reto";
      case 2:
        return "Realizar Curva";
      case 3:
        return "Rotacionar";
      case 4:
        return "Parar";
    }
  }

  getTipoInstrucaoValor(instrucao: InstrucaoTrajetoria) {
    switch (instrucao.tipo) {
      case 1:
        return "Vel Linear: " + instrucao.velLinear + "m/s";
      case 2:
        return "Vel Linear: " + instrucao.velLinear + "m/s | Vel Angular: " + instrucao.velLinear + "rad/s";
      case 3:
        return "Ângulo: " + instrucao.rotAngulo.toFixed(2) + "º";
      case 4:
        return "-";
    }
  }

  updateInstrucoesExperimento() {
    this.experimentoService.setExperimentoInstrucoes(this.currentExperimentoInstrucoes).subscribe((resp: any) => {
      if (resp.body === true) {
        $('#instrucoesModal').modal('hide');
      }
    });
  }

  getExperimentoInstrucoes() {
    this.experimentoService.getExperimentoInstrucoes(this.currentExperimento.codigo).subscribe((resp: any) => {
      this.currentExperimentoInstrucoes = this.parseInstrucoes(resp);
    });
  }

  parseInstrucoes(instrucoesArr: any) {
    let parsedInstrucoes = [];
    for (let instrucaoBack of instrucoesArr) {
      console.log(instrucaoBack);
      const instrucao = new InstrucaoTrajetoria();
      instrucao.velLinear = instrucaoBack.velLinear;
      instrucao.velAngular = instrucaoBack.velAngular;
      instrucao.timer = instrucaoBack.timer;

      if (instrucao.velLinear == 0 && instrucao.velAngular == 0) {
        instrucao.tipo = 4;
      } else if (instrucao.velAngular == 0) {
        instrucao.tipo = 1;
      } else if (instrucao.velLinear == 0) {
        instrucao.tipo = 3;
        const deltaTheta = instrucao.velAngular * (instrucao.timer / 1000);
        instrucao.rotAngulo = (deltaTheta * (180 / Math.PI));
      } else {
        instrucao.tipo = 2
      }

      parsedInstrucoes.push(instrucao);
    }


    return parsedInstrucoes
  }

  getCameraMouseEvent(event: MouseEvent) {
    const offsetX = event.offsetX;
    const offsetY = event.offsetY;

    const height = this.cameraWrapEl.nativeElement.offsetHeight;
    const width = this.cameraWrapEl.nativeElement.offsetWidth;

    const cameraHeight = 720;
    const cameraWidth = 1280;

    const x = Math.floor((offsetX * cameraWidth) / width);
    const y = Math.floor((offsetY * cameraHeight) / height);

    this.apontar.goalX = x;
    this.apontar.goalY = y;
    if (this.currentExperimento != null && this.currentExperimento.codExperimento == 1) {
      let objetivos = {
        objetivoX: this.apontar.goalX,
        objetivoY: this.apontar.goalY
      }

      this.experimentoService.setApontarGoals(objetivos).subscribe((resp: any) => {
        
      });
    }
  }

  playExperimento() {
    this.experimentoService.setStatusExperimento(1).subscribe((resp: any) => {
      if(resp.status === 200) {
        this.experimentoRunStatus = 1;
      }

    });

  }

  stopExperimento() {
    this.experimentoService.setStatusExperimento(0).subscribe((resp: any) => {
      if(resp.status === 200) {
        this.experimentoRunStatus = 0;
      }

    });

  }

}
