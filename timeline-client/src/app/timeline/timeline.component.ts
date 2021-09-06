import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators,FormControl, FormGroupDirective  } from '@angular/forms';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { AccountService, AlertService } from '@app/_services';
import { EventService } from "../_services/event.service";
import { map, timestamp } from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
// import { NgxTimelineModule } from 'ngx-timeline';
import { NgxTimelineEvent, NgxTimelineEventGroup, NgxTimelineEventChangeSideInGroup, NgxDateFormat } from '@frxjs/ngx-timeline';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.less']
})
export class TimelineComponent implements OnInit {

  //frxjs
  title = 'demo-app';
  events: NgxTimelineEvent[];
  items:any[] = []; //PO add
  events$: BehaviorSubject<NgxTimelineEvent[]> = new BehaviorSubject(null);
  color = 0;
  backgroundColor = 'red';
  form: FormGroup;
  ngxDateFormat = NgxDateFormat;

  configurations = [
    {
      label: 'Language code',
      formControlName: 'langCode',
      options: [
        {name: 'English', value: 'en'},
        {name: 'French', value: 'fr'},
        {name: 'German', value: 'de'},
        {name: 'Spanish', value: 'es'},
        {name: 'Italian', value: 'it'}
      ]
    },
    {
      label: 'Enable animation',
      formControlName: 'enableAnimation',
      options: [
        {name: 'Enable animation', value: true},
        {name: 'Disable animation', value: false}
      ]
    },
    {
      label: 'Custom class',
      formControlName: 'customClass',
      options: [
        {name: 'No Custom Class', value: false},
        {name: 'Custom Class', value: true}
      ]
    },
    {
      label: 'Group events by',
      formControlName: 'groupEvent',
      options: [
        // {name: 'Month Year', value: NgxTimelineEventGroup.MONTH_YEAR},
        {name: 'Day Month Year', value: NgxTimelineEventGroup.DAY_MONTH_YEAR} //จัดกลุ่มตามวันที่
        // {name: 'Year', value: NgxTimelineEventGroup.YEAR}
      ]
    },
    {
      label: 'Change event side in group',
      formControlName: 'changeSideInGroup',
      options: [
        // {name: 'On different day', value: NgxTimelineEventChangeSideInGroup.ON_DIFFERENT_DAY},
        {name: 'All', value: NgxTimelineEventChangeSideInGroup.ALL}
        // {name: 'On different hours, minutes and seconds', value: NgxTimelineEventChangeSideInGroup.ON_DIFFERENT_HMS},
        // {name: 'On different month', value: NgxTimelineEventChangeSideInGroup.ON_DIFFERENT_MONTH}
      ]
    },
    {
      label: 'Date instant custom template',
      formControlName: 'dateInstantCustomTemplate',
      options: [
        //แสดงวันที่+เวลา
        {name: 'No Custom template', value: false},
        {name: 'Custom Date Instant Template', value: true}
      ]
    },
    {
      label: 'Event custom template',
      formControlName: 'eventCustomTemplate',
      options: [
        {name: 'No Custom template', value: false},
        {name: 'Custom Event Template', value: true}
      ]
    },
    {
      label: 'Inner event custom template',
      formControlName: 'innerEventCustomTemplate',
      options: [
        {name: 'No Custom template', value: false},
        {name: 'Custom Inner Event Template', value: true}
      ]
    },
    {
      label: 'Center icon custom template',
      formControlName: 'centerIconCustomTemplate',
      options: [
        {name: 'No Custom Template', value: false},
        {name: 'Custom Icon Template', value: true}
      ]
    },
    {
      label: 'Period custom template',
      formControlName: 'periodCustomTemplate',
      options: [
        {name: 'No Custom Template', value: false},
        {name: 'Custom Period Template', value: true}
      ]
    },
    {
      label: 'Click emitter',
      formControlName: 'clickEmitter',
      options: [
        {name: 'No emitter', value: false},
        {name: 'Handle click (open console)', value: true}
      ]
    }
  ];

  evform: FormGroup; //เป็น modal form
  modalRef: BsModalRef;
  myevents: any[] = [];
  currentEvent: any = {id: null, name: '', description: '', date: new Date()};
  modalCallback: () => void;
  submitted = false;

  ownerid=null;

