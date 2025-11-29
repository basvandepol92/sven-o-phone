import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-instructions-dialog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './instructions-dialog.component.html',
  styleUrls: ['./instructions-dialog.component.scss']
})
export class InstructionsDialogComponent {
  @Input() open = false;
  @Output() close = new EventEmitter<void>();
}
