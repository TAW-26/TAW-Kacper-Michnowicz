import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
  // Model danych przesyłany do backendu (Twój backend wymaga username, password i opcjonalnie role)
  registerData = {
    username: '',
    password: '',
    role: 'user' // Domyślna rola
  };

  errorMessage: string = '';
  successMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  onRegister() {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('Wysyłam dane rejestracji:', this.registerData);

    this.http.post('http://localhost:3000/api/auth/register', this.registerData).subscribe({
      next: (res: any) => {
        this.isLoading = false;
        this.successMessage = 'Konto zostało utworzone! Przekierowanie do logowania...';

        // Po 2 sekundach przejdź do strony logowania
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 2000);
      },
      error: (err) => {
        this.isLoading = false;
        console.error('Błąd rejestracji:', err);
        // Pobieramy komunikat błędu z backendu lub ustawiamy domyślny
        this.errorMessage = err.error?.error || 'Błąd rejestracji. Użytkownik może już istnieć.';
      }
    });
  }
}
