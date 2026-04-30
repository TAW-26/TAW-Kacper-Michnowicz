import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface Court {
  id: string;
  name: string;
  type: string;
  status: 'available' | 'booked';
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  searchQuery: string = '';
  selectedType: string = 'all';

  courts: Court[] = [
    { id: '1', name: 'Orlik przy Szkole nr 5', type: 'Piłka nożna', status: 'available' },
    { id: '2', name: 'Korty Tenisowe "Sokół"', type: 'Tenis', status: 'booked' },
    { id: '3', name: 'Hala Sportowa Arena', type: 'Koszykówka', status: 'available' }
  ];

  filteredCourts: Court[] = [];

  constructor() {}

  ngOnInit(): void {
    this.filteredCourts = [...this.courts];
  }

  filterCourts(): void {
    this.filteredCourts = this.courts.filter(court => {
      const matchesSearch = court.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = this.selectedType === 'all' || court.type.toLowerCase().includes(this.selectedType);
      return matchesSearch && matchesType;
    });
  }

  goToDetails(id: string): void {
    console.log(`Nawigacja do szczegółów boiska: ${id}`);
  }

  onLogin(): void {
    console.log('Otwieranie formularza logowania');
  }
}
