import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourtService {
  private apiUrl = 'http://localhost:3000/api/courts';

  constructor(private http: HttpClient) {}

  getCourts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCourtById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  postReservation(reservation: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/reservations', reservation);
  }
  register(userData: any): Observable<any> {
      return this.http.post(`${this.apiUrl}/register`, userData);
    }
}
