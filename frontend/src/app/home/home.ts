import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CourtService } from '../court';
import { BehaviorSubject, combineLatest, map, Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  // Strumienie dla filtrów
  search$ = new BehaviorSubject<string>('');
  type$ = new BehaviorSubject<string>('all');

  // Główny strumień z danymi, który połączy filtry i boiska
  filteredCourts$!: Observable<any[]>;
  username: string | null = null;

  constructor(private courtService: CourtService) {}

  ngOnInit() {
    // Obsługa użytkownika
    this.courtService.currentUser$.subscribe(user => {
      this.username = user;
    });

    // Reaktywny strumień boisk połączony z filtrami
    this.filteredCourts$ = combineLatest([
      this.courtService.getCourts(),
      this.search$,
      this.type$
    ]).pipe(
      map(([courts, search, type]) => {
        return courts.filter(court => {
          const matchesSearch = court.name.toLowerCase().includes(search.toLowerCase());
          const matchesType = type === 'all' || court.type === type;
          return matchesSearch && matchesType;
        });
      })
    );
  }

  // Funkcje wywoływane przez (input) i (change) w HTML-u
  onSearchChange(value: string) {
    this.search$.next(value);
  }

  onTypeChange(value: string) {
    this.type$.next(value);
  }

  logout() {
    this.courtService.logout();
  }
}
