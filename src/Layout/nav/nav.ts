import { AfterViewInit, Component, inject, OnDestroy, HostListener, Output, EventEmitter, effect, OnInit } from '@angular/core';
import { KeyboardNav } from '../../core/directives/accessibility/keyboard-nav';
import { Speak } from '../../core/directives/accessibility/speak';
import { Router, RouterLink, RouterLinkActive, NavigationEnd } from '@angular/router';
import { AccountService } from '../../core/services/accountservices';
import { SettingsService } from '../../core/services/Voice/settings-service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-nav',
  imports: [ KeyboardNav, RouterLink, RouterLinkActive],
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
    if (this.showMenu) this.speak("Accessibility Menu Open");
    this.emitMenuState();
  }

  // Set mode
  setMode(newMode: 'blind' | 'deaf') {
    this.accessibilityModeService.mode.set(newMode);
    this.speak(newMode + " mode activated");
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
    if (this.mobileMenuOpen) this.speak("Mobile Menu Open");
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
    if (this.profileDropdownOpen) {
        this.speak("Profile Menu Open");
    } else {
        this.helpDropdownOpen = false;
    }
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
    this.speak("Logging out");
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

  degradeTeacher() {
    // Attempt to read the current user's id from the accountService (use any to avoid strict typing mismatches).
    const userId = (this.accountService as any).currentUser?.id || (this.accountService as any).user?.id;
    if (!userId) {
      console.error('degradeTeacher: user id not available');
      return;
    }

    this.accountService.deleteTeacher(userId).subscribe({
      next: (res: any) => {
        if (res.updatedUser) {
          this.accountService.refreshCurrentUser(res.updatedUser);

          // Immediately re-render UI
          this.profileDropdownOpen = false;
        }
      },
      error: (err: any) => {
        console.error('Degrade failed', err);
      }
    });
  }

  // --- TTS (Text to Speech) Implementation ---
  speak(text: string) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US'; 
    utterance.rate = 0.9;
    window.speechSynthesis.speak(utterance);
  }

  onFocus(text: string | undefined) {
    if (text) {
      this.speak(text);
    }
  }
}