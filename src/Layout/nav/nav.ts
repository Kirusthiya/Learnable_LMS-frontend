import { AfterViewInit, Component, inject, OnDestroy, HostListener, Output, EventEmitter, effect, OnInit } from '@angular/core';
import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';
import { Speak } from '../../core/directives/accessibility/speak';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AccountService } from '../../core/services/accountservices';
import { SettingsService } from '../../core/services/Voice/settings-service';

@Component({
  selector: 'app-nav',
  imports: [Speak, KeyboardNav, RouterLink, RouterLinkActive],
  templateUrl: './nav.html',
  styleUrls: ['./nav.css'],
})
export class Nav implements AfterViewInit, OnDestroy {
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

 toggleProfileDropdown() {
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

    if (
      this.mobileMenuOpen &&
      !header?.contains(target) &&
      !mobileMenu?.contains(target)
    ) {
      this.closeMobileMenu();
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
