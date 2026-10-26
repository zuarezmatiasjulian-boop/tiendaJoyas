import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { AuthService } from '../../servicios/auth.service';
import { Usuario } from '../../clases/usuario';
import { GraficoVentas } from '../grafico-ventas/grafico-ventas';

@Component({
  selector: 'app-administrar-usuarios',
  imports: [CurrencyPipe, GraficoVentas],
  templateUrl: './administrar-usuarios.html',
  styleUrl: './administrar-usuarios.css',
})
export class AdministrarUsuarios implements OnInit {
  usuarios: Usuario[] = []; // Lista de todos los usuarios registrados
  mensajeExito: string = '';
  mensajeError: string = '';

  // Lista de pedidos guardados por los clientes al finalizar su compra
  pedidos: any[] = [];

  constructor(private authService: AuthService, private router: Router) {}

  // VERIFICAR SI ES ADMIN
  ngOnInit(): void {
    const usuario = this.authService.getUsuarioActual();

    //SI NO , REDIGUE AL PANEL PRINCIPAL
    if (!usuario || usuario.rol !== 'administrador') {
      this.router.navigate(['/principal']);
      return;
    }

    this.cargarUsuarios();
    this.cargarPedidos();
  }

  // Obtiene la lista de usuarios desde el service
  cargarUsuarios(): void {
    this.usuarios = this.authService.getUsuarios();
  }

  // Lee los pedidos desde localStorage (misma lógica que usuarios)
  cargarPedidos(): void {
    const guardados = localStorage.getItem('mj_pedidos');
    // Si hay pedidos los parseamos; si no, el arreglo queda vacío
    this.pedidos = guardados ? JSON.parse(guardados) : [];
  }
 

  eliminar(nombre: string): void {
    this.mensajeExito = '';
    this.mensajeError = '';

    if (nombre === this.authService.getUsuarioActual()?.nombre) {
      this.mensajeError = 'No podés eliminar tu propia cuenta.';
      return;
    }const ok = this.authService.eliminarUsuario(nombre);


    if (ok) {
      this.mensajeExito = `Usuario "${nombre}" eliminado correctamente.`;
      this.cargarUsuarios(); // actualiza tabla al eliminar un usuario
    } else {
      this.mensajeError = `No se pudo eliminar al usuario "${nombre}".`;
    }
  }

  // Devuelve una etiqueta rol 
  getRolLabel(rol: string): string {
    return rol === 'administrador' ? 'Admin' : 'Usuario';
  }
}
