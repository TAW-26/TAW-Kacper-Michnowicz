import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Reservation {
  id: string;
  courtName: string;
  date: string;
  time: string;
  status: 'confirmed' | 'pending' | 'cancelled';
}

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class ProfileComponent implements OnInit {
  user = {
    username: 'JanuszSportu',
    email: 'janusz@przyklad.pl',
    memberSince: '2024-01-15'
  };

  reservations: Reservation[] = [
    { id: 'R1', courtName: 'Orlik przy Szkole nr 5', date: '2026-05-15', time: '18:00 - 19:00', status: 'confirmed' },
    { id: 'R2', courtName: 'Hala Arena', date: '2026-05-20', time: '20:00 - 21:00', status: 'pending' }
  ];

  constructor() {}

  ngOnInit(): void {}

  cancelReservation(id: string) {
    if(confirm('Czy na pewno chcesz anulować tę rezerwację?')) {
      this.reservations = this.reservations.map(res =>
        res.id === id ? { ...res, status: 'cancelled' as const } : res
      );
      console.log('Anulowano rezerwację:', id);
    }
  }
}
