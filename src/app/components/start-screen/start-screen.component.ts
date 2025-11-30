import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { GameStateService, MiniGame } from '../../services/game-state.service';

@Component({
  selector: 'app-start-screen',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  games = this.gameState.miniGames;
  gameLogos: Record<number, string> = {
    1: 'assets/images/logo_minigame_1.png',
    2: 'assets/images/logo_minigame_2.png',
    3: 'assets/images/logo_minigame_3.png'
  };
  gameColors: Record<number, string> = {
    1: 'linear-gradient(145deg, #fff4d6, #ffd598)',
    2: 'linear-gradient(145deg, #e8f2ff, #c8d7ff)',
    3: 'linear-gradient(145deg, #e8fff3, #c6f4dd)'
  };

  constructor(private readonly gameState: GameStateService, private readonly router: Router) {}

  isUnlocked(gameId: number): boolean {
    return this.gameState.isGameUnlocked(gameId);
  }

  isCompleted(gameId: number): boolean {
    return this.gameState.isGameCompleted(gameId);
  }

  openGame(game: MiniGame): void {
    if (!this.isUnlocked(game.id)) {
      return;
    }

    // Placeholder navigation; real mini-games can hook into these routes later.
    this.router.navigateByUrl(game.route);
  }

  logoFor(gameId: number): string | undefined {
    return this.gameLogos[gameId];
  }

  colorFor(gameId: number): string | undefined {
    return this.gameColors[gameId];
  }
}
