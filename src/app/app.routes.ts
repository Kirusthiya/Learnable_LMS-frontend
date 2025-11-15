import { Routes } from '@angular/router';
import { TestErrors } from '../shared/error/test-errors/test-errors';
import { ServerError } from '../shared/error/server-error/server-error';
import { NotFound } from '../shared/error/not-found/not-found';
import { Home } from '../features/home/home';
import { About } from '../features/about/about';
import { Feature } from '../features/feature/feature';
import { Testimonials } from '../features/testimonials/testimonials';
import { Contact } from '../features/contact/contact';
import { Login } from '../features/account/login/login';

export const routes: Routes = [
{ path: '', redirectTo: '/home', pathMatch: 'full' }, 
  { path: 'home', component: Home },
  { path: 'about', component: About },
  { path: 'features', component: Feature },
  { path: 'testimonials', component: Testimonials },
  { path: 'contact', component: Contact },
  { path: 'login', component: Login },
  { path: 'errors', component: TestErrors },
  { path: 'server-error', component: ServerError },
  { path: '**', component: NotFound } 
];



// ng g c features/About/
// ng g c features/Feature/
// ng g c features/Testimonials
// ng g c features/Contact
// ng g c features/Home
// ng g c Layout/nav

//ng g c shared/error/NotFound