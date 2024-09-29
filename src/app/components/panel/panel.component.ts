import {
  Component,
  effect,
  inject,
  OnDestroy,
  signal,
  WritableSignal,
} from '@angular/core';
import { CameraComponent } from '../camera/camera.component';
import { HeaderComponent } from '../header/header.component';
import { CameraModel } from '../../models/camera.model';
import { CameraService } from '../../services/camera.service';
import { ControlsComponent } from '../controls/controls.component';
import { DetailsComponent } from '../details/details.component';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-panel',
  standalone: true,
  imports: [
    NgxPaginationModule,
    CameraComponent,
    HeaderComponent,
    ControlsComponent,
    DetailsComponent,
  ],
  templateUrl: './panel.component.html',
  styleUrl: './panel.component.css',
})
export class PanelComponent implements OnDestroy {
  public cameras: WritableSignal<CameraModel[]> = signal([]);
  public selectedCamera: WritableSignal<CameraModel | null> = signal(null);

  public page: number = 1;

  private readonly cameraService = inject(CameraService);

  constructor() {
    effect(
      () => {
        this.cameras.set(this.cameraService.getCameras());
      },
      { allowSignalWrites: true }
    );
    effect(
      () => {
        this.selectedCamera.set(this.cameraService.getSelectedCamera());
      },
      { allowSignalWrites: true }
    );
  }

  addCamera() {
    this.cameraService.addCamera();
  }

  deleteCamera(cameraId: string) {
    this.cameraService.deleteCamera(cameraId);
  }

  eraseAllCameras() {
    this.cameraService.deleteAllCameras();
  }

  selectCamera(cameraId: string) {
    this.cameraService.selectCamera(cameraId);
  }

  unselectCamera() {
    this.cameraService.unselectCamera();
  }

  ngOnDestroy() {
    this.cameraService.disposeAllCameras();
  }
}
