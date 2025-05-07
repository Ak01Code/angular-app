import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) {}

  getEvent(page: number, search: string): Observable<any> {
    let url = `events?page=${page}&limit=9`;
    if (search) url += `&search=${search}`;
    return this.http.get(url);
  }

  createEvent(payload: FormData): Observable<any> {
    return this.http.post('events', payload);
  }
}
