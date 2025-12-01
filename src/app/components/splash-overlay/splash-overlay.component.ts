import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';

interface ConfettiPiece {
  id: number;
  left: number;
  size: number;
  color: string;
  fallDuration: number;
  delay: number;
  drift: number;
  startRotation: number;
  endRotation: number;
}

@Component({
  selector: 'app-splash-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './splash-overlay.component.html',
  styleUrls: ['./splash-overlay.component.scss']
})
export class SplashOverlayComponent {
  @Output() closed = new EventEmitter<void>();

  confettiPieces: ConfettiPiece[] = this.buildConfettiPieces(60);

  close(): void {
    this.closed.emit();
  }

  private buildConfettiPieces(count: number): ConfettiPiece[] {
    const colors = ['#ff6b6b', '#ffd166', '#4ecdc4', '#5e60ce', '#ffa69e'];
    return Array.from({ length: count }, (_, index) => {
      const size = 6 + Math.random() * 8;
      const startRotation = Math.random() * 180;
      const drift = Math.random() * 160 - 80;

      return {
        id: index,
        left: Math.random() * 100,
        size,
        color: colors[index % colors.length],
        fallDuration: 6 + Math.random() * 5,
        delay: Math.random() * 3,
        drift,
        startRotation,
        endRotation: startRotation + 200 + Math.random() * 300
      };
    });
  }
}
