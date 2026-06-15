import { Routes } from '@angular/router';
import { App } from './app';
import { LoginComponent } from './login/login';
import { HomeComponent } from './home/home';
import { CourtDetailsComponent } from './court-details/court-details';
import { ProfileComponent } from './profile/profile';
import { RegisterComponent } from './register/register';
import { AddCourtComponent } from './add-court/add-court';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'court/:id', component: CourtDetailsComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin/add-court', component: AddCourtComponent }
];
