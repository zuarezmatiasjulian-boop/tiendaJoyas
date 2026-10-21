import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Usuario } from '../clases/usuario';

@Injectable({
  providedIn: 'root', // Singleton
})
export class AuthService {
  private usuarios: Usuario[] = [];           // Lista de todos los usuarios registrados
  private usuarioActual: Usuario | null = null; // Usuario con sesión activa (null = no hay sesión)
  private isBrowser: boolean;                 // Evita errores al ejecutarse en el servidor (SSR)


  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      const stored = localStorage.getItem('mj_usuarios');
      if (stored) {
        this.usuarios = JSON.parse(stored);
      } else {

        // Si no hay usuarios, crea el administrador por defecto
        this.usuarios = [new Usuario('admin', '1234', 'administrador')];
        this.guardarUsuarios();
      }

    //restaurar session
      const session = localStorage.getItem('mj_sesion');
      if (session) {
        this.usuarioActual = JSON.parse(session);
      }
    } else {
      // En el servidor (SSR) no hay localStorage, se usa solo el admin por defecto
      this.usuarios = [new Usuario('admin', '1234', 'administrador')];
    }
  }

  // Verifica usuario y contraseña. Devuelve true si el login es exitoso
  login(nombre: string, contrasena: string): boolean {
    const encontrado = this.usuarios.find(
      (u) => u.nombre === nombre && u.contrasena === contrasena
    );
    if (encontrado) {
      this.usuarioActual = encontrado;


      // Guarda la sesión en localStorage para que persista al recargar
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

  

  // Devuelve el usuario con sesión activa (o null si nadie está logueado)
  getUsuarioActual(): Usuario | null {
    return this.usuarioActual;
  }

  // Comprueba si hay algún usuario logueado
  estaLogeado(): boolean {
    return this.usuarioActual !== null;
  }



  // Devuelve la lista completa de usuarios (usada en el panel de administración)
  getUsuarios(): Usuario[] {
    return this.usuarios;
  }

  // Elimina un usuario por nombre. No permite eliminar al admin
  eliminarUsuario(nombre: string): boolean {
    if (nombre === 'admin') return false; // El administrador no puede eliminarse
    const idx = this.usuarios.findIndex((u) => u.nombre === nombre);
    if (idx === -1) return false;
    this.usuarios.splice(idx, 1);
    this.guardarUsuarios();
    return true;
  }

  // Guarda el array de usuarios en localStorage para que persista
  private guardarUsuarios(): void {
    if (this.isBrowser) {
      localStorage.setItem('mj_usuarios', JSON.stringify(this.usuarios));
    }
  }
}
