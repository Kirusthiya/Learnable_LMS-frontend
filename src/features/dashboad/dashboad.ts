// File: dashboad.ts
import { Component, computed, inject, signal, WritableSignal } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Nav } from "../../Layout/nav/nav";
import { Search } from "../search/search";
import { CommonModule } from '@angular/common';
import { AccountService } from '../../core/services/accountservices';
import { Class } from '../../types/user';
import { Repository } from "../repository/repository";
import { Assets } from '../assets/assets';
import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';
import { Speak } from "../../core/directives/accessibility/speak";

@Component({
  selector: 'app-dashboad',
  imports: [Nav, Search, CommonModule, Repository, Assets, KeyboardNav, Speak, RouterOutlet],
  templateUrl: './dashboad.html',
  styleUrls: ['./dashboad.css'],
})
export class Dashboad {
  private accountService = inject(AccountService);

  selectedClassId = signal<string | null>(null);        // current classId
  selectedRepositoryId = signal<string | null>(null);   // current repositoryId
  showMainContent = signal(true);
  isSidebarOpen: WritableSignal<boolean> = signal(false); 
  isNavOverlayActive = signal(false);
  
  studentClasses = computed<Class[]>(() => {
    const userResponse = this.accountService.currentUser();
    return userResponse?.student?.classes || [];
  });

  // Click on class → set classId
  viewClass(id: string) {
    this.selectedClassId.set(id);
    if (this.isSidebarOpen()) this.isSidebarOpen.set(false);
  }

  // Repository clicked → show assets
  openRepository(repoId: string) {
    this.selectedRepositoryId.set(repoId);
  }

  backFromAssets() {
    this.selectedRepositoryId.set(null);
  }

  toggleSidebar(): void {
    this.isSidebarOpen.update(current => !current);
  }

  showContent() {
    this.showMainContent.set(true);
    if (this.isSidebarOpen()) this.isSidebarOpen.set(false);
  }

  handleNavMenuStateChange(isOpen: boolean) {
    this.isNavOverlayActive.set(isOpen);
    if (isOpen) this.isSidebarOpen.set(false);
  }

  backToDashboard() {
    this.selectedClassId.set(null);
  }
}
