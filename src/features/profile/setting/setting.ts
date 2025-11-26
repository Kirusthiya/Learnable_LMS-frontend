import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccessibilitySettings } from '../../../types/SettingsService';
import { SettingsService } from '../../../core/services/Voice/settings-service';
import { SpeechService } from '../../../core/services/Voice/speech-service';



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
    voiceVolume: 1.0,
    speechToText: false,
    keyboardNav: false,
  };

  // snapshot of last applied
  private appliedSettings: AccessibilitySettings = { ...this.settings };

  constructor(
    private settingsService: SettingsService,
    private speechService: SpeechService
  ) {}

  ngOnInit() {
    // get current app settings from service
    const current = this.settingsService.currentSettings;
    if (current) {
      this.settings = { ...current };
      this.appliedSettings = { ...current };
    }
  }

  // Apply (with confirmation). Only on OK will the service be updated and app changed.
  applyChanges() {
    const ok = confirm('Are you sure you want to apply changes?');
    if (!ok) return;

    // update globally via service (also saves to localStorage)
    this.settingsService.updateSettings({ ...this.settings });

    // optional: immediate voice test to confirm speed + volume
    try {
      this.speechService.speak('Settings applied. Voice test.', this.settings.voiceSpeed, this.settings.voiceVolume);
    } catch {
      // ignore if synthesis not available
    }

    // set snapshot
    this.appliedSettings = { ...this.settings };
    alert('Changes applied successfully!');
  }

  // Cancel: restore last applied settings in UI (no app change)
  cancelChanges() {
    this.settings = { ...this.appliedSettings };
  }

  // helper for immediate preview without applying (optional)
  previewVoice() {
    this.speechService.speak('This is a voice preview.', this.settings.voiceSpeed, this.settings.voiceVolume);
  }
}
