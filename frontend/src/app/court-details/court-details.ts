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
    private courtService: CourtService,
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

  onSubmitReservation() {
    // Przygotowujemy pełny obiekt rezerwacji dla backendu
    const fullReservation = {
      courtId: this.courtId,
      date: this.reservation.date,
      startTime: this.reservation.startTime,
      endTime: this.reservation.endTime
    };

    console.log('Wysyłanie rezerwacji na backend:', fullReservation);

    this.courtService.postReservation(fullReservation).subscribe({
      next: (res) => {
        alert('Rezerwacja została pomyślnie zapisana!');
        this.router.navigate(['/']); // Powrót na stronę główną po sukcesie
      },
      error: (err) => {
        console.error('Błąd podczas składania rezerwacji:', err);
        alert('Nie udało się zapisać rezerwacji. Sprawdź poprawność danych.');
      }
    });
  }
}
