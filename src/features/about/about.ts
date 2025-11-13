import { AfterViewInit, Component } from '@angular/core';
import { Speak } from '../../core/directives/accessibility/speak';
import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';

@Component({
  selector: 'app-about',
  imports: [Speak,KeyboardNav],
  templateUrl: './about.html',
  styleUrl: './about.css',
})
export class About implements AfterViewInit{
   ngAfterViewInit(): void {
    const fadeEls = document.querySelectorAll('.fade-up');

    const fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            fadeObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    fadeEls.forEach((el) => fadeObserver.observe(el));
  }

}
