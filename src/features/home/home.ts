import { Component, EventEmitter, Output } from '@angular/core';
import { Speak } from '../../core/directives/accessibility/speak';
import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';

@Component({
  selector: 'app-home',
  imports: [Speak, KeyboardNav],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
  @Output() openLoginEvent = new EventEmitter<void>();

  onGetStartedClick() {
    this.openLoginEvent.emit();
  }

}
