import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post(`auth/login`, credentials);
  }

  register(credentials: {
    name: string;
    email: string;
    password: string;
  }): Observable<any> {
    return this.http.post(`users/register`, credentials);
  }
}
