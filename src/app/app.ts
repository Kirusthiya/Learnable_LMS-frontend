import { Component } from '@angular/core';
import { Home } from "../features/home/home";
import { Contact } from "../features/contact/contact";
import { About } from "../features/about/about";
import { Login } from "../features/account/login/login";
import { Nav } from "../Layout/nav/nav";
import { RouterOutlet } from "@angular/router";
import { KeyboardNav } from '../core/directives/accessibility/keyboard-nav';


@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
  imports: [Home, Contact, About, Login, Nav,KeyboardNav],
})
export class App  {
  
showLogin = false; // Initially login hide

  // button click aana time la call panna
  openLogin() {
    this.showLogin = true;
  }

  // back button la call panna
  closeLogin() {
    this.showLogin = false;
  }
  
}
