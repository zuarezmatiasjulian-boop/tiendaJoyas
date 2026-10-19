//FALTA BORRAR Y EDITAR PRODUCTOS ... CLASE 4 DE MAYO ADELANTE (!!!)

import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { Productos } from '../clases/productos';

@Injectable({
  providedIn: 'root', // Singleton: una sola instancia compartida en toda la app
})
export class ProductosService {
  private productos: Productos[] = []; // Lista de todos los productos publicados
  private isBrowser: boolean;         // Evita errores en el servidor (SSR)

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
    
      const stored = localStorage.getItem('mj_productos');
      if (stored) {
        this.productos = JSON.parse(stored);
      } else {
      
        this.productos = [
          new Productos('Alajas de oro', 50000, 'Hermosas alajas de oro 18k, perfectas para regalar.', 'admin'),
          new Productos('Productos de Plata', 35000, 'Plata 925 de alta calidad con garantía.', 'admin'),
          new Productos('Replicas', 15000, 'Replicas de alta fidelidad a precio accesible.', 'admin'),
        ];
        this.guardar();
      }
    }
  }

  // Devuelve todos los productos disponibles (usados en la pantalla de destacados)
  getProductos(): Productos[] {
    return this.productos;
  }

  // Agrega un nuevo producto a la lista y lo persiste en localStorage
  publicar(producto: Productos): void {
    this.productos.push(producto);
    this.guardar();
  }

  // Guarda el estado actual de los productos en localStorage
  private guardar(): void {
    if (this.isBrowser) {
      localStorage.setItem('mj_productos', JSON.stringify(this.productos));
    }
  }
}
