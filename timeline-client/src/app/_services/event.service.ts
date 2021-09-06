import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { Event } from "../_models/event";

@Injectable({
  providedIn: 'root'
})
export class EventService {
  // private userSubject: BehaviorSubject<User>;
  // public user: Observable<User>;

  constructor(
    private http: HttpClient,
    
  ) { 
      // this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('user')));
      // this.user = this.userSubject.asObservable();
  }

  private async request(method: string, url: string, data?: any) {
    const user = JSON.parse(localStorage.getItem('user'));
    const token = user.token;

    const result = this.http.request(method, url, {
      body: data,
      responseType: 'json',
      observe: 'body',
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return new Promise((resolve, reject) => {
      result.subscribe(resolve, reject);
    });
  }

  getEvents(id) {
    return this.request('GET', `${environment.apiUrl}/event/${id}`);
  }

  createEvent(event) {
    return this.request('POST', `${environment.apiUrl}/event`, event);
  }

  updateEvent(event) {
    return this.request('PUT', `${environment.apiUrl}/event/${event.id}`, event);
  }

  deleteEvent(event) {
    return this.request('DELETE', `${environment.apiUrl}/event/${event.id}`);
  }

}
