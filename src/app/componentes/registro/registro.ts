import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';
import { Usuario } from '../../clases/usuario';

@Component({
  selector: 'app-registro',
  imports: [RouterLink, FormsModule],
  templateUrl: './registro.html',
  styleUrl: './registro.css',
})
export class Registro {
  nombre: string = '';
  contrasena: string = '';
  confirmar: string = '';
  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  registrar(): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    if (!this.nombre.trim() || !this.contrasena.trim() || !this.confirmar.trim()) {
      this.mensajeError = 'Por favor completá todos los campos.';
      return;
    }

    if (this.contrasena !== this.confirmar) {
      this.mensajeError = 'Las contraseñas no coinciden.';
      return;
    }

    const nuevoUsuario = new Usuario(this.nombre.trim(), this.contrasena, 'usuario');
    const ok = this.authService.registrar(nuevoUsuario);

    if (ok) {
      this.mensajeExito = '¡Usuario creado exitosamente! Redirigiendo...';
      setTimeout(() => {
        this.router.navigate(['/inicio']);
      }, 1500);
    } else {
      this.mensajeError = 'Ya existe un usuario con ese nombre.';
    }
  }
}
