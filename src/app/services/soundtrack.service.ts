import { Injectable } from '@angular/core';

const DEFAULT_PATH = 'assets/music/soundtrack.mp3';

@Injectable({
  providedIn: 'root'
})
export class SoundtrackService {
  private audio?: HTMLAudioElement;
  private initialized = false;

  initialize(path: string = DEFAULT_PATH): void {
    if (!this.audio) {
      this.audio = new Audio(path);
      this.audio.loop = true;
      this.audio.volume = 0.5;
      this.initialized = true;
      return;
    }

    if (this.audio.src !== this.resolvePath(path)) {
      this.audio.src = path;
      this.audio.load();
    }
    this.initialized = true;
  }

  async play(): Promise<void> {
    if (!this.audio || !this.initialized) {
      this.initialize();
    }
    try {
      await this.audio!.play();
    } catch {
      // Autoplay might be blocked; ignore silently.
    }
  }

  pause(): void {
    this.audio?.pause();
  }

  togglePlayPause(): void {
    if (this.isPlaying()) {
      this.pause();
    } else {
      this.play();
    }
  }

  isPlaying(): boolean {
    return !!this.audio && !this.audio.paused;
  }

  private resolvePath(path: string): string {
    const a = document.createElement('a');
    a.href = path;
    return a.href;
  }
}
