import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule, Router } from '@angular/router';
import { CourtService } from '../court';
import { Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-court-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './court-details.html',
  styleUrl: './court-details.css'
})
export class CourtDetailsComponent implements OnInit {
  court$!: Observable<any>;
  courtId: string = '';

  reservation = {
    date: '',
    startTime: '',
    endTime: ''
  };

  constructor(
    private route: ActivatedRoute,
    public courtService: CourtService,
    private router: Router
  ) {}

  ngOnInit() {
    this.court$ = this.route.paramMap.pipe(
      switchMap(params => {
        this.courtId = params.get('id') || '';
        console.log('Odczytane ID obiektu z URL na żywo:', this.courtId);
        return this.courtService.getCourtById(this.courtId);
      }),
      tap(data => console.log('Dane obiektu pobrane pomyślnie:', data))
    );
  }

  onSubmitReservation(courtName: string) {
    const fullReservation = {
      courtId: this.courtId,
      date: this.reservation.date,
      startTime: this.reservation.startTime,
      endTime: this.reservation.endTime
    };

    this.courtService.postReservation(fullReservation).subscribe({
      next: (res) => {
        const currentUser = localStorage.getItem('username') || 'gosc';

        // Pobieramy dotychczasowe rezerwacje zapisane w przeglądarce dla tego użytkownika
        const localResKey = `reservations_${currentUser}`;
        const existingReservations = JSON.parse(localStorage.getItem(localResKey) || '[]');

        const newLocalRes = {
          id: 'R' + (existingReservations.length + 1),
          courtName: courtName,
          date: this.reservation.date,
          time: `${this.reservation.startTime} - ${this.reservation.endTime}`,
          status: 'confirmed'
        };

        // Dodajemy do listy i zapisujemy z powrotem w localStorage
        existingReservations.push(newLocalRes);
        localStorage.setItem(localResKey, JSON.stringify(existingReservations));

        alert('Obiekt został pomyślnie zarezerwowany!');
        this.router.navigate(['/profile']); // Przekierowujemy od razu do profilu, żeby zobaczyć efekt!
      },
      error: (err) => {
        console.error(err);
        alert('Nie udało się zapisać rezerwacji. Sprawdź poprawność danych.');
      }
    });
  }
}
