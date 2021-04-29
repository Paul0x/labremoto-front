import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoryExperimentoComponent } from './history-experimento.component';

describe('HistoryExperimentoComponent', () => {
  let component: HistoryExperimentoComponent;
  let fixture: ComponentFixture<HistoryExperimentoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoryExperimentoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoryExperimentoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
