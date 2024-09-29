import { signalStore, patchState, withMethods, withState } from '@ngrx/signals';
import { CameraModel } from '../models/camera.model';

const initialState = {
  cameras: [],
  cameraSelected: null,
};

export const CameraRepositoryStore = signalStore(
  withState<{ cameras: CameraModel[]; cameraSelected: CameraModel | null }>(
    initialState
  ),
  withMethods((state) => {
    return {
      getCameras: (): CameraModel[] => {
        return state.cameras();
      },
      getCameraSelected: (): CameraModel | null => {
        return state.cameraSelected();
      },
      selectCamera: (cameraId: string) => {
        patchState(state, {
          cameras: state.cameras(),
          cameraSelected: state
            .cameras()
            .find((camera) => camera.id === cameraId),
        });
      },
      unselectCamera: () => {
        patchState(state, {
          cameras: state.cameras(),
          cameraSelected: null,
        });
      },
      addCamera: (camera: CameraModel) => {
        patchState(state, {
          cameras: [...state.cameras(), camera],
          cameraSelected: state.cameraSelected(),
        });
      },
      eraseCamera: (cameraId: string) => {
        patchState(state, {
          cameras: state.cameras().filter((camera) => {
            if (camera.id === cameraId) {
              camera.stream?.getTracks().forEach((track) => {
                track.stop();
              });
              return false;
            }
            return camera.id !== cameraId;
          }),
          cameraSelected: null,
        });
      },
      eraseAllCameras: () => {
        patchState(state, {
          cameraSelected: null,
          cameras: state
            .cameras()
            .map((camera) => {
              camera.stream?.getTracks().forEach((track) => track.stop());
              return camera;
            })
            .filter((camera) => camera.id === null),
        });
      },
      updateScreenshotForCamera: (screenshot: string) => {
        patchState(state, {
          cameras: state.cameras().map((camera) => {
            if (camera.id === state.cameraSelected()?.id) {
              return {
                ...camera,
                screenshots: [...camera.screenshots, screenshot],
              };
            }
            return camera;
          }),
          cameraSelected: state.cameraSelected(),
        });
      },
    };
  })
);
