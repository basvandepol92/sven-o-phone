import { Injectable } from '@angular/core';

export interface MiniGame {
  id: number;
  title: string;
  route: string;
}

const MINI_GAMES: MiniGame[] = [
  { id: 1, title: 'Svennie kruipt', route: '/game/1' },
  { id: 2, title: 'Svenneke svenneke', route: '/game/2' },
  { id: 3, title: 'Hoe goed ken jij Sven?', route: '/game/3' }
];

const STORAGE_KEY = 'svenophone-progress';
const HIGH_SCORE_KEY = 'svennieKruiptHighScore';
interface PersistedProgress {
  completed?: number[];
  shouldShowSplashAfterGame3?: boolean;
  hasShownSplashAfterGame3?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  readonly miniGames = MINI_GAMES;
  private completed = new Set<number>();
  private shouldShowSplashAfterGame3Flag = false;
  private hasShownSplashAfterGame3Flag = false;

  constructor() {
    this.loadState();
  }

  isGameCompleted(gameId: number): boolean {
    return this.completed.has(gameId);
  }

  isGameUnlocked(gameId: number): boolean {
    if (gameId === 1) {
      return true;
    }

    return this.isGameCompleted(gameId - 1);
  }

  markGameCompleted(gameId: number): void {
    if (!gameId) {
      return;
    }

    this.completed.add(gameId);
    this.saveState();
  }

  setCompletedList(gameIds: number[]): void {
    this.completed = new Set(gameIds ?? []);
    this.saveState();
  }

  getCompletedIds(): number[] {
    return Array.from(this.completed);
  }

  resetProgress(): void {
    this.completed.clear();
    this.shouldShowSplashAfterGame3Flag = false;
    this.hasShownSplashAfterGame3Flag = false;
    // Persist cleared progress
    this.saveState();
    // Clear highscore or other per-game stored data.
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(HIGH_SCORE_KEY);
    }
  }

  setShouldShowSplashAfterGame3(shouldShow: boolean): void {
    this.shouldShowSplashAfterGame3Flag = shouldShow;
    this.saveState();
  }

  shouldShowSplashAfterGame3(): boolean {
    return this.shouldShowSplashAfterGame3Flag;
  }

  hasShownSplashAfterGame3(): boolean {
    return this.hasShownSplashAfterGame3Flag;
  }

  markSplashShown(): void {
    this.hasShownSplashAfterGame3Flag = true;
    this.shouldShowSplashAfterGame3Flag = false;
    this.saveState();
  }

  private saveState(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      const payload = JSON.stringify({
        completed: Array.from(this.completed),
        shouldShowSplashAfterGame3: this.shouldShowSplashAfterGame3Flag,
        hasShownSplashAfterGame3: this.hasShownSplashAfterGame3Flag
      });
      localStorage.setItem(STORAGE_KEY, payload);
    } catch (err) {
      // Best effort persistence; ignore storage errors.
      console.warn('Kon de spelvoortgang niet opslaan', err);
    }
  }

  private loadState(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as PersistedProgress;
      (parsed.completed ?? []).forEach((id) => this.completed.add(id));
      this.shouldShowSplashAfterGame3Flag = Boolean(parsed.shouldShowSplashAfterGame3);
      this.hasShownSplashAfterGame3Flag = Boolean(parsed.hasShownSplashAfterGame3);
    } catch {
      // Ignore malformed persisted data.
    }
  }
}
