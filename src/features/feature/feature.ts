import { Component } from '@angular/core';
import { Speak } from '../../core/directives/accessibility/speak';
import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';

@Component({
  selector: 'app-feature',
  imports: [Speak,KeyboardNav],
  templateUrl: './feature.html',
  styleUrl: './feature.css',
})
export class Feature {

}
