import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-assets-teacher',
  imports: [],
  templateUrl: './assets-teacher.html',
  styleUrl: './assets-teacher.css',
})
export class AssetsTeacher {
   @Input() repository: any;
  @Output() close = new EventEmitter<void>();

}
