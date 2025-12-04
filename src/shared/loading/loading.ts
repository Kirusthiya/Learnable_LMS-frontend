import { Component } from '@angular/core';
import { LoadingService } from '../../core/services/loading';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Speak } from "../../core/directives/accessibility/speak";

@Component({
  selector: 'app-loading',
  imports: [FormsModule, CommonModule, Speak],
  templateUrl: './loading.html',
  styleUrl: './loading.css',
})
export class Loading {

  constructor(public loadingService: LoadingService) { }
}
