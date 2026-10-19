import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ProductosService } from '../../servicios/productos.service';
import { Productos } from '../../clases/productos';

@Component({
  selector: 'app-destacados',
  imports: [FormsModule, DecimalPipe],
  templateUrl: './destacados.html',
  styleUrl: './destacados.css',
})
export class Destacados {
  busqueda: string = '';

  constructor(private productosService: ProductosService) {}

  get productosFiltrados(): Productos[] {
    const todos = this.productosService.getProductos();
    const q = this.busqueda.trim().toLowerCase();
    if (!q) return todos;
    return todos.filter(
      (p) =>
        p.nombre.toLowerCase().includes(q) ||
        p.descripcion.toLowerCase().includes(q)
    );
  }
}
