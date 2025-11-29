import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { GameStateService, MiniGame } from '../../services/game-state.service';

@Component({
  selector: 'app-game-placeholder',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './game-placeholder.component.html',
  styleUrls: ['./game-placeholder.component.scss']
})
export class GamePlaceholderComponent {
  game?: MiniGame;

  constructor(
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly gameState: GameStateService
  ) {
    this.route.paramMap.subscribe((params) => {
      const id = Number(params.get('id'));
      this.game = this.gameState.miniGames.find((g) => g.id === id);
    });
  }

  isUnlocked(): boolean {
    return this.game ? this.gameState.isGameUnlocked(this.game.id) : false;
  }

  isCompleted(): boolean {
    return this.game ? this.gameState.isGameCompleted(this.game.id) : false;
  }

  markCompleted(): void {
    if (!this.game) {
      return;
    }

    this.gameState.markGameCompleted(this.game.id);
  }

  backToMenu(): void {
    this.router.navigate(['/start']);
  }
}
