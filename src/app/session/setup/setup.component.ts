import { LaboratorioService } from './../../services/laboratorio.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-setup',
  templateUrl: './setup.component.html',
  styleUrls: ['./setup.component.css']
})
export class SetupComponent implements OnInit {

  constructor(private laboratorioService: LaboratorioService) { }

  ngOnInit() {
  }

  startSession() {
    this.laboratorioService.startSession().subscribe((resp: any) => {

    }, (err: any) => {

    });
  }

}
