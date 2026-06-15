import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { CourtService } from '../court';

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
  // Obiekt użytkownika dynamicznie pobierany z systemu logowania
  user = {
    username: 'Gość',
    role: 'user'
  };

  reservations: Reservation[] = [];

  constructor(
    private courtService: CourtService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Pobieramy aktualny login z localStorage
    const loggedInUsername = localStorage.getItem('username');

    if (loggedInUsername) {
      this.user.username = loggedInUsername;

      // Pobieramy rezerwacje przypisane TYLKO do tego użytkownika
      const localResKey = `reservations_${loggedInUsername}`;
      this.reservations = JSON.parse(localStorage.getItem(localResKey) || '[]');
    } else {
      // Jeśli nikt nie jest zalogowany, przekieruj na logowanie
      this.router.navigate(['/login']);
    }
  }

  cancelReservation(id: string) {
    if(confirm('Czy na pewno chcesz anulować tę rezerwację?')) {
      // Aktualizujemy status lokalnie w tablicy
      this.reservations = this.reservations.map(res =>
        res.id === id ? { ...res, status: 'cancelled' as const } : res
      );

      // Zapisujemy zaktualizowaną listę z powrotem do localStorage
      const localResKey = `reservations_${this.user.username}`;
      localStorage.setItem(localResKey, JSON.stringify(this.reservations));

      console.log('Anulowano lokalnie rezerwację:', id);
    }
  }

  logout() {
    this.courtService.logout();
    this.router.navigate(['/']);
  }
}
