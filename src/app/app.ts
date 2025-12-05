import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Nav } from "../Layout/nav/nav";
import { Router, RouterOutlet } from '@angular/router';
import { Loading } from '../shared/loading/loading';



@Component({
  selector: 'app-root',
  imports: [Nav, RouterOutlet, CommonModule, Loading  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css'],
})
export class App implements OnInit {

  protected router = inject(Router);
  isLoading = true;

ngOnInit() {
  // Simulate ultra-fast load (0.2s)
  setTimeout(() => {
    this.isLoading = false;
  }, 200); // 0.2 seconds
}
}