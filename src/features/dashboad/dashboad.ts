import { Component, computed, inject, signal, effect } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { Nav } from "../../Layout/nav/nav";
import { Search } from "../search/search";
import { CommonModule } from '@angular/common';
import { AccountService } from '../../core/services/accountservices';
import { Class } from '../../types/user';

@Component({
  selector: 'app-dashboad',
  imports: [RouterOutlet, Nav, Search, CommonModule],
  templateUrl: './dashboad.html',
  styleUrl: './dashboad.css',
})
export class Dashboad {
  private accountService = inject(AccountService);

  selectedClass = signal<any>(null);
  showMainContent = signal(true);


   studentClasses = computed<Class[]>(() => {
    const userResponse = this.accountService.currentUser();
    
    if (userResponse && userResponse.student && userResponse.student.classes) {
      return userResponse.student.classes;
    }
    
    return []; 
  });

  viewClass(classData: any) {
    this.selectedClass.set(classData); // send data to <app-Repository>
  }

 

  showContent() {
    this.showMainContent.set(true);
  }
  
}
