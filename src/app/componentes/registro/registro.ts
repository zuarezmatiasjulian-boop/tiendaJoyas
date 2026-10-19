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
  // Campos vinculados al formulario HTML
  nombre: string = '';
  contrasena: string = '';
  confirmar: string = '';         // Confirmación de contraseña para evitar errores al tipear
  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  // Se ejecuta al enviar el formulario de registro
  registrar(): void {
    this.mensajeError = '';
    this.mensajeExito = '';

    
    // Valida que ningún campo esté vacío
    if (!this.nombre.trim() || !this.contrasena.trim() || !this.confirmar.trim()) {
      this.mensajeError = 'Por favor completá todos los campos.';
      return;
    }

    // Verifica que las dos contraseñas ingresadas coincidan
    if (this.contrasena !== this.confirmar) {
      this.mensajeError = 'Las contraseñas no coinciden.';
      return;
    }

    // Crea el objeto usuario con rol 'usuario' por defecto (no admin) ADMIN , solo hay 1 
    const nuevoUsuario = new Usuario(this.nombre.trim(), this.contrasena, 'usuario');

    // Intenta registrar: falla si ya existe un usuario con ese nombre
    const ok = this.authService.registrar(nuevoUsuario);

    if (ok) {
      this.mensajeExito = '¡Usuario creado exitosamente! Redirigiendo...';
      // CLASE DEL 27.  Se esepera 1segundo , para "pensar" y darle un mensaje 
      setTimeout(() => {
        this.router.navigate(['/inicio']);
      }, 1500);
    } else {
      this.mensajeError = 'Ya existe un usuario con ese nombre.';
    }
  }
}
