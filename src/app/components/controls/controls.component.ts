import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [],
  templateUrl: './controls.component.html',
  styleUrl: './controls.component.css',
})
export class ControlsComponent {
  @Input() totalCams!: number;

  @Output() addCamEmit: EventEmitter<void> = new EventEmitter<void>();
  @Output() eraseAllCamsEmit: EventEmitter<void> = new EventEmitter<void>();
  @Output() unselectCamEmit: EventEmitter<void> = new EventEmitter<void>();

  addCam(): void {
    this.addCamEmit.emit();
  }

  eraseAllCams(): void {
    this.eraseAllCamsEmit.emit();
  }

  unselectCam(): void {
    this.unselectCamEmit.emit();
  }
}
