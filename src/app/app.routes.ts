import { Routes } from '@angular/router';
import { TestErrors } from '../shared/error/test-errors/test-errors';
import { ServerError } from '../shared/error/server-error/server-error';
import { NotFound } from '../shared/error/not-found/not-found';
import { Home } from '../features/home/home';
import { Dashboad } from '../features/dashboad/dashboad';
import { About } from '../features/about/about';
import { Feature } from '../features/feature/feature';
import { Testimonials } from '../features/testimonials/testimonials';
import { Contact } from '../features/contact/contact';
import { Login } from '../features/account/login/login';
import { authguardGuard } from '../core/guards/authguard-guard';
import { Register } from '../features/account/register/register';
import { Profile } from '../features/profile/profile';
import { Notification } from '../features/notification/notification';
import { Upgradeplan } from '../features/profile/upgradeplan/upgradeplan';
import { Setting } from '../features/profile/setting/setting';
import { Details } from '../features/details/details';
import { Keyboardshortcut } from '../features/profile/keyboardshortcut/keyboardshortcut';
import { Help } from '../features/profile/help/help';
import { Assets } from '../features/assets/assets';
import { Loading } from '../shared/loading/loading';


export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: About },
  { path: 'features', component: Feature },
  { path: 'testimonials', component: Testimonials },
  { path: 'contact', component: Contact },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'errors', component: TestErrors },
  { path: 'details/:id', component: Details },
  {path:'assets', component:Assets},
  {path: 'loading', component: Loading},

  { path: 'server-error', component: ServerError },

  // Protected dashboard
  {
    path: 'dashboad',
    component: Dashboad,
    runGuardsAndResolvers: 'always',
    canActivate: [authguardGuard],
    children: [
      { path: 'profile', component: Profile },
      { path: 'notification', component: Notification },
    { path: 'setting', component: Setting },
    { path: 'upgradeplan', component: Upgradeplan },
    { path: 'help', component: Help },
    { path: 'keyboardshortcut', component:Keyboardshortcut },
  
    ],
  },

  { path: '**', component: NotFound },
];



// ng g c features/About/
// ng g c features/Feature/
// ng g c features/Testimonials
// ng g c features/Contact
// ng g c features/Assets
// ng g c Layout/nav
// ng g c features/Profile/Keyboardshortcut

//ng g c shared/error/NotFound
