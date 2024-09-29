import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { CameraRepositoryStore } from './store/cam-repo.store';

const provideStores = (): any[] => [CameraRepositoryStore];

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideStores()],
};
