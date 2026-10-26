import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';

// ── Importaciones de Firebase ──────────────────────────────────────────────────
import { initializeApp } from 'firebase/app';
import { environment } from '../environments/environment';

import { routes } from './app.routes';

// Inicializamos Firebase UNA sola vez con nuestra configuración
// initializeApp() devuelve la instancia de la app Firebase
const firebaseApp = initializeApp(environment.firebase);

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideClientHydration(withEventReplay()),
  ],
};

// Exportamos la instancia por si algún servicio la necesita directamente
export { firebaseApp };
