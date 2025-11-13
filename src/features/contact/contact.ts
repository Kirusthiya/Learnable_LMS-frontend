import { Component } from '@angular/core';
import { Speak } from '../../core/directives/accessibility/speak';
import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';

@Component({
  selector: 'app-contact',
  imports: [Speak,KeyboardNav],
  templateUrl: './contact.html',
  styleUrl: './contact.css',
})
export class Contact {

}
