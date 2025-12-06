import { Component, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Nav } from "../../Layout/nav/nav";
import { CommonModule } from '@angular/common';
import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';

@Component({
  selector: 'app-dashboad',
  imports: [Nav, CommonModule, KeyboardNav, RouterOutlet],
  templateUrl: './dashboad.html',
  styleUrls: ['./dashboad.css'],
})
export class Dashboad {

  isSidebarOpen: WritableSignal<boolean> = signal(false);
  isNavOverlayActive = signal(false);

  toggleSidebar() {
    this.isSidebarOpen.update(x => !x);
  }

  handleNavMenuStateChange(isOpen: boolean) {
    this.isNavOverlayActive.set(isOpen);
    if (isOpen) this.isSidebarOpen.set(false);
  }
}
