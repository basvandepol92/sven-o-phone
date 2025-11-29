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
}
