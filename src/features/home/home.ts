import { Component, EventEmitter, Output, signal } from '@angular/core';
import { Speak } from '../../core/directives/accessibility/speak';
import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';
import { About } from "../about/about";
import { Contact } from "../contact/contact";
import { Feature } from "../feature/feature";
import { Login } from "../account/login/login";

@Component({
  selector: 'app-home',
  imports: [Speak, KeyboardNav, About, Contact, Feature, Login],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home {
 
  protected LoginMode = signal(false);

  onGetStartedClick(value: boolean) {
    this.LoginMode.set(value);
  }

  

}
