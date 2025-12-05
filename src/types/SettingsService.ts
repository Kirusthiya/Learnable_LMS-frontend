export type AccessibilitySettings= {
  textSize: number;
  contrastMode: 'Light' | 'Dark' | 'High Contrast';
  enableSubtitles: boolean;
  voiceSpeed: number;
  voiceVolume: number;
  speechToText: boolean;
  keyboardNav: boolean;
  mode: 'blind' | 'deaf'; 
};

