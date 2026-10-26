import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { Joya } from '../../clases/joya';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-carrito',
  standalone: true,
  imports: [CurrencyPipe, NgFor, NgIf],
  templateUrl: './carrito.html',
  styleUrl: './carrito.css',
})
export class Carrito {
  // Recibe la lista de joyas desde el componente padre (Catalogo)
  @Input() itemsCarrito: Joya[] = [];

  // Emite un evento hacia el padre para notificar que el carrito se vació
  @Output() vaciar = new EventEmitter<void>();

  // Variable de estado para controlar la visibilidad del modal de agradecimiento
  mostrarModalGracias: boolean = false;

  // Inyectamos AuthService para obtener el nombre del usuario logueado
  constructor(private authService: AuthService) {}

  /**
   * Suma los precios de todos los ítems del carrito.
   * Usa reduce(): parte de 0 y acumula el precio de cada joya.
   */
  calcularTotal(): number {
    return this.itemsCarrito.reduce((acumulado, joya) => acumulado + joya.precio, 0);
  }

  /**
   * Finaliza la compra:
   *   1. Arma el objeto pedido con usuario, fecha, ítems y total.
   *   2. Lo guarda en localStorage bajo la clave 'mj_pedidos'.
   *   3. Vacía el carrito local y notifica al padre.
   *   4. Activa el modal elegante con los datos del alias.
   */
  vaciarCarrito(): void {
    // Si el carrito está vacío no hacemos nada
    if (this.itemsCarrito.length === 0) return;

    // ── 1. Obtener el nombre del usuario logueado ─────────────────────────
    const usuario = this.authService.getUsuarioActual();
    const nombreCliente = usuario ? usuario.nombre : 'Anónimo';

    // ── 2. Armar el objeto pedido ─────────────────────────────────────────
    const nuevoPedido = {
      cliente: nombreCliente,
      fecha: new Date().toLocaleDateString('es-AR'),
      items: this.itemsCarrito.map(j => j.nombre), // solo los nombres
      total: this.calcularTotal(),
    };

    // ── 3. Leer los pedidos existentes en localStorage ────────────────────
    const guardados = localStorage.getItem('mj_pedidos');
    const pedidosActuales = guardados ? JSON.parse(guardados) : [];

    // ── 4. Agregar el nuevo pedido al arreglo y guardar ───────────────────
    pedidosActuales.push(nuevoPedido);
    localStorage.setItem('mj_pedidos', JSON.stringify(pedidosActuales));

    // ── 5. Vaciar el carrito y notificar al componente Padre ─────────────
    this.itemsCarrito = [];
    this.vaciar.emit();

    // ── 6. Abrir el modal de agradecimiento y datos de pago ──────────────
    this.mostrarModalGracias = true;
  }

  /**
   * Cierra el modal de confirmación de compra
   */
  cerrarModal(): void {
    this.mostrarModalGracias = false;
  }
}
