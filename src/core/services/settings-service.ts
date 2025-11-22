import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AccessibilitySettings } from '../../types/SettingsService';

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
  };

  private _settings = new BehaviorSubject<AccessibilitySettings>({ ...this.defaultSettings });
  public settings$ = this._settings.asObservable();

  constructor() {
    this.loadSettings();
  }

  get currentSettings(): AccessibilitySettings {
    return this._settings.getValue();
  }

  updateSettings(settings: AccessibilitySettings) {
    this._settings.next({ ...settings });
    localStorage.setItem('accessibilitySettings', JSON.stringify(settings));
    document.documentElement.style.setProperty('--app-font-size', settings.textSize + 'px');
    document.documentElement.style.setProperty('--app-voice-speed', settings.voiceSpeed.toString());
    document.body.classList.remove('light-mode', 'dark-mode', 'high-contrast');
    if (settings.contrastMode === 'Light') document.body.classList.add('light-mode');
    else if (settings.contrastMode === 'Dark') document.body.classList.add('dark-mode');
    else document.body.classList.add('high-contrast');
  }

  loadSettings() {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      try {
        const parsed: AccessibilitySettings = JSON.parse(saved);
        this._settings.next(parsed);
        document.documentElement.style.setProperty('--app-font-size', parsed.textSize + 'px');
        document.documentElement.style.setProperty('--app-voice-speed', parsed.voiceSpeed.toString());
        document.body.classList.remove('light-mode', 'dark-mode', 'high-contrast');
        if (parsed.contrastMode === 'Light') document.body.classList.add('light-mode');
        else if (parsed.contrastMode === 'Dark') document.body.classList.add('dark-mode');
        else document.body.classList.add('high-contrast');
      } catch {
        this._settings.next(this.defaultSettings);
        this.updateSettings(this.defaultSettings);
      }
    } else {
      this.updateSettings(this.defaultSettings);
    }
  }
}
