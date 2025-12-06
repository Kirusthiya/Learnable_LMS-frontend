import { AfterViewInit, Component, inject, OnDestroy, HostListener, Output, EventEmitter, effect, OnInit } from '@angular/core';
import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';
import { Speak } from '../../core/directives/accessibility/speak';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { AccountService } from '../../core/services/accountservices';
import { SettingsService } from '../../core/services/Voice/settings-service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-nav',
  imports: [Speak, KeyboardNav, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css'],
})
export class Nav implements AfterViewInit, OnDestroy, OnInit {
  private accessibilityModeService = inject(SettingsService);
  private router = inject(Router);
  protected accountService = inject(AccountService);

  @Output() menuStateChange = new EventEmitter<boolean>();

  showMenu = false;
  mobileMenuOpen = false;
  profileDropdownOpen = false;
  helpDropdownOpen = false;

  mode: 'blind' | 'deaf' = 'blind';
  private scrollHandler: any;

  ngOnInit() {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMobileMenu();
    });
  }


  // Accessibility menu toggle
  toggleMenu() {
    this.showMenu = !this.showMenu;
    this.emitMenuState();
  }

  // Set mode
  setMode(newMode: 'blind' | 'deaf') {
    this.accessibilityModeService.mode.set(newMode);
    this.showMenu = false;
    this.mobileMenuOpen = false;
    this.emitMenuState();
  }

  // Apply mode to <html> & <body>
  applyMode() {
    const enableSpeech = this.mode === 'blind';

    document.body.setAttribute('speech-enabled', enableSpeech ? 'true' : 'false');
    document.documentElement.setAttribute('speech-enabled', enableSpeech ? 'true' : 'false');
  }

  toggleMobileMenu() {
    this.mobileMenuOpen = !this.mobileMenuOpen;
    this.emitMenuState();
  }

  closeMobileMenu() {
    this.mobileMenuOpen = false;
    this.showMenu = false;
    this.profileDropdownOpen = false;
    this.helpDropdownOpen = false;
    this.emitMenuState();
  }

  toggleProfileDropdown(event: Event) {
    event.stopPropagation();
    this.profileDropdownOpen = !this.profileDropdownOpen;
    if (!this.profileDropdownOpen) this.helpDropdownOpen = false;
    this.emitMenuState();
  }

  toggleHelpDropdown(event: Event) {
    event.stopPropagation();
    this.helpDropdownOpen = !this.helpDropdownOpen;
    this.emitMenuState();
  }

  // For header outside click
  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const header = document.querySelector('header');
    const mobileMenu = document.getElementById('mobile-menu');

    // Close mobile menu
    if (
      this.mobileMenuOpen &&
      !header?.contains(target) &&
      !mobileMenu?.contains(target)
    ) {
      this.closeMobileMenu();
    }

    // Close profile dropdown if clicked outside
    // Since we stop propagation on the toggle button, checking if the click is outside the dropdown logic
    // We can assume if the click reached here and it was NOT on the toggle button (handled by stopPropagation),
    // we should close IF the click is also NOT inside the dropdown itself.
    // However, the dropdown is part of the header.
    // If I click inside the dropdown, does it propagate? Yes.
    // So I need to ensure I don't close if clicking inside.
    // The dropdown is an element with 'absolute right-0 ...'
    // It's hard to target without a ref.
    // Simplest fix: Just set profileDropdownOpen to false.
    // BUT: If I click inside the dropdown, I don't want to close it immediately (unless it's a link).
    // If I click a link, it navigates and closes anyway (or should).
    // If I click blank space in dropdown, should it close? Maybe not.
    // Let's check for containment.

    // We can use the 'closest' method to see if we are inside the dropdown.
    const insideDropdown = target.closest('.absolute.right-0.mt-2'); // Based on nav.html class
    const insideProfileToggle = target.closest('button[appSpeak="Profile"]'); // Based on nav.html

    if (this.profileDropdownOpen && !insideDropdown && !insideProfileToggle) {
      this.profileDropdownOpen = false;
      this.emitMenuState();
    }
  }

  ngAfterViewInit() {
    const header = document.querySelector('header');

    this.scrollHandler = () => {
      if (window.scrollY > 50) header?.classList.add('scrolled');
      else header?.classList.remove('scrolled');
    };

    window.addEventListener('scroll', this.scrollHandler);
  }

  ngOnDestroy() {
    window.removeEventListener('scroll', this.scrollHandler);
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.closeMobileMenu();
  }

  // Emits final state to parent
  private emitMenuState() {
    this.menuStateChange.emit(
      this.mobileMenuOpen || this.showMenu || this.profileDropdownOpen || this.helpDropdownOpen
    );
  }
}
