import { Routes } from '@angular/router';
import { App } from './app';
import { LoginComponent } from './login/login';
import { HomeComponent } from './home/home';
import { CourtDetailsComponent } from './court-details/court-details';
import { ProfileComponent } from './profile/profile';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'court/:id', component: CourtDetailsComponent },
  { path: 'profile', component: ProfileComponent }
];
