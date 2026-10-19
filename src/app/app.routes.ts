import { Routes } from '@angular/router';
import { Inicio } from './componentes/inicio/inicio';
import { Principal } from './componentes/principal/principal';
import { NotFound } from './componentes/not-found/not-found';
import { Error } from './componentes/error/error';
import { Registro } from './componentes/registro/registro';
import { Destacados } from './componentes/destacados/destacados';
import { AdministrarUsuarios } from './componentes/administrar-usuarios/administrar-usuarios';
import { PublicarProducto } from './componentes/publicar-producto/publicar-producto';


export const routes: Routes = [
  { path: '', component: Inicio },
  { path: 'inicio', component: Inicio },
  { path: 'registro', component: Registro },
  {
    path: 'principal',
    component: Principal,
    children: [
      { path: '', component: Destacados },
      { path: 'publicar-producto', component: PublicarProducto },
      { path: 'administrar-usuarios', component: AdministrarUsuarios },
      { path: '**', component: Destacados },
    ],
  },
  { path: 'error', component: Error },
  { path: '**', component: NotFound },
];
