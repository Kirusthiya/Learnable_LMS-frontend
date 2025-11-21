import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccessibilitySettings } from '../../../types/SettingsService';


@Component({
  selector: 'app-setting',
  imports: [FormsModule,CommonModule],
  templateUrl: './setting.html',
  styleUrl: './setting.css',
})
export class Setting implements OnInit {

  settings: AccessibilitySettings = {
    textSize: 16,
    contrastMode: 'Light',
    enableSubtitles: false,
    voiceSpeed: 1.0,
    speechToText: false,
    keyboardNav: false,
  };

  // Saved settings (last applied)
  savedSettings: AccessibilitySettings = { ...this.settings };

  ngOnInit() {
    const saved = localStorage.getItem('accessibilitySettings');
    if (saved) {
      this.settings = JSON.parse(saved);
      this.savedSettings = JSON.parse(saved);
    }
  }

  // Apply font size and voice speed to app dynamically
  private applyAppSettings(settings: AccessibilitySettings) {
    // Font size
    document.documentElement.style.setProperty('--app-font-size', settings.textSize + 'px');
    // Voice speed (for TTS)
    document.documentElement.style.setProperty('--app-voice-speed', settings.voiceSpeed.toString());
    // Contrast Mode
    document.body.classList.remove('light-mode','dark-mode','high-contrast');
    if(settings.contrastMode === 'Light') document.body.classList.add('light-mode');
    else if(settings.contrastMode === 'Dark') document.body.classList.add('dark-mode');
    else document.body.classList.add('high-contrast');
  }

  applyChanges() {
    if(confirm('Are you sure you want to apply changes?')) {
      // Save to localStorage
      localStorage.setItem('accessibilitySettings', JSON.stringify(this.settings));
      this.savedSettings = { ...this.settings };
      // Apply to app
      this.applyAppSettings(this.settings);
      alert('Changes applied successfully!');
    }
  }

  cancelChanges() {
    this.settings = { ...this.savedSettings };
  }
}
