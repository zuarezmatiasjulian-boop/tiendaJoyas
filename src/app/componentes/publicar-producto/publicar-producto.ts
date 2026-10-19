import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ProductosService } from '../../servicios/productos.service';
import { AuthService } from '../../servicios/auth.service';
import { Productos } from '../../clases/productos';

@Component({
  selector: 'app-publicar-producto',
  imports: [FormsModule],
  templateUrl: './publicar-producto.html',
  styleUrl: './publicar-producto.css',
})
export class PublicarProducto {
  // Campos del formulario vinculados con [(ngModel)]
  nombre: string = '';
  precio: number = 0;
  descripcion: string = '';
  mensajeError: string = '';
  mensajeExito: string = '';

  constructor(
    private productosService: ProductosService,
    private authService: AuthService,
    private router: Router
  ) {}

  // Se ejecuta al hacer clic en "Publicar"
  publicar(): void {
    this.mensajeError = '';
    this.mensajeExito = '';


    // valida nombre y despcripcion (FALTA FTOO)
    if (!this.nombre.trim() || !this.descripcion.trim()) {
      this.mensajeError = 'Por favor completá todos los campos.';
      return;
    }

    // valida que el numero debe ser positivo 
    if (this.precio <= 0) {
      this.mensajeError = 'El precio debe ser mayor a 0.';
      return;
    }
    //AUTORIA DEL PRODUCTO
    const usuario = this.authService.getUsuarioActual();

    // Crea el objeto producto con los datos del formulario
    const producto = new Productos(
      this.nombre.trim(),
      this.precio,
      this.descripcion.trim(),
      usuario?.nombre || 'Anónimo' // Si no hay sesión activa, figura como "Anónimo"
    );

    // Guarda el producto en el servicio (y en localStorage)
    this.productosService.publicar(producto);
    this.mensajeExito = `¡"${producto.nombre}" publicado correctamente!`;

    // Limpia el formulario para poder publicar otro producto
    this.nombre = '';
    this.precio = 0;
    this.descripcion = '';
  }



  
  verProductos(): void {
    this.router.navigate(['/principal']);
  }
}