  constructor(
    private fb: FormBuilder,
    private modalService: BsModalService,
    private server: EventService,
    private accountService: AccountService,
    private alertService: AlertService
  ) { 

    this.ownerid = accountService.userValue.id;
    //timeline form
    this.form = new FormGroup({});
    this.configurations.forEach(configuration =>
    this.form.addControl(configuration.formControlName, new FormControl(configuration.options[0].value)));
  }

  ngOnInit(): void {
    //form modal สำหรับป้อนข้อมูลtimeline
    this.evform = this.fb.group({
      name: [this.currentEvent.name, Validators.required],
      description: [this.currentEvent.description, Validators.required],
      date: [this.currentEvent.date, Validators.required],
    });

    //call load all event by Owner
    this.loadEventData(this.ownerid);

  }

  private createEventText(data:any[]) {
    let ev: NgxTimelineEvent[] = [];
    if(data)
    {
      data.forEach((val,i)=>{
        ev.push({
          id: data[i].id,
          description: data[i].description,
          timestamp: new Date(data[i].eventDate),
          title: 'สถานที่: '+data[i].name
        })
      });
    }
    this.events = ev;
    // console.log(ev);
  }

  onSubmit() {
    const xx = this.evform.get('name').value;
    console.log(xx);
    console.log('5555555555555555555');
  }

  loadEventData(id) {
    this.server.getEvents(id).then((data:any[]) => {
      this.items = data; //add by po
      //load data today
      this.getEventToday();
    })
  }

  getEventAll() {
      this.createEventText(this.items);
  }

  getEventToday() {
    // this.createEventText(null);
    const today = new Date();
    const yy = today.getFullYear();
    const mm = today.getMonth();
    const dd = today.getDay();
    //createdAt เปลี่ยนใช้ eventDate
    const ev = this.items.filter(e => new Date(e.eventDate).getFullYear() === yy 
      && new Date(e.eventDate).getMonth() === mm
      && new Date(e.eventDate).getDay() === dd);
    this.createEventText(ev);

    // const aa = this.items[0].id +','+this.items[0].eventDate;
    // const bb = this.events[0].id +','+this.events[0].timestamp;
    // console.log(aa);
    // console.log(bb);
  }

  getEventMonth() {
    // this.createEventText(null);
    const today = new Date();
    const yy = today.getFullYear();
    const mm = today.getMonth();
    //createdAt เปลี่ยนใช้ eventDate
    const ev = this.items.filter(e => new Date(e.eventDate).getFullYear() === yy 
      && new Date(e.eventDate).getMonth() === mm);
    this.createEventText(ev);
  }

  handleClick(event: any): void {
    if (event) {
      window.console.log('', event);
    }
  }



  private updateForm() {
    this.evform.setValue({
      name: this.currentEvent.name,
      description: this.currentEvent.description,
      date: new Date(this.currentEvent.date)
    });
  }

  // private getEvents(id) {
  //   this.server.getEvents(id).then((response: any) => {
  //     console.log('Response', response);
  //     this.events = response.map((ev) => {
  //       ev.body = ev.description;
  //       ev.header = 'สถานที่: '+ ev.name;
  //       ev.icon = 'fa-clock-o';
  //       return ev;
  //     });
  //   });
  // }

    addEvent(template) {
    this.submitted = false; //reset submit อีกรอบ
    this.currentEvent = {id: null, name: '', description: '', date: new Date()};
    this.updateForm();
    this.modalCallback = this.createEvent.bind(this);
    this.modalRef = this.modalService.show(template);
  }

  get f() { return this.evform.controls; }

  createEvent() {

    this.submitted = true;
    
    // reset alerts on submit
    this.alertService.clear();
    
    // stop here if form is invalid
    if (this.evform.invalid) {
      return;
    }

    const newEvent = {
      owner: this.ownerid,
      name: this.evform.get('name').value,
      description: this.evform.get('description').value,
      eventDate: this.evform.get('date').value,
    };
    this.modalRef.hide();
    this.server.createEvent(newEvent).then(() => {
      //load data
      this.loadEventData(this.ownerid);
      // this.getEventAll();
      this.getEventToday();
      console.log(newEvent);
    });

    // this.modalRef.hide();
    // console.log('5555555');
    // console.log(newEvent);
  }

  onCancel() {
    this.modalRef.hide();
  }

}
