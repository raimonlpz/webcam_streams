import {
  Component,
  effect,
  ElementRef,
  EventEmitter,
  inject,
  Output,
  signal,
  ViewChild,
} from '@angular/core';
import { CameraService } from '../../services/camera.service';
import { CameraModel } from '../../models/camera.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  @ViewChild('videoElement') videoElement!: ElementRef;
  @ViewChild('canvasElement') canvasElement!: ElementRef;
  private readonly cameraService = inject(CameraService);

  @Output() unselectCamEmit = new EventEmitter<void>();
  @Output() deleteCamEmit = new EventEmitter<string>();

  public selectedCam = signal<CameraModel | null>(null);
  public screenshots = signal<string[]>([]);

  constructor() {
    effect(
      async () => {
        this.selectedCam.set(this.cameraService.getSelectedCamera());
        this.screenshots.set(this.selectedCam()?.screenshots || []);
        if (this.videoElement) {
          this.videoElement.nativeElement.srcObject =
            this.selectedCam()?.stream;
        }
      },
      { allowSignalWrites: true }
    );
  }

  unselectCam(): void {
    this.unselectCamEmit.emit();
  }

  deleteCam(): void {
    this.deleteCamEmit.emit(this.selectedCam()?.id);
  }

  screenshot(): void {
    const canvas = this.canvasElement.nativeElement;
    const video = this.videoElement.nativeElement;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas
      .getContext('2d')
      ?.drawImage(video, 0, 0, canvas.width, canvas.height);
    const screenshot = canvas.toDataURL('image/png');
    this.cameraService.updateScreenshotForCamera(screenshot);
    this.screenshots.set([...this.screenshots(), screenshot]);
  }

  downloadScreenshot(screenshot: string): void {
    const link = document.createElement('a');
    link.href = screenshot;
    link.download = `${this.selectedCam()?.id}-screenshot.png`;
    link.click();
  }
}
