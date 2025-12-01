import { AfterViewInit, Component, inject, OnDestroy, HostListener } from '@angular/core';
import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';
import { Speak } from '../../core/directives/accessibility/speak';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AccountService } from '../../core/services/accountservices';

@Component({
  selector: 'app-nav',
  imports: [Speak, KeyboardNav, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css'],
})
export class Nav implements AfterViewInit, OnDestroy {
  private scrollHandler: any;
  private router = inject(Router);
  protected accountService = inject(AccountService);

  showMenu = false; // accessibility menu toggle
  mobileMenuOpen = false; // mobile menu toggle
  profileDropdownOpen = false; // profile dropdown toggle
  helpDropdownOpen = false; // help submenu toggle
  mode: 'blind' | 'deaf' = 'blind';

  ngOnInit() {
    const saved = localStorage.getItem('accessibilityMode');
    this.mode = saved === 'deaf' ? 'deaf' : 'blind';
    this.applyMode();
  }

  toggleMenu() { this.showMenu = !this.showMenu; }

  setMode(mode: 'blind' | 'deaf') {
    this.mode = mode;
    localStorage.setItem('accessibilityMode', mode);
    this.applyMode();
    this.showMenu = false;
    this.mobileMenuOpen = false;
  }

  applyMode() {
    document.body.setAttribute('speech-enabled', this.mode === 'blind' ? 'true' : 'false');
  }

  toggleMobileMenu() { this.mobileMenuOpen = !this.mobileMenuOpen; }

  // closeMobileMenu() {
  //   this.mobileMenuOpen = false;
  //   this.showMenu = false;
  //   this.profileDropdownOpen = false;
  //   this.helpDropdownOpen = false;
  //   const mobileMenu = document.getElementById('mobile-menu');
  //   mobileMenu?.classList.remove('open');
  // }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.showMenu = false;
    this.profileDropdownOpen = false;
    this.helpDropdownOpen = false;
  }

  toggleProfileDropdown(event: Event) {
    event.stopPropagation();
    this.profileDropdownOpen = !this.profileDropdownOpen;
    if (!this.profileDropdownOpen) this.helpDropdownOpen = false;
  }

  toggleHelpDropdown(event: Event) {
    event.stopPropagation();
    this.helpDropdownOpen = !this.helpDropdownOpen;
  }

  // @HostListener('document:click', ['$event'])
  // handleClickOutside(event: any) {
  //   const target = event.target as HTMLElement;
  //   const header = document.querySelector('header');
  //   if (!header?.contains(target)) this.closeMobileMenu();
  // }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: any) {
    const target = event.target as HTMLElement;
    const header = document.querySelector('header');
    // Only close if menu is open and click is outside BOTH header and mobile menu
    const mobileMenu = document.getElementById('mobile-menu');
    if (this.mobileMenuOpen && !header?.contains(target) && !mobileMenu?.contains(target)) {
      this.closeMobileMenu();
    }
  }

 

  ngAfterViewInit(): void {
    const header = document.querySelector('header');
    this.scrollHandler = () => {
      if (window.scrollY > 50) header?.classList.add('scrolled');
      else header?.classList.remove('scrolled');
    };
    window.addEventListener('scroll', this.scrollHandler);
  }

  ngOnDestroy(): void { window.removeEventListener('scroll', this.scrollHandler); }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.closeMobileMenu();
  }
}
