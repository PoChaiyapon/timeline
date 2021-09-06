import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl  } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AccountService, AlertService } from '@app/_services';
import { EventService } from "../_services/event.service";
import { map, timestamp } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { NgxTimelineModule } from 'ngx-timeline';
// import { NgxTimelineEvent, NgxTimelineEventGroup, NgxTimelineEventChangeSideInGroup, NgxDateFormat } from '@frxjs/ngx-timeline';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.less']
})
export class TimelineComponent implements OnInit {

  form: FormGroup;
  modalRef: BsModalRef;

  //frxjs
  // title = 'demo-app';
  // events: NgxTimelineEvent[];
  // events$: BehaviorSubject<NgxTimelineEvent[]> = new BehaviorSubject(null);
  // color = 0;
  // backgroundColor = 'red';
  // // form: FormGroup;
  // ngxDateFormat = NgxDateFormat;

  // configurations = [
  //   {
  //     label: 'Language code',
  //     formControlName: 'langCode',
  //     options: [
  //       {name: 'English', value: 'en'},
  //       {name: 'French', value: 'fr'},
  //       {name: 'German', value: 'de'},
  //       {name: 'Spanish', value: 'es'},
  //       {name: 'Italian', value: 'it'}
  //     ]
  //   },
  //   {
  //     label: 'Enable animation',
  //     formControlName: 'enableAnimation',
  //     options: [
  //       {name: 'Enable animation', value: true},
  //       {name: 'Disable animation', value: false}
  //     ]
  //   },
  //   {
  //     label: 'Custom class',
  //     formControlName: 'customClass',
  //     options: [
  //       {name: 'No Custom Class', value: false},
  //       {name: 'Custom Class', value: true}
  //     ]
  //   },
  //   {
  //     label: 'Group events by',
  //     formControlName: 'groupEvent',
  //     options: [
  //       // {name: 'Month Year', value: NgxTimelineEventGroup.MONTH_YEAR},
  //       {name: 'Day Month Year', value: NgxTimelineEventGroup.DAY_MONTH_YEAR}
  //       // {name: 'Year', value: NgxTimelineEventGroup.YEAR}
  //     ]
  //   },
  //   {
  //     label: 'Change event side in group',
  //     formControlName: 'changeSideInGroup',
  //     options: [
  //       // {name: 'On different day', value: NgxTimelineEventChangeSideInGroup.ON_DIFFERENT_DAY},
  //       {name: 'All', value: NgxTimelineEventChangeSideInGroup.ALL}
  //       // {name: 'On different hours, minutes and seconds', value: NgxTimelineEventChangeSideInGroup.ON_DIFFERENT_HMS},
  //       // {name: 'On different month', value: NgxTimelineEventChangeSideInGroup.ON_DIFFERENT_MONTH}
  //     ]
  //   },
  //   {
  //     label: 'Date instant custom template',
  //     formControlName: 'dateInstantCustomTemplate',
  //     options: [
  //       {name: 'No Custom template', value: true}, //แสดงวันที่+เวลา
  //       {name: 'Custom Date Instant Template', value: true}
  //     ]
  //   },
  //   {
  //     label: 'Event custom template',
  //     formControlName: 'eventCustomTemplate',
  //     options: [
  //       {name: 'No Custom template', value: false},
  //       {name: 'Custom Event Template', value: true}
  //     ]
  //   },
  //   {
  //     label: 'Inner event custom template',
  //     formControlName: 'innerEventCustomTemplate',
  //     options: [
  //       {name: 'No Custom template', value: false},
  //       {name: 'Custom Inner Event Template', value: true}
  //     ]
  //   },
  //   {
  //     label: 'Center icon custom template',
  //     formControlName: 'centerIconCustomTemplate',
  //     options: [
  //       {name: 'No Custom Template', value: false},
  //       {name: 'Custom Icon Template', value: true}
  //     ]
  //   },
  //   {
  //     label: 'Period custom template',
  //     formControlName: 'periodCustomTemplate',
  //     options: [
  //       {name: 'No Custom Template', value: false},
  //       {name: 'Custom Period Template', value: true}
  //     ]
  //   },
  //   {
  //     label: 'Click emitter',
  //     formControlName: 'clickEmitter',
  //     options: [
  //       {name: 'No emitter', value: false},
  //       {name: 'Handle click (open console)', value: true}
  //     ]
  //   }
  // ];
  //

  events: any[] = [];
  currentEvent: any = { id: null, name: '', description: '', date: new Date() };
  modalCallback: () => void;

