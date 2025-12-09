import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { KeyboardNav } from "../../../core/directives/accessibility/keyboard-nav";
import { Speak } from "../../../core/directives/accessibility/speak";

@Component({
  selector: 'app-not-found',
  imports: [KeyboardNav, Speak],
  templateUrl: './not-found.html',
  styleUrl: './not-found.css',
})
export class NotFound {
 private location = inject(Location)

  goBack() {
    this.location.back();
  }

}
