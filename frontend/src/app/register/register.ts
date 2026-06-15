import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CourtService } from '../court';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class RegisterComponent {
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
    private router: Router,
    private courtService: CourtService
  ) {}

  onRegister() {
    this.isLoading = true;
    this.courtService.register(this.registerData).subscribe({
      next: (res) => {
        this.isLoading = false;
        this.successMessage = 'Konto utworzone! Przekierowanie...';
        setTimeout(() => this.router.navigate(['/login']), 2000);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = 'Użytkownik już istnieje lub błąd danych';
      }
    });
  }
}
