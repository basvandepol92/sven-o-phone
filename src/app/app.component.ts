import { Component, OnDestroy, ElementRef, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SoundtrackService } from './services/soundtrack.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  @ViewChild('liveVideo') liveVideoRef?: ElementRef<HTMLVideoElement>;
  eqBars = Array.from({ length: 30 }, (_, i) => i);
  speakerPulse = false;
  showLiveVideo = false;
  private pulseTimeout?: number;
  private audioStopTimeout?: number;
  private snoreAudio = new Audio('assets/music/snore.mp3');
  constructor(public readonly soundtrack: SoundtrackService) {}

  triggerPulse(): void {
    this.speakerPulse = false;
    window.clearTimeout(this.pulseTimeout);
    window.clearTimeout(this.audioStopTimeout);

    // Slight delay lets the animation restart when clicked rapidly.
    requestAnimationFrame(() => {
      this.speakerPulse = true;
      this.pulseTimeout = window.setTimeout(() => (this.speakerPulse = false), 10000);
      this.playSnoreSound();
    });
  }

  ngOnDestroy(): void {
    window.clearTimeout(this.pulseTimeout);
    window.clearTimeout(this.audioStopTimeout);
    this.stopSnoreSound();
  }

  toggleMusic(): void {
    this.soundtrack.togglePlayPause();
  }

  musicIcon(): string {
    return this.soundtrack.isPlaying() ? '⏸' : '▶';
  }

  openLiveVideo(): void {
    this.showLiveVideo = true;
  }

  closeLiveVideo(): void {
    this.showLiveVideo = false;
    this.liveVideoRef?.nativeElement.pause();
  }

  private playSnoreSound(): void {
    this.snoreAudio.currentTime = 0;
    this.snoreAudio.loop = false;
    this.snoreAudio
      .play()
      .catch(() => {
        // Audio may fail if file missing or autoplay blocked; ignore.
      });

    this.audioStopTimeout = window.setTimeout(() => this.stopSnoreSound(), 10000);
  }

  private stopSnoreSound(): void {
    this.snoreAudio.pause();
    this.snoreAudio.currentTime = 0;
  }
}
