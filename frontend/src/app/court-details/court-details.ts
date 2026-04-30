import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterModule } from '@angular/router';

@Component({
  selector: 'app-court-details',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './court-details.html',
  styleUrl: './court-details.css'
})
export class CourtDetailsComponent implements OnInit {
  courtId: string | null = null;

  court = {
    name: 'Orlik przy Szkole nr 5',
    type: 'Piłka nożna',
    description: 'Nowoczesne boisko ze sztuczną nawierzchnią i oświetleniem LED.',
    price: 50,
    address: 'ul. Sportowa 12, Warszawa'
  };

  reservation = {
    date: '',
    startTime: '',
    endTime: ''
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit() {
    this.courtId = this.route.snapshot.paramMap.get('id');
  }

  onSubmitReservation() {
    const payload = {
      courtId: this.courtId,
      start: `${this.reservation.date}T${this.reservation.startTime}:00.000Z`,
      end: `${this.reservation.date}T${this.reservation.endTime}:00.000Z`
    };

    console.log('Wysyłanie rezerwacji:', payload);
    alert('Rezerwacja została wysłana! Sprawdź panel użytkownika.');
  }
}
