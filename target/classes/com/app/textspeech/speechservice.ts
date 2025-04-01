// src/services/speechService.ts

class SpeechService {
    private speechSynthesis: SpeechSynthesis;
    private voices: SpeechSynthesisVoice[] = [];
    private isVoicesLoaded: boolean = false;
  
    constructor() {
      if (typeof window !== 'undefined') {
        this.speechSynthesis = window.speechSynthesis;
        
        // Load voices
        this.loadVoices();
        
        // Some browsers (like Chrome) load voices asynchronously
        if (speechSynthesis.onvoiceschanged !== undefined) {
          speechSynthesis.onvoiceschanged = this.loadVoices.bind(this);
        }
      }
    }
  
    private loadVoices(): void {
      this.voices = this.speechSynthesis.getVoices();
      this.isVoicesLoaded = true;
    }
  
    public speak(text: string, options?: {
      rate?: number;     // 0.1 to 10
      pitch?: number;    // 0 to 2
      volume?: number;   // 0 to 1
      voice?: string;    // Voice name
    }): void {
      if (!this.speechSynthesis) {
        console.error('Speech synthesis not supported');
        return;
      }
  
      // Cancel any ongoing speech
      this.stop();
  
      // Create utterance
      const utterance = new SpeechSynthesisUtterance(text);
      
      // Set options if provided
      if (options) {
        if (options.rate) utterance.rate = options.rate;
        if (options.pitch) utterance.pitch = options.pitch;
        if (options.volume) utterance.volume = options.volume;
        
        // Set voice if specified and available
        if (options.voice && this.isVoicesLoaded) {
          const selectedVoice = this.voices.find(v => v.name === options.voice);
          if (selectedVoice) utterance.voice = selectedVoice;
        }
      }
      
      // Speak the text
      this.speechSynthesis.speak(utterance);
    }
  
    public stop(): void {
      if (this.speechSynthesis) {
        this.speechSynthesis.cancel();
      }
    }
  
    public pause(): void {
      if (this.speechSynthesis) {
        this.speechSynthesis.pause();
      }
    }
  
    public resume(): void {
      if (this.speechSynthesis) {
        this.speechSynthesis.resume();
      }
    }
  
    public getVoices(): SpeechSynthesisVoice[] {
      return this.voices;
    }
  
    public isSupported(): boolean {
      return typeof window !== 'undefined' && 'speechSynthesis' in window;
    }
  }
  
  // Singleton instance
  const speechService = new SpeechService();
  export default speechService;