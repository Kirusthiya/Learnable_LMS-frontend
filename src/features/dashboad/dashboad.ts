import { Component, computed, inject, signal, effect, WritableSignal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Nav } from "../../Layout/nav/nav";
import { Search } from "../search/search";
import { CommonModule } from '@angular/common';
import { AccountService } from '../../core/services/accountservices';
import { Class } from '../../types/user';
import { Repository } from "../repository/repository";
import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';
import { Speak } from "../../core/directives/accessibility/speak";

@Component({
  selector: 'app-dashboad',
  imports: [RouterOutlet, Nav, Search, CommonModule, Repository, KeyboardNav, Speak],
  templateUrl: './dashboad.html',
  styleUrl: './dashboad.css',
})
export class Dashboad {
  private accountService = inject(AccountService);

  selectedClass = signal<any>(null);
  showMainContent = signal(true);

  isSidebarOpen: WritableSignal<boolean> = signal(false); 
  isNavOverlayActive = signal(false);
  
   studentClasses = computed<Class[]>(() => {
    const userResponse = this.accountService.currentUser();
    
    if (userResponse && userResponse.student && userResponse.student.classes) {
      return userResponse.student.classes;
    }
    
    return []; 
  });

  viewClass(classData: any) {
    this.selectedClass.set(classData); 
    if (this.isSidebarOpen()) {
        this.isSidebarOpen.set(false);
  }
}


  toggleSidebar(): void {
    this.isSidebarOpen.update(current => !current);
  }

  showContent() {
    this.showMainContent.set(true);
    if (this.isSidebarOpen()) {
        this.isSidebarOpen.set(false);
  }
}

handleNavMenuStateChange(isOpen: boolean) {
    this.isNavOverlayActive.set(isOpen);
    if (isOpen) {
      this.isSidebarOpen.set(false);
    }
  }
}