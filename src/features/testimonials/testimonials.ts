import { Component } from '@angular/core';
import { Speak } from '../../core/directives/accessibility/speak';
import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';

@Component({
  selector: 'app-testimonials',
  imports: [Speak,KeyboardNav],
  templateUrl: './testimonials.html',
  styleUrl: './testimonials.css',
})
export class Testimonials {

}
