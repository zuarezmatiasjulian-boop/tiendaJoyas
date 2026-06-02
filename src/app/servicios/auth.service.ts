import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private usuarios: Usuario[] = [];
  private usuarioActual: Usuario | null = null;
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      // Cargo usuarios guardados, o creo el admin por defecto
      const stored = localStorage.getItem('mj_usuarios');
      if (stored) {
        this.usuarios = JSON.parse(stored);
      } else {
        this.usuarios = [new Usuario('admin', '1234', 'administrador')];
        this.guardarUsuarios();
      }

      // Restauro la sesión si ya estaba logeado
      const session = localStorage.getItem('mj_sesion');
      if (session) {
        this.usuarioActual = JSON.parse(session);
      }
    } else {
      // En el servidor usamos el usuario admin por defecto (sin persistencia)
      this.usuarios = [new Usuario('admin', '1234', 'administrador')];
    }
  }

  login(nombre: string, contrasena: string): boolean {
    const encontrado = this.usuarios.find(
      (u) => u.nombre === nombre && u.contrasena === contrasena
    );
    if (encontrado) {
      this.usuarioActual = encontrado;
      if (this.isBrowser) {
        localStorage.setItem('mj_sesion', JSON.stringify(encontrado));
      }
      return true;
    }
    return false;
  }

  registrar(usuario: Usuario): boolean {
    const existe = this.usuarios.find((u) => u.nombre === usuario.nombre);
    if (existe) return false;
    this.usuarios.push(usuario);
    this.guardarUsuarios();
    return true;
  }

  logout(): void {
    this.usuarioActual = null;
    if (this.isBrowser) {
      localStorage.removeItem('mj_sesion');
    }
  }

  getUsuarioActual(): Usuario | null {
    return this.usuarioActual;
  }

  estaLogeado(): boolean {
    return this.usuarioActual !== null;
  }

  private guardarUsuarios(): void {
    if (this.isBrowser) {
      localStorage.setItem('mj_usuarios', JSON.stringify(this.usuarios));
    }
  }
}
