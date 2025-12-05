import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccessibilitySettings } from '../../../types/SettingsService';
import { SettingsService } from '../../../core/services/Voice/settings-service';
import { SpeechService } from '../../../core/services/Voice/speech-service';
import { Router } from '@angular/router';
import { KeyboardNav } from "../../../core/directives/accessibility/keyboard-nav";
import { Speak } from "../../../core/directives/accessibility/speak";

@Component({
  selector: 'app-setting',
  imports: [FormsModule, CommonModule, KeyboardNav, Speak],
  templateUrl: './setting.html',
  styleUrl: './setting.css',
})
export class Setting implements OnInit {

  private settingsService = inject(SettingsService);
  private speechService = inject(SpeechService);
  private router = inject(Router);

  // UI model
  settings: AccessibilitySettings = {
    textSize: 16,
    contrastMode: 'Light',
    enableSubtitles: false,
    voiceSpeed: 1.0,
    voiceVolume: 1.0,
    speechToText: false,
    keyboardNav: false,
    mode: 'blind'
  };

  // Store last successfully applied settings
  private appliedSettings: AccessibilitySettings = { ...this.settings };

  ngOnInit() {
    const current = this.settingsService.currentSettings;

    if (current) {
      this.settings = { ...current };
      this.appliedSettings = { ...current };
    }
  }

  // Apply & save settings
  applyChanges() {
    const ok = confirm('Are you sure you want to apply changes?');
    if (!ok) return;

    // Update the global application settings + persist
    this.settingsService.updateSettings({ ...this.settings });

    // Optional voice test
    try {
      this.speechService.speak(
        'Settings applied. Voice test.',
        this.settings.voiceSpeed,
        this.settings.voiceVolume
      );
    } catch {
      // ignore errors (browser restrictions)
    }

    this.appliedSettings = { ...this.settings };

    alert('Changes applied successfully!');
  }

  // Restore without applying
  cancelChanges() {
    const ok = confirm('Are you sure you want to discard changes?');
    if (!ok) return;

    this.settings = { ...this.appliedSettings };
    this.router.navigate(['/dashboad']);
  }

  previewVoice() {
    this.speechService.speak(
      'This is a voice preview.',
      this.settings.voiceSpeed,
      this.settings.voiceVolume
    );
  }

  
}
