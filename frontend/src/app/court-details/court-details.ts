import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CourtService } from '../court'; // Upewnij się, że ścieżka do serwisu jest poprawna

@Component({
  selector: 'app-court-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './court-details.html',
  styleUrl: './court-details.css'
})
export class CourtDetailsComponent implements OnInit {
  court: any = null; // Początkowo null, zmieni się po pobraniu danych
  courtId: string = '';

  // Obiekt rezerwacji powiązany z formularzem HTML
  reservation = {
    date: '',
    startTime: '',
    endTime: ''
  };

  constructor(
    private route: ActivatedRoute,
    private courtService: CourtService
  ) {}

  ngOnInit() {
    // 1. Wyciągamy dynamiczne ID z paska adresu URL (np. /court/123)
    this.courtId = this.route.snapshot.paramMap.get('id') || '';
    console.log('Odczytane ID obiektu z URL:', this.courtId);

    if (this.courtId) {
      // 2. Strzelamy do backendu po konkretny obiekt z bazy danych
      this.courtService.getCourtById(this.courtId).subscribe({
        next: (data) => {
          console.log('Dane obiektu pobrane pomyślnie:', data);
          this.court = data; // Ustawienie tej zmiennej "ożywi" plik HTML
        },
        error: (err) => {
          console.error('Błąd podczas pobierania szczegółów obiektu:', err);
        }
      });
    }
  }

  // Funkcja uruchamiana po wysłaniu formularza
  onSubmitReservation() {
    console.log('Wysyłanie rezerwacji:', this.reservation);
    // Tutaj możesz dopisać logikę wysyłania rezerwacji do serwera (np. this.courtService.createReservation)
  }
}
