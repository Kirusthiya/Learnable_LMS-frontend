import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';
import { Speak } from '../../core/directives/accessibility/speak';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';


@Component({
  selector: 'app-nav',
  imports: [Speak, KeyboardNav, RouterLink, RouterLinkActive  ],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements AfterViewInit, OnDestroy {
  private scrollHandler: any;
    private router = inject(Router);

  ngAfterViewInit(): void {
    const header = document.querySelector('header');
    const toggleBtn = document.getElementById('mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    this.scrollHandler = () => {
      if (window.scrollY > 50) header?.classList.add('scrolled');
      else header?.classList.remove('scrolled');
    };
    window.addEventListener('scroll', this.scrollHandler);

    toggleBtn?.addEventListener('click', () => {
      mobileMenu?.classList.toggle('open');
    });
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollHandler);
  }
}
