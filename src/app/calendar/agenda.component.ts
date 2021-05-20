import { AgendaService } from './agenda.service';
import { Component, EventEmitter, OnInit } from '@angular/core';
import {
  ChangeDetectionStrategy,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import {
  startOfDay,
  endOfDay,
  subDays,
  addDays,
  endOfMonth,
  isSameDay,
  isSameMonth,
  addHours,
  startOfWeek,
  startOfMonth,
  endOfWeek,
  format,
} from 'date-fns';
import { Observable, Subject } from 'rxjs';
import { DatePipe, registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';

registerLocaleData(localePt);
import {
  CalendarEvent,
  CalendarEventAction,
  CalendarEventTimesChangedEvent,
  CalendarView,
} from 'angular-calendar';
import { ThemePalette } from '@angular/material/core';
import { FormControl } from '@angular/forms';
import { map } from 'rxjs/operators';
const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};
@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AgendaComponent implements OnInit {
  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  locale: string = 'pt-BR';
  viewDate: Date = new Date();
  events$: Observable<CalendarEvent<{ film: any }>[]>;
  public disabled = false;
  public showSpinners = true;
  public showSeconds = false;
  public touchUi = false;
  public enableMeridian = false;
  public minDate: Date;
  public maxDate: Date;
  public stepHour = 1;
  public stepMinute = 1;
  public stepSecond = 1;
  public color: ThemePalette = 'primary';
  public disableMinute = false;
  public hideTime = false;

  public dateControl = new FormControl(null);

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh: Subject<any> = new Subject();

  events: CalendarEvent[] = [
    {
      start: subDays(startOfDay(new Date()), 1),
      end: addDays(new Date(), 1),
      title: 'A 3 day event',
      color: colors.red,
      actions: this.actions,
      allDay: true,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
    {
      start: startOfDay(new Date()),
      title: 'An event with no end date',
      color: colors.yellow,
      actions: this.actions,
    },
    {
      start: subDays(endOfMonth(new Date()), 3),
      end: addDays(endOfMonth(new Date()), 3),
      title: 'A long event that spans 2 months',
      color: colors.blue,
      allDay: true,
    },
    {
      start: addHours(startOfDay(new Date()), 2),
      end: addHours(new Date(), 2),
      title: 'A draggable and resizable event',
      color: colors.yellow,
      actions: this.actions,
      resizable: {
        beforeStart: true,
        afterEnd: true,
      },
      draggable: true,
    },
  ];
  viewChange = new EventEmitter<CalendarView>();
  activeDayIsOpen: boolean = true;
  constructor(private agendaService: AgendaService, private datePipe: DatePipe) { }

  ngOnInit() {
    this.agendaService.getListaAgendaUsuario().subscribe((resp: any) => {

    });
    this.listAgendaFull();
  }


  handleEvent(action: string, event: CalendarEvent): void {
  }

  setView(view: CalendarView) {
    this.view = view;
    this.listAgendaFull();
  }

  listAgendaFull() {
    this.activeDayIsOpen = false;
    const getStart: any = {
      month: startOfMonth,
      week: startOfWeek,
      day: startOfDay,
    }[this.view];

    const getEnd: any = {
      month: endOfMonth,
      week: endOfWeek,
      day: endOfDay,
    }[this.view];
    console.log('ayy');
    console.log(format(getEnd(this.viewDate), 'yyyy-MM-dd'));
    this.events$ = this.agendaService.getListaAgendaFull(format(getStart(this.viewDate), 'yyyy-MM-dd'), format(getEnd(this.viewDate), 'yyyy-MM-dd'))
      .pipe(
        map((results: any) => {
          return results.map((result: any) => {
            return {
              title: result[0] + ' - ' + this.datePipe.transform(new Date(result[3]),'dd/MM/yyyy HH:mm '),
              start: new Date(result[3]
              ),
              end: new Date(result[3]),
              color: colors.blue,
              allDay: false,
              meta: {
                result,
              },
            };
          });
        })
      );
  }

}
