import { Component, inject } from '@angular/core';
import { Speak } from "../../../core/directives/accessibility/speak";
import { KeyboardNav } from '../../../core/directives/accessibility/keyboard-nav';
import { Router } from '@angular/router';

@Component({
  selector: 'app-keyboardshortcut',
  imports: [Speak,KeyboardNav],
  templateUrl: './keyboardshortcut.html',
  styleUrl: './keyboardshortcut.css',
})
export class Keyboardshortcut {


  
    private router=inject(Router)
  
    goBack() {
      this.router.navigateByUrl('/dashboad');
  } 



}
