import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CourtService } from './court';

interface Court {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'booked';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  currentUser: { username: string, role: string } | null = null;

  // Wstrzykujemy CourtService w konstruktorze
  constructor(private courtService: CourtService) {}

  ngOnInit() {
    // Nasłuchujemy zmian statusu logowania.
    // Gdy użytkownik się zaloguje, ten kod natychmiast przypisze jego login do zmiennej.
    this.courtService.currentUser$.subscribe(user => {
         this.currentUser = user;
    });
  }

  // Funkcja przypisana do przycisku "Wyloguj się"
  logout() {
    this.courtService.logout();
  }
}
