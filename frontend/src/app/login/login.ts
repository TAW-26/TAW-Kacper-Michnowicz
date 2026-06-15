import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CourtService } from '../court';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent {
  loginData = {
    username: '',
    password: ''
  };

  errorMessage: string = '';
  isLoading: boolean = false;

  constructor(
    private courtService: CourtService,
    private router: Router
  ) {}

  // login.ts
  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    this.courtService.login(this.loginData).subscribe({
      next: (res) => {
        this.isLoading = false; // Resetujemy ładowanie przy sukcesie
        alert('Zalogowano pomyślnie!');
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isLoading = false;

        console.log('Pełny obiekt błędu przechwycony przez Angular:', err);

        // Bezpieczne przypisanie komunikatu o błędzie
        if (err.error && err.error.error) {
          this.errorMessage = err.error.error;
        } else {
          this.errorMessage = 'Błędny login lub hasło (Status: ' + err.status + ')';
        }
      }
    });
  }
}
