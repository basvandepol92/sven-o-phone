import { Injectable } from '@angular/core';

export interface MiniGame {
  id: number;
  title: string;
  route: string;
}

const MINI_GAMES: MiniGame[] = [
  { id: 1, title: 'Spel 1', route: '/game/1' },
  { id: 2, title: 'Spel 2', route: '/game/2' },
  { id: 3, title: 'Spel 3', route: '/game/3' }
];

const STORAGE_KEY = 'svenophone-progress';

@Injectable({
  providedIn: 'root'
})
export class GameStateService {
  readonly miniGames = MINI_GAMES;
  private completed = new Set<number>();

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

  private saveState(): void {
    if (typeof localStorage === 'undefined') {
      return;
    }

    try {
      const payload = JSON.stringify({ completed: Array.from(this.completed) });
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

      const parsed = JSON.parse(raw) as { completed?: number[] };
      (parsed.completed ?? []).forEach((id) => this.completed.add(id));
    } catch {
      // Ignore malformed persisted data.
    }
  }
}
