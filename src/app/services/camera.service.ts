import { inject, Injectable } from '@angular/core';
import { CameraRepositoryStore } from '../store/cam-repo.store';
import { CameraModel } from '../models/camera.model';
import { generateUID } from '../utils/functions';

@Injectable({
  providedIn: 'root',
})
export class CameraService {
  private readonly cameraRepoStore = inject(CameraRepositoryStore);

  constructor() {}

  getCameras(): CameraModel[] {
    return this.cameraRepoStore.getCameras();
  }

  async addCamera(): Promise<void> {
    let camStream: MediaStream | null = null;
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia!) {
      camStream = await navigator.mediaDevices.getUserMedia({ video: true });
    }
    return this.cameraRepoStore.addCamera({
      id: generateUID(),
      createdAt: new Date().toISOString(),
      screenshots: [],
      stream: camStream,
    });
  }

  deleteCamera(cameraId: string): void {
    return this.cameraRepoStore.eraseCamera(cameraId);
  }

  deleteAllCameras(): void {
    return this.cameraRepoStore.eraseAllCameras();
  }

  selectCamera(cameraId: string): void {
    return this.cameraRepoStore.selectCamera(cameraId);
  }

  unselectCamera(): void {
    return this.cameraRepoStore.unselectCamera();
  }

  getSelectedCamera(): CameraModel | null {
    return this.cameraRepoStore.getCameraSelected();
  }

  updateScreenshotForCamera(screenshot: string): void {
    return this.cameraRepoStore.updateScreenshotForCamera(screenshot);
  }

  disposeAllCameras() {
    this.getCameras().forEach((camera) => {
      if (camera.stream) {
        camera.stream.getTracks().forEach((track) => track.stop());
      }
    });
  }
}
