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

  selectedClassId = signal<string | null>(null);
  selectedRepositoryId = signal<string | null>(null);

  isSidebarOpen: WritableSignal<boolean> = signal(false);
  isNavOverlayActive = signal(false);

  studentClasses = computed<Class[]>(() => {
    const user = this.accountService.currentUser();
    return user?.student?.classes || [];
  });


   protected LoginMode = signal(false);

  onGetStartedClick(value: boolean) {
    this.LoginMode.set(value);
  }

  // When class is clicked
  viewClass(id: string) {
    this.selectedClassId.set(id);
    this.isSidebarOpen.set(false);
  }

  // Repository clicked
  openRepository(repoId: string) {
    this.selectedRepositoryId.set(repoId);
  }

  // 🔥 Back from assets → go to repository list
  backFromAssets() {
    this.selectedRepositoryId.set(null);
  }

  // 🔥 Back from repositories → go to class list
  backToDashboard() {
    this.selectedClassId.set(null);
  }

  toggleSidebar() {
    this.isSidebarOpen.update(x => !x);
  }

  handleNavMenuStateChange(isOpen: boolean) {
    this.isNavOverlayActive.set(isOpen);
    if (isOpen) this.isSidebarOpen.set(false);
  }
}
