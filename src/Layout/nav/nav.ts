import { AfterViewInit, Component, inject, OnDestroy, HostListener } from '@angular/core';
import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';
import { Speak } from '../../core/directives/accessibility/speak';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../core/services/accountservices';

@Component({
  selector: 'app-nav',
  imports: [Speak, KeyboardNav, RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements AfterViewInit, OnDestroy {
  private scrollHandler: any;
  private router = inject(Router);
  protected accountService = inject(AccountService);

  showMenu = false; // accessibility menu toggle
  mobileMenuOpen = false; // mobile menu toggle
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
    this.showMenu = false; // hide accessibility menu after selection
    this.mobileMenuOpen = false;
  }

  applyMode() {
    if (this.mode === 'blind') {
      document.body.setAttribute('speech-enabled', 'true');
    } else {
      document.body.setAttribute('speech-enabled', 'false');
    }
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.showMenu = false; // close accessibility menu too
    const mobileMenu = document.getElementById('mobile-menu');
    mobileMenu?.classList.remove('open');
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    const mobileMenu = document.getElementById('mobile-menu');
    if (this.mobileMenuOpen) mobileMenu?.classList.add('open');
    else mobileMenu?.classList.remove('open');
  }

  // Close menus if click outside
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: any) {
    const target = event.target as HTMLElement;
    const header = document.querySelector('header');
    if (!header?.contains(target)) {
      this.showMenu = false;
      this.mobileMenuOpen = false;
      const mobileMenu = document.getElementById('mobile-menu');
      mobileMenu?.classList.remove('open');
    }
  }

  ngAfterViewInit(): void {
    const header = document.querySelector('header');
    const toggleBtn = document.getElementById('mobile-menu-toggle');

    this.scrollHandler = () => {
      if (window.scrollY > 50) header?.classList.add('scrolled');
      else header?.classList.remove('scrolled');
    };
    window.addEventListener('scroll', this.scrollHandler);

    toggleBtn?.addEventListener('click', () => this.toggleMobileMenu());
  }

  ngOnDestroy(): void {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  get isLoggedIn() {
    return this.accountService.currentUser() !== null;
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.closeMobileMenu();
  }
}
