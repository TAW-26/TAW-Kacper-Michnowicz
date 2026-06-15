import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CourtService {
  private apiUrl = 'http://localhost:3000/api/courts';
  private authUrl = 'http://localhost:3000/api/auth';

  private currentUserSubject = new BehaviorSubject<{ username: string, role: string } | null>(null);
  currentUser$ = this.currentUserSubject.asObservable();

  private isBrowser: boolean;

  constructor(
      private http: HttpClient,
      @Inject(PLATFORM_ID) platformId: Object
    ) {
      this.isBrowser = isPlatformBrowser(platformId);

      if (this.isBrowser) {
        setTimeout(() => {
          const savedUser = localStorage.getItem('username');
          const savedRole = localStorage.getItem('role');
          if (savedUser && savedRole) {
            this.currentUserSubject.next({ username: savedUser, role: savedRole });
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

          const userRole = loginData.username === 'admin' ? 'admin' : 'user';

          if (this.isBrowser) {
            localStorage.setItem('token', res.token);
            localStorage.setItem('username', loginData.username);
            localStorage.setItem('role', userRole);
          }
          this.currentUserSubject.next({ username: loginData.username, role: userRole });
        })
      );
    }

  // --- WYLOGOWANIE ---
  logout() {
    if (this.isBrowser) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
    }
    this.currentUserSubject.next(null);
    alert('Wylogowano');
  }

  // --- METODA DODAWANIA OBIEKTU ---
    addCourt(courtData: any): Observable<any> {
      let headers = new HttpHeaders();
      if (this.isBrowser) {
        const token = localStorage.getItem('token');
        if (token) {
          headers = headers.set('Authorization', `Bearer ${token}`);
        }
      }
      return this.http.post('http://localhost:3000/api/admin/courts', courtData, { headers });
    }

  // --- OBSŁUGA BOISK ---
  getCourts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getCourtById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  // --- REZERWACJE ---
  postReservation(reservation: any): Observable<any> {
    let headers = new HttpHeaders();

    if (this.isBrowser) {
      const token = localStorage.getItem('token');
      if (token) {
        headers = headers.set('Authorization', `Bearer ${token}`);
      }
    }

    return this.http.post('http://localhost:3000/api/reservations', reservation, { headers });
  }
}
