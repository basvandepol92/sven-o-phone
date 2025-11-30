import { Component, EventEmitter, Input, OnChanges, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SvenGameConfig } from '../../services/game-config.service';

@Component({
  selector: 'app-configurator-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configurator-dialog.component.html',
  styleUrls: ['./configurator-dialog.component.scss']
})
export class ConfiguratorDialogComponent implements OnChanges {
  @Input() config!: SvenGameConfig;
  @Input() completedIds: number[] = [];
  @Output() save = new EventEmitter<{ config: SvenGameConfig; completedIds: number[] }>();
  @Output() cancel = new EventEmitter<void>();
  @Output() resetAll = new EventEmitter<void>();

  workingCopy!: SvenGameConfig;
  workingCompleted = new Set<number>();

  ngOnChanges(): void {
    this.workingCopy = structuredClone(this.config);
    this.workingCompleted = new Set(this.completedIds ?? []);
  }

  onSave(): void {
    // Basic validation / clamping
    this.workingCopy.svennieKruipt.minScoreToWin = this.clamp(this.workingCopy.svennieKruipt.minScoreToWin, 1, 999);
    this.workingCopy.svennetjeSvennetje.requiredCorrectCount = this.clamp(
      this.workingCopy.svennetjeSvennetje.requiredCorrectCount,
      1,
      999
    );
    this.workingCopy.quiz.requiredCorrectAnswers = this.clamp(this.workingCopy.quiz.requiredCorrectAnswers, 1, 10);
    this.workingCopy.quiz.secondsPerQuestion = this.clamp(this.workingCopy.quiz.secondsPerQuestion, 1, 999);
    this.save.emit({ config: this.workingCopy, completedIds: Array.from(this.workingCompleted) });
  }

  onCancel(): void {
    this.cancel.emit();
  }

  onResetAll(): void {
    this.resetAll.emit();
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, Number(value) || min));
  }

  toggleCompleted(id: number, checked: boolean): void {
    if (checked) {
      this.workingCompleted.add(id);
    } else {
      this.workingCompleted.delete(id);
    }
  }
}
