import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GameStateService } from '../../services/game-state.service';
import { GameConfigService } from '../../services/game-config.service';

interface Cup {
  id: number;
}

interface Difficulty {
  shuffleSteps: number;
  shuffleSpeedMs: number;
  cupCount: number;
}

@Component({
  selector: 'app-svennetje-svennetje',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './svennetje-svennetje.component.html',
  styleUrls: ['./svennetje-svennetje.component.scss']
})
export class SvennetjeSvennetjeComponent implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly gameState = inject(GameStateService);
  private readonly configService = inject(GameConfigService);
  cups: Cup[] = [];
  positions: number[] = []; // positions[cupIndex] -> slot index
  slotPercents: number[] = [];

  correctCount = 0;
  currentRoundSvenIndex = 0;
  isShuffling = false;
  canChoose = false;
  showIntro = true;
  showFailure = false;
  showSuccess = false;
  revealedCup: number | null = null;
  chosenCup: number | null = null;
  requiredTarget = 5;

  private shuffleTimers: number[] = [];
  private revealTimer?: number;
  private nextRoundTimer?: number;

  ngOnInit(): void {
    this.refreshConfig();
    this.setupCups(3);
  }

  startFromIntro(): void {
    this.showIntro = false;
    this.resetGame();
    this.startRound();
  }

  resetGame(): void {
    this.clearTimers();
    this.correctCount = 0;
    this.showFailure = false;
    this.showSuccess = false;
    this.chosenCup = null;
    const difficulty = this.getDifficulty();
    this.setupCups(difficulty.cupCount);
  }

  startRound(): void {
    this.clearTimers();
    this.isShuffling = false;
    this.canChoose = false;
    this.chosenCup = null;

    const difficulty = this.getDifficulty();
    if (this.cups.length !== difficulty.cupCount) {
      this.setupCups(difficulty.cupCount);
    }

    this.currentRoundSvenIndex = Math.floor(Math.random() * this.cups.length);
    this.revealedCup = this.currentRoundSvenIndex;

    // Brief reveal of Sven's hiding spot.
    this.revealTimer = window.setTimeout(() => {
      this.revealedCup = null;
      this.startShuffle(difficulty);
    }, 900);
  }

  startShuffle(difficulty: Difficulty): void {
    this.isShuffling = true;
    this.canChoose = false;
    const steps = difficulty.shuffleSteps;
    const speed = difficulty.shuffleSpeedMs;

    for (let i = 0; i < steps; i++) {
      const timer = window.setTimeout(() => {
        this.swapRandomCups();
        if (i === steps - 1) {
          this.endShuffle();
        }
      }, speed * (i + 1));
      this.shuffleTimers.push(timer);
    }
  }

  endShuffle(): void {
    this.isShuffling = false;
    this.canChoose = true;
  }

  handleCupSelection(index: number): void {
    if (!this.canChoose || this.showFailure || this.showSuccess) {
      return;
    }
    this.canChoose = false;
    this.chosenCup = index;

    if (index === this.currentRoundSvenIndex) {
      this.handleSuccess();
    } else {
      this.handleFailure();
    }
  }

  handleFailure(): void {
    this.showFailure = true;
  }

  handleSuccess(): void {
    this.correctCount += 1;
    if (this.correctCount >= this.requiredTarget) {
      this.handleGameWin();
      return;
    }

    // Start next round after a short pause.
    this.nextRoundTimer = window.setTimeout(() => this.startRound(), 700);
  }

  handleGameWin(): void {
    this.showSuccess = true;
    this.canChoose = false;
    this.isShuffling = false;
    // Unlock the next game.
    this.gameState.markGameCompleted(2);
  }

  tryAgain(): void {
    this.resetGame();
    this.showFailure = false;
    this.startRound();
  }

  goBack(): void {
    this.clearTimers();
    this.router.navigateByUrl('/start');
  }

  getSlotLeft(cupIndex: number): string {
    const slot = this.positions[cupIndex];
    const percent = this.slotPercents[slot] ?? 0;
    return `${percent}%`;
  }

  isSvenUnderCup(cupIndex: number): boolean {
    return this.revealedCup === cupIndex || this.chosenCup === cupIndex;
  }

  private setupCups(count: number): void {
    this.cups = Array.from({ length: count }, (_, i) => ({ id: i }));
    this.positions = this.cups.map((_, i) => i);
    this.slotPercents = this.getSlotPercents(count);
  }

  private swapRandomCups(): void {
    if (this.cups.length < 2) {
      return;
    }
    const a = Math.floor(Math.random() * this.cups.length);
    let b = Math.floor(Math.random() * this.cups.length);
    while (b === a) {
      b = Math.floor(Math.random() * this.cups.length);
    }

    // Swap positions
    const temp = this.positions[a];
    this.positions[a] = this.positions[b];
    this.positions[b] = temp;
  }

  private getSlotPercents(count: number): number[] {
    if (count === 4) {
      return [10, 35, 60, 85];
    }
    return [12, 45, 78];
  }

  private getDifficulty(): Difficulty {
    if (this.correctCount >= 4) {
      return { shuffleSteps: 7, shuffleSpeedMs: 450, cupCount: 3 };
    }
    if (this.correctCount >= 2) {
      return { shuffleSteps: 6, shuffleSpeedMs: 520, cupCount: 3 };
    }
    return { shuffleSteps: 4, shuffleSpeedMs: 650, cupCount: 3 };
  }

  private clearTimers(): void {
    this.shuffleTimers.forEach((id) => window.clearTimeout(id));
    this.shuffleTimers = [];
    window.clearTimeout(this.revealTimer);
    window.clearTimeout(this.nextRoundTimer);
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  private refreshConfig(): void {
    const cfg = this.configService.getConfig();
    this.requiredTarget = Math.max(1, cfg.svennetjeSvennetje.requiredCorrectCount);
  }
}
