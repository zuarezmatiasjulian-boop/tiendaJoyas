import { Routes } from '@angular/router';
import { Inicio } from './componentes/inicio/inicio';
import { Principal } from './componentes/principal/principal';
import { NotFound } from './componentes/not-found/not-found';
import { Error } from './componentes/error/error';
import { Registro } from './componentes/registro/registro';
import { AdministrarUsuarios } from './componentes/administrar-usuarios/administrar-usuarios';
import { PublicarProducto } from './componentes/publicar-producto/publicar-producto';
import { Catalogo } from './componentes/catalogo/catalogo';

// Importamos el guard funcional que controla el acceso por rol
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  { path: '',        component: Inicio },
  { path: 'inicio',  component: Inicio },
  { path: 'registro', component: Registro },

  {
    path: 'principal',
    component: Principal,
    children: [
      // ── Ruta pública: cualquier usuario logueado puede verla ──────────────
      { path: '', component: Catalogo },

      // ── Rutas protegidas: solo el administrador puede acceder ─────────────
      // canActivate recibe un array; podés agregar más guards si lo necesitás
      {
        path: 'publicar-producto',
        component: PublicarProducto,
        canActivate: [adminGuard],   // 🔒 Solo administrador
      },
      {
        path: 'administrar-usuarios',
        component: AdministrarUsuarios,
        canActivate: [adminGuard],   // 🔒 Solo administrador
      },
    ],
  },

  { path: 'error', component: Error },
  { path: '**',    component: NotFound },
];
