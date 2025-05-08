import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  constructor(private http: HttpClient) {}

  getEvent(page: number, filter: any): Observable<any> {
    let url = `events?page=${page}&limit=9`;
    if (filter?.search) url += `&search=${filter.search}`;
    if (filter.category) url += `&category=${filter.category}`;
    return this.http.get(url);
  }

  createEvent(payload: FormData): Observable<any> {
    return this.http.post('events', payload);
  }

  updateEvent(payload: FormData, id: string): Observable<any> {
    return this.http.patch(`events/${id}`, payload);
  }

  deleteEvent(id: string): Observable<any> {
    return this.http.delete(`events/${id}`);
  }
}
