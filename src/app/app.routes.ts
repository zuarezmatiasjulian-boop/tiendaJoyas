import { Routes } from '@angular/router';
import { Inicio } from './componentes/inicio/inicio';
import { Principal } from './componentes/principal/principal';
import { NotFound } from './componentes/not-found/not-found';
import { Error } from './componentes/error/error';
import { Registro } from './componentes/registro/registro';
import { Destacados } from './componentes/destacados/destacados';

export const routes: Routes = [
  {path:'',component:Inicio},
 {path:'registro',component:Registro},
  {path:'principal',component:Principal,children:[{path:'**',component:Destacados}]},
  {path:'inicio',component:Inicio},
  {path:"error",component:Error},
  {path:'**',component:NotFound}

];
