import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { CourtService } from '../court';

@Component({
  selector: 'app-add-court',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './add-court.html',
  styleUrl: './add-court.css'
})
export class AddCourtComponent {
  // Model danych odpowiadający Twojemu schematowi Court w bazie MongoDB
  courtData = {
    name: '',
    type: 'Piłka nożna',
    pricePerHour: null,
    status: 'available',
    description: '',
    image: ''
  };

  constructor(
    private courtService: CourtService,
    private router: Router
  ) {}

  onSubmit() {
    this.courtService.addCourt(this.courtData).subscribe({
      next: (res) => {
        alert('Nowy obiekt sportowy został dodany pomyślnie!');
        this.router.navigate(['/']); // Przekierowanie na stronę główną, gdzie pojawi się nowe boisko
      },
      error: (err) => {
        console.error('Błąd dodawania obiektu:', err);
        alert(err.error?.error || 'Nie udało się dodać obiektu. Brak uprawnień administratora.');
      }
    });
  }
}
