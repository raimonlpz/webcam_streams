import {
  Component,
  effect,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { CameraModel } from '../../models/camera.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-camera',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './camera.component.html',
  styleUrl: './camera.component.css',
})
export class CameraComponent {
  @Input() camera!: CameraModel;
  @ViewChild('videoElement') videoElement!: ElementRef;
  @Output() selectCameraEmit = new EventEmitter<string>();

  public isActive = false;

  constructor() {
    effect(() => {
      this.videoElement.nativeElement.srcObject = this.camera.stream;
      this.videoElement.nativeElement.play();
    });
  }

  showDetails(): void {
    this.isActive = true;
  }

  hideDetails(): void {
    this.isActive = false;
  }

  selectCamera(): void {
    this.selectCameraEmit.emit(this.camera.id);
  }
}
