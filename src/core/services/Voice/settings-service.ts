import { Injectable, signal, effect } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AccessibilitySettings } from '../../../types/SettingsService';

@Injectable({
  providedIn: 'root',
})
export class SettingsService {
  private defaultSettings: AccessibilitySettings = {
    textSize: 16,
    contrastMode: 'Light',
    enableSubtitles: false,
    voiceSpeed: 1.0,
    voiceVolume: 1.0,
    speechToText: false,
    keyboardNav: false,
    mode: 'blind',
  };

  mode = signal<'blind' | 'deaf'>(
    (localStorage.getItem('accessibilityMode') as 'blind' | 'deaf') || 'blind'
  );

  private _settings = new BehaviorSubject<AccessibilitySettings>({
    ...this.defaultSettings,
    mode: this.mode(),
  });
  public settings$ = this._settings.asObservable();

  constructor() {
    this.loadSettings();

    effect(() => {
      const m = this.mode();

      localStorage.setItem('accessibilityMode', m);

      // If user switches to deaf → stop speech IMMEDIATELY
      if (m === 'deaf') {
        try { window.speechSynthesis.cancel(); } catch {}
      }
    });
  }

  get currentSettings(): AccessibilitySettings {
    return this._settings.getValue();
  }

  updateSettings(settings: AccessibilitySettings) {
    this._settings.next({ ...settings });

    this.mode.set(settings.mode);

    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));

    this.applyTextSize(settings.textSize);
    this.applyVoiceSpeed(settings.voiceSpeed);
    this.applyContrastMode(settings.contrastMode);
  }

  loadSettings() {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      try {
        const parsed: AccessibilitySettings = JSON.parse(saved);
        this._settings.next(parsed);
        this.mode.set(parsed.mode);
        this.applyTextSize(parsed.textSize);
        this.applyVoiceSpeed(parsed.voiceSpeed);
        this.applyContrastMode(parsed.contrastMode);
      } catch {
        this.updateSettings(this.defaultSettings);
      }
    } else {
      this.updateSettings(this.defaultSettings);
    }
  }

  private applyTextSize(size: number) {
    document.documentElement.style.setProperty('--app-font-size', size + 'px');
  }

  private applyVoiceSpeed(speed: number) {
    document.documentElement.style.setProperty('--app-voice-speed', speed.toString());
  }

  private applyContrastMode(mode: string) {
    document.body.classList.remove('light-mode', 'dark-mode', 'high-contrast');
    if (mode === 'Light') document.body.classList.add('light-mode');
    else if (mode === 'Dark') document.body.classList.add('dark-mode');
    else document.body.classList.add('high-contrast');
  }
}
