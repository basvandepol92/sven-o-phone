import {
  AfterViewInit,
  Component,
  ElementRef,
  HostListener,
  OnDestroy,
  ViewChild
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';

interface Obstacle {
  x: number;
  width: number;
  gapY: number;
  gapHeight: number;
  scored?: boolean;
}

const HIGH_SCORE_KEY = 'svennieKruiptHighScore';

@Component({
  selector: 'app-svennie-kruipt',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './svennie-kruipt.component.html',
  styleUrls: ['./svennie-kruipt.component.scss']
})
export class SvennieKruiptComponent implements AfterViewInit, OnDestroy {
  @ViewChild('gameCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  currentScore = 0;
  highScore = 0;
  showIntro = true; // Instruction popup before game starts.
  showGameOver = false; // Game over popup visibility.
  targetScore = 2;

  // Game state flags
  private running = false;
  private rafId?: number;
  private lastFrame = 0;
  private svenY = 0;
  private svenVelocity = 0;
  private gravity = 0.28;
  private jumpStrength = -7.2;
  private svenX = 90;
  private svenRadius = 18;
  private obstacles: Obstacle[] = [];
  private obstacleSpeed = 2.1;
  private obstacleInterval = 2200; // ms
  private lastObstacleAt = 0;
  private canvasWidth = 600;
  private canvasHeight = 420;
  private destroyed = false;
  private spawnGlow = false;
  private svenImg: HTMLImageElement;
  private svenImgLoaded = false;

  constructor(
    private readonly router: Router,
    private readonly gameState: GameStateService,
    private readonly host: ElementRef<HTMLElement>
  ) {
    this.svenImg = new Image();
    this.svenImg.src = 'assets/images/logo_sven.png';
    this.svenImg.onload = () => {
      this.svenImgLoaded = true;
    };
  }

  ngAfterViewInit(): void {
    this.loadHighScore();
    this.resizeCanvas();
    this.resetGame();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.resizeCanvas();
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.code === 'Space') {
      event.preventDefault();
      this.handleJump();
    }
  }

  @HostListener('window:touchstart', ['$event'])
  onTouchStart(event: TouchEvent): void {
    event.preventDefault();
    this.handleJump();
  }

  @HostListener('window:click', ['$event'])
  onClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    // Avoid triggering jump when clicking buttons/links in overlays or toolbar.
    if (target.closest('.game-ui')) {
      return;
    }
    this.handleJump();
  }

  startFromIntro(): void {
    this.showIntro = false;
    this.showGameOver = false;
    this.resetGame();
    this.startGameLoop();
  }

  restartGame(): void {
    this.showGameOver = false;
    this.resetGame();
    this.startGameLoop();
  }

  goBack(): void {
    this.stopGameLoop();
    this.router.navigateByUrl('/start');
  }

  private handleJump(): void {
    if (!this.running) {
      return;
    }
    this.svenVelocity = this.jumpStrength;
  }

  private resetGame(): void {
    this.currentScore = 0;
    this.svenY = this.canvasHeight / 2;
    this.svenVelocity = 0;
    this.obstacles = [];
    this.lastObstacleAt = performance.now();
    this.spawnGlow = true;
    window.setTimeout(() => (this.spawnGlow = false), 1600);
  }

  private startGameLoop(): void {
    this.running = true;
    this.lastFrame = performance.now();
    this.loop();
  }

  private stopGameLoop(): void {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }

  private loop = (): void => {
    if (!this.running || this.destroyed) {
      return;
    }

    const now = performance.now();
    const delta = now - this.lastFrame;
    this.lastFrame = now;

    this.update(delta);
    this.draw();

    this.rafId = requestAnimationFrame(this.loop);
  };

  private update(delta: number): void {
    const ctx = this.canvasRef.nativeElement.getContext('2d');
    if (!ctx) {
      return;
    }

    // Spawn obstacles at interval with slight speed ramp-up for later points.
    const interval = Math.max(1400, this.obstacleInterval - this.currentScore * 40);
    if (this.obstacles.length === 0 || performance.now() - this.lastObstacleAt > interval) {
      this.spawnObstacle();
      this.lastObstacleAt = performance.now();
    }

    // Apply gravity and update Sven position
    this.svenVelocity += this.gravity;
    this.svenY += this.svenVelocity;

    // Move obstacles and handle scoring
    this.obstacles.forEach((obs) => {
      const speed = this.obstacleSpeed + Math.min(this.currentScore * 0.07, 1.2);
      obs.x -= speed;
      const passX = obs.x + obs.width;
      if (!obs.scored && passX < this.svenX - this.svenRadius) {
        obs.scored = true;
        this.currentScore += 1;
      }
    });

    // Remove off-screen obstacles
    this.obstacles = this.obstacles.filter((obs) => obs.x + obs.width > 0);

    // Collision detection
    if (this.detectCollision()) {
      this.handleGameOver();
      return;
    }

    // Bounds check
    if (this.svenY + this.svenRadius > this.canvasHeight || this.svenY - this.svenRadius < 0) {
      this.handleGameOver();
      return;
    }
  }

  private draw(): void {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Background
    const gradient = ctx.createLinearGradient(0, 0, 0, this.canvasHeight);
    gradient.addColorStop(0, '#e8f6ff');
    gradient.addColorStop(1, '#cde8ff');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.canvasWidth, this.canvasHeight);

    // Ground line
    ctx.fillStyle = '#a8d4ff';
    ctx.fillRect(0, this.canvasHeight - 12, this.canvasWidth, 12);

    // Obstacles
    ctx.fillStyle = '#8ec5ff';
    this.obstacles.forEach((obs) => {
      ctx.fillRect(obs.x, 0, obs.width, obs.gapY);
      ctx.fillRect(obs.x, obs.gapY + obs.gapHeight, obs.width, this.canvasHeight - (obs.gapY + obs.gapHeight));
    });

    // Sven avatar image (preloaded)
    ctx.save();
    ctx.translate(this.svenX, this.svenY);
    if (this.svenImgLoaded) {
      ctx.drawImage(this.svenImg, -this.svenRadius, -this.svenRadius, this.svenRadius * 2, this.svenRadius * 2);
    } else {
      // Simple fallback until the image is ready.
      ctx.beginPath();
      ctx.fillStyle = '#ffcf92';
      ctx.arc(0, 0, this.svenRadius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
    ctx.restore();

    // Spawn glow to show initial position clearly.
    if (this.spawnGlow) {
      const glow = ctx.createRadialGradient(this.svenX, this.svenY, 5, this.svenX, this.svenY, 40);
      glow.addColorStop(0, 'rgba(142, 240, 195, 0.45)');
      glow.addColorStop(1, 'rgba(142, 240, 195, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(this.svenX, this.svenY, 38, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }

  }

  private spawnObstacle(): void {
    const gapHeight = 180;
    const minGapY = 80;
    const maxGapY = this.canvasHeight - gapHeight - 80;
    const gapY = minGapY + Math.random() * (maxGapY - minGapY);
    this.obstacles.push({
      x: this.canvasWidth + 40,
      width: 60,
      gapY,
      gapHeight
    });
  }

  private detectCollision(): boolean {
    return this.obstacles.some((obs) => {
      const withinX = this.svenX + this.svenRadius > obs.x && this.svenX - this.svenRadius < obs.x + obs.width;
      if (!withinX) {
        return false;
      }
      const hitsTop = this.svenY - this.svenRadius < obs.gapY;
      const hitsBottom = this.svenY + this.svenRadius > obs.gapY + obs.gapHeight;
      return hitsTop || hitsBottom;
    });
  }

  private handleGameOver(): void {
    this.stopGameLoop();
    this.showGameOver = true;
    this.updateHighScore();

    // Unlock next game when reaching target score.
    if (this.currentScore >= this.targetScore) {
      this.gameState.markGameCompleted(1);
    }
  }

  private loadHighScore(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }
    const raw = localStorage.getItem(HIGH_SCORE_KEY);
    this.highScore = raw ? Number(raw) || 0 : 0;
  }

  private updateHighScore(): void {
    if (this.currentScore > this.highScore) {
      this.highScore = this.currentScore;
      if (typeof localStorage !== 'undefined') {
        // Persist highscore
        localStorage.setItem(HIGH_SCORE_KEY, String(this.highScore));
      }
    }
  }

  private resizeCanvas(): void {
    const canvas = this.canvasRef?.nativeElement;
    if (!canvas) {
      return;
    }
    const hostWidth = this.host.nativeElement.getBoundingClientRect().width;
    this.canvasWidth = Math.min(Math.max(hostWidth - 32, 480), 960);
    this.canvasHeight = Math.round(this.canvasWidth * 0.7);
    canvas.width = this.canvasWidth;
    canvas.height = this.canvasHeight;
  }

  ngOnDestroy(): void {
    this.destroyed = true;
    this.stopGameLoop();
  }
}
