import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-inicio',
  imports: [RouterLink, FormsModule],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css',
})
export class Inicio {
  nombre: string = '';
  contrasena: string = '';
  mensajeError: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion(): void {
    this.mensajeError = '';

    if (!this.nombre.trim() || !this.contrasena.trim()) {
      this.mensajeError = 'Por favor completá todos los campos.';
      return;
    }

    const ok = this.authService.login(this.nombre.trim(), this.contrasena);
    if (ok) {
      this.router.navigate(['/principal']);
    } else {
      this.mensajeError = 'Usuario o contraseña incorrectos.';
    }
  }
}
