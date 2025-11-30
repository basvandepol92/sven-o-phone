import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { InstructionsDialogComponent } from '../instructions-dialog/instructions-dialog.component';
import { SoundtrackService } from '../../services/soundtrack.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, InstructionsDialogComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  instructionsOpen = false;
  constructor(private readonly router: Router, private readonly soundtrack: SoundtrackService) {}

  openInstructions(): void {
    this.instructionsOpen = true;
  }

  closeInstructions(): void {
    this.instructionsOpen = false;
  }

  startGame(): void {
    this.soundtrack.initialize();
    this.soundtrack.play();
    this.router.navigateByUrl('/start');
  }
}
