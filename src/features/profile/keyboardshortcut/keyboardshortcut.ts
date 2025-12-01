import { Component } from '@angular/core';
import { Speak } from "../../../core/directives/accessibility/speak";
import { KeyboardNav } from '../../../core/directives/accessibility/keyboard-nav';

@Component({
  selector: 'app-keyboardshortcut',
  imports: [Speak,KeyboardNav],
  templateUrl: './keyboardshortcut.html',
  styleUrl: './keyboardshortcut.css',
})
export class Keyboardshortcut {

shortcuts = [
    { keys: 'TAB', action: 'Move focus between buttons, links, and sections' },
    { keys: 'SHIFT + TAB', action: 'Move focus backwards' },
    { keys: 'ALT + M', action: 'Start microphone for voice input' },
    { keys: 'CTRL', action: 'Start reading the page (screen reader)' },
    { keys: 'ENTER', action: 'Activate selected button or link' },
    { keys: 'ESC', action: 'Close dropdown or popup' }
  ];

  constructor() {}

}
