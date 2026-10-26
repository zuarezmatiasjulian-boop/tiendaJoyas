import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Joya } from '../../clases/joya';
import { Usuario } from '../../clases/usuario';
import { HoverColorDirective } from '../../directivas/hover-color.directive';

@Component({
  selector: 'app-joya-card',
  imports: [CurrencyPipe, HoverColorDirective],
  templateUrl: './joya-card.html',
  styleUrl: './joya-card.css',
})
export class JoyaCard {
  // Recibe el objeto Joya desde el componente Padre
  @Input() joya!: Joya;

  // Recibe el usuario con sesión activa (opcional — puede ser null)
  @Input() usuarioActual: Usuario | null = null;

  // Emite el objeto Joya cuando el usuario hace clic en "Agregar al Carrito"
  @Output() agregarAlCarrito = new EventEmitter<Joya>();

  // Método que se ejecuta al hacer clic en el botón
  onAgregar(): void {
    this.agregarAlCarrito.emit(this.joya);
  }
}
