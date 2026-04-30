import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
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
      private http: HttpClient,
      private router: Router
    ) {}

  onLogin() {
    this.http.post('http://localhost:3000/api/auth/login', this.loginData).subscribe({
      next: (res: any) => {
        localStorage.setItem('token', res.token);
        alert('Zalogowano!');
        this.router.navigate(['/']);
      },
      error: (err) => this.errorMessage = 'Błąd logowania'
    });
  }
}
