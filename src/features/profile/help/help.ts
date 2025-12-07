import { Component, inject } from '@angular/core';
import { Speak } from '../../../core/directives/accessibility/speak';
import { KeyboardNav } from '../../../core/directives/accessibility/keyboard-nav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-help',
  imports: [Speak,KeyboardNav],
  templateUrl: './help.html',
  styleUrl: './help.css',
})
export class Help {

   
    private router=inject(Router)
  
    goBack() {
      this.router.navigateByUrl('/dashboad');
  } 
   
}
