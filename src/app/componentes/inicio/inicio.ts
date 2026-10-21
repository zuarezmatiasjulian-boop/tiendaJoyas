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
  // Campos que se vinculan con el formulario HTML mediante [(ngModel)]
  nombre: string = '';
  contrasena: string = '';


  mensajeError: string = ''; // Muestra errores debajo del formulario si el login falla

  constructor(private authService: AuthService, private router: Router) {}


  iniciarSesion(): void {
    this.mensajeError = '';

    // Valida que ambos campos estén completos antes de intentar el login
    if (!this.nombre.trim() || !this.contrasena.trim()) {
      this.mensajeError = 'Por favor completá todos los campos.';
      return;
    }// Llama al servicio de autenticación para verificar usuario y contraseña
    const ok = this.authService.login(this.nombre.trim(), this.contrasena);


    
    if (ok) {
      // Si el login es exitoso, redirige al panel principal
      this.router.navigate(['/principal']);
    } else {
      this.mensajeError = 'Usuario o contraseña incorrectos.';
    }
  }
}