  ownerid=null;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private server: EventService,
    private accountService: AccountService,
    private alertService: AlertService
  ) { 
    this.ownerid = accountService.userValue.id;

    //by PO
    // this.form = new FormGroup({});
    // this.configurations.forEach(configuration =>
    //   this.form.addControl(configuration.formControlName, new FormControl(configuration.options[0].value)));
    // this.initEvents();
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      name: [this.currentEvent.name, Validators.required],
      description: this.currentEvent.description,
      date: [this.currentEvent.date, Validators.required],
    });
    this.getEvents(this.ownerid);
  }

  // private initEvents(): void {
  //   // const today = new Date();
  //   // const tomorrow = new Date();
  //   // tomorrow.setDate(today.getDate() + 1);
  //   // const nextMonth = new Date();
  //   // nextMonth.setMonth(today.getMonth() + 1);
  //   // const nextYear = new Date();
  //   // nextYear.setFullYear(today.getFullYear() + 1);

  //   // this.events = [
  //   //   { id: 5, description: 'This is the description of the event 5', timestamp: nextYear, title: 'title 5' },
  //   //   { id: 0, description: 'This is the description of the event 0', timestamp: today, title: 'title 0' },
  //   //   { id: 1, description: 'This is the description of the event 1', timestamp: tomorrow, title: 'title 1' },
  //   //   { id: 2, description: 'This is the description of the event 2', timestamp: today, title: 'title 2' },
  //   //   { id: 3, description: 'This is the description of the event 3', timestamp: tomorrow, title: 'title 3' },
  //   //   { id: 4, description: 'This is the description of the event 4', timestamp: nextMonth, title: 'title 4' },
  //   // ];
  //   this.server.getEvents(this.ownerid).then((data:any[]) => {
  //     let ev: NgxTimelineEvent[] = [];

  //     data.forEach((val,i)=>{
  //       ev.push({
  //         id: data[i].id,
  //         description: data[i].description,
  //         timestamp: new Date(data[i].createdAt),
  //         title: 'สถานที่: '+data[i].name
  //       })
        
  //     });
  //     // const xx = [].concat(ev).sort((a,b) => a.id < b.id ? 1 : -1);
  //     // const zz:NgxTimelineEvent[] = ev.concat().sort((a,b) => a.id < b.id ? 1 : -1);
  //     console.log(ev);
  //     this.events = ev.concat().sort((a,b) => a.timestamp > b.timestamp ? 1 : -1);
  //   })
  // }

  // handleClick(event: any): void {
  //   if (event) {
  //     window.console.log('', event);
  //   }
  // }

  private updateForm() {
    // this.form.setValue({
    //   name: this.currentEvent.name,
    //   description: this.currentEvent.description,
    //   date: new Date(this.currentEvent.date)
    // });
  }

  private getEvents(id) {
    this.server.getEvents(id).then((response: any) => {
      console.log('Response', response);
      this.events = response.map((ev) => {
        ev.body = ev.description;
        ev.header = 'สถานที่: '+ ev.name;
        ev.icon = 'fa-clock-o';
        return ev;
      });
    });
  }

  addEvent(template) {
    // this.currentEvent = {id: null, name: '', description: '', date: new Date()};
    // this.updateForm();
    // this.modalCallback = this.createEvent.bind(this);
    // this.modalRef = this.modalService.show(template);
  }

  createEvent() {
    const newEvent = {
      name: this.form.get('name').value,
      description: this.form.get('description').value,
      date: this.form.get('date').value,
    };
    this.modalRef.hide();
    this.server.createEvent(newEvent).then(() => {
      this.getEvents(this.ownerid);
    });
  }

  editEvent(index, template) {
    // this.currentEvent = this.events[index];
    // this.updateForm();
    // this.modalCallback = this.updateEvent.bind(this);
    // this.modalRef = this.modalService.show(template);
  }

  updateEvent() {
    // const eventData = {
    //   id: this.currentEvent.id,
    //   name: this.form.get('name').value,
    //   description: this.form.get('description').value,
    //   date: this.form.get('date').value,
    // };
    // this.modalRef.hide();
    // this.server.updateEvent(eventData).then(() => {
    //   this.getEvents(this.ownerid);
    // });
  }

  deleteEvent(index) {
    this.server.deleteEvent(this.events[index]).then(() => {
      this.getEvents(this.ownerid);
    });
  }

  onCancel() {
    this.modalRef.hide();
  }

}
