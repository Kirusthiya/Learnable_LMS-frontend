// import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
// import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';
// import { Speak } from '../../core/directives/accessibility/speak';
// import { Router, RouterLink, RouterLinkActive } from '@angular/router';


// @Component({
//   selector: 'app-nav',
//   imports: [Speak, KeyboardNav, RouterLink, RouterLinkActive  ],
//   templateUrl: './nav.html',
//   styleUrl: './nav.css',
// })
// export class Nav implements AfterViewInit, OnDestroy {
//   private scrollHandler: any;
//     private router = inject(Router);

//   ngAfterViewInit(): void {
//     const header = document.querySelector('header');
//     const toggleBtn = document.getElementById('mobile-menu-toggle');
//     const mobileMenu = document.getElementById('mobile-menu');

//     this.scrollHandler = () => {
//       if (window.scrollY > 50) header?.classList.add('scrolled');
//       else header?.classList.remove('scrolled');
//     };
//     window.addEventListener('scroll', this.scrollHandler);

//     toggleBtn?.addEventListener('click', () => {
//       mobileMenu?.classList.toggle('open');
//     });
//   }

//   ngOnDestroy(): void {
//     window.removeEventListener('scroll', this.scrollHandler);
//   }
// }


import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';
import { Speak } from '../../core/directives/accessibility/speak';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-nav',
  imports: [Speak, KeyboardNav, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements AfterViewInit, OnDestroy {
  private scrollHandler: any;
  private router = inject(Router);

  showMenu = false;
  mode: 'blind' | 'deaf' = 'blind';

  ngOnInit() {
    const saved = localStorage.getItem('accessibilityMode');
    this.mode = saved === 'deaf' ? 'deaf' : 'blind';
    this.applyMode();
  }

  toggleMenu() {
    this.showMenu = !this.showMenu;
  }

  setMode(mode: 'blind' | 'deaf') {
    this.mode = mode;
    localStorage.setItem('accessibilityMode', mode);
    this.applyMode();
    this.showMenu = false;
  }

  applyMode() {
    if (this.mode === 'blind') {
      document.body.setAttribute('speech-enabled', 'true');
    } else {
      document.body.setAttribute('speech-enabled', 'false');
    }
  }

  // scroll + menu logic
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
