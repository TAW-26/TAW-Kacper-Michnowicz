import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

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
  courts = [
    { id: '1', name: 'Orlik przy Szkole nr 5', type: 'Piłka nożna', status: 'available' },
    { id: '2', name: 'Korty Tenisowe "Sokół"', type: 'Tenis', status: 'booked' },
    { id: '3', name: 'Hala Sportowa Arena', type: 'Koszykówka', status: 'available' }
  ];
  filteredCourts = [...this.courts];

  ngOnInit() { this.filteredCourts = [...this.courts]; }

  filterCourts() {
    this.filteredCourts = this.courts.filter(court => {
      const matchesSearch = court.name.toLowerCase().includes(this.searchQuery.toLowerCase());
      const matchesType = this.selectedType === 'all' || court.type === this.selectedType;
      return matchesSearch && matchesType;
    });
  }
}
