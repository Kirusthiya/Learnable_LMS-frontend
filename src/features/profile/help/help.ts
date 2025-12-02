import { Component } from '@angular/core';
import { Speak } from '../../../core/directives/accessibility/speak';
import { KeyboardNav } from '../../../core/directives/accessibility/keyboard-nav';

@Component({
  selector: 'app-help',
  imports: [Speak,KeyboardNav],
  templateUrl: './help.html',
  styleUrl: './help.css',
})
export class Help {

}
