import { LaboratorioService } from './../services/laboratorio.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  constructor(private laboratorioService: LaboratorioService) { }

  laboratorioAtivo: any = null;

  ngOnInit() {
    this.laboratorioService.findSessaoAtiva().subscribe((resp: any) => {
      if(resp === null || resp === []) {
        return;
      }
      this.laboratorioAtivo = resp;
    })

  }

}
