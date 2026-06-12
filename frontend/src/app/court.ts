import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourtService {
  private apiUrl = 'http://localhost:3000/api/courts';
  private authUrl = 'http://localhost:3000/api/auth';

  private currentUserSubject = new BehaviorSubject<string | null>(null);
  currentUser$: Observable<string | null> = this.currentUserSubject.asObservable();

  private isBrowser: boolean;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      setTimeout(() => {
        const savedUser = localStorage.getItem('username');
        if (savedUser) {
          this.currentUserSubject.next(savedUser);
        }
      }, 0);
    }
  }

  register(userData: any): Observable<any> {
    return this.http.post(`${this.authUrl}/register`, userData);
  }

  // --- LOGOWANIE ---
  login(loginData: any): Observable<any> {
    return this.http.post(`${this.authUrl}/login`, loginData).pipe(
      tap((res: any) => {
        if (this.isBrowser) {
          localStorage.setItem('token', res.token);
          localStorage.setItem('username', loginData.username);
        }
        this.currentUserSubject.next(loginData.username);
      })
    );
  }

  // --- WYLOGOWANIE ---
  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
    }
    this.currentUserSubject.next(null);
  }

  // --- OBSŁUGA BOISK ---
  getCourts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCourtById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  postReservation(reservation: any): Observable<any> {
    return this.http.post('http://localhost:3000/api/reservations', reservation);
  }
}
