import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CourtService } from '../court';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent implements OnInit {
  searchQuery: string = '';
  selectedType: string = 'all';
  courts: any[] = [];
  filteredCourts: any[] = [];

  constructor(private courtService: CourtService) {}

  ngOnInit() {
    this.courtService.getCourts().subscribe({
      next: (data) => {
        this.courts = data;
        this.filteredCourts = data;
      },
      error: (err) => console.error('Błąd pobierania danych:', err)
    });
  }

  filterCourts() {
    this.filteredCourts = this.courts.filter(court => {
      const matchesSearch = court.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = this.selectedType === 'all' || court.type === this.selectedType;
      return matchesSearch && matchesType;
    });
  }
}
