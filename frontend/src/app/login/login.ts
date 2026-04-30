import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  onLogin() {
    this.isLoading = true;
    this.errorMessage = '';

    console.log('Próba logowania dla:', this.loginData.username);

    setTimeout(() => {
      if (this.loginData.username === 'admin' && this.loginData.password === 'admin123') {
        alert('Zalogowano pomyślnie!');
      } else {
        this.errorMessage = 'Błędny login lub hasło. Spróbuj ponownie.';
      }
      this.isLoading = false;
    }, 1500);
  }
}
