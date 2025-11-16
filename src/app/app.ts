import { Component, inject } from '@angular/core';

import { Nav } from "../Layout/nav/nav";


import { Router, RouterOutlet } from '@angular/router';



@Component({
  selector: 'app-root',
  imports: [ Nav,RouterOutlet],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App  {
  
   protected router = inject(Router);
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
