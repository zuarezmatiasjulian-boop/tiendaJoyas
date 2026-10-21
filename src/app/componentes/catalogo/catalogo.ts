import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';

import { Joya } from '../../clases/joya';
import { Usuario } from '../../clases/usuario';
import { JoyaCard } from '../joya-card/joya-card';
import { FiltroJoyaPipe } from '../../pipes/filtro-joya.pipe';
import { AuthService } from '../../servicios/auth.service';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule, JoyaCard, FiltroJoyaPipe],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit {

  // ── Variables del catálogo ──────────────────────────────────────────
  /** Lista completa de joyas que se muestra en la grilla */
  listaJoyas: Joya[] = [];

  /** Texto ingresado en el buscador; lo consume el pipe filtroJoya */
  textoBusqueda: string = '';

  /** Usuario con sesión activa (se pasa al componente hijo JoyaCard) */
  usuarioLogueado: Usuario | null = null;

  /** Mensaje temporal que se muestra al agregar al carrito */
  mensajeCarrito: string = '';

  // ── Carrito en memoria ──────────────────────────────────────────────
  /** Colección de joyas agregadas al carrito en esta sesión */
  carrito: Joya[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Obtiene el usuario logueado desde el servicio de autenticación
    this.usuarioLogueado = this.authService.getUsuarioActual();

    // Datos de ejemplo — reemplazá esto con una llamada al servicio real
    this.listaJoyas = [
      { id: 1, nombre: 'Anillo de Oro 18k', precio: 85000,  imagen: 'https://placehold.co/300x300/c9a84c/fff?text=Anillo+Oro',      categoria: 'Anillos',    stock: 5 },
      { id: 2, nombre: 'Collar de Plata',   precio: 42000,  imagen: 'https://placehold.co/300x300/9e9e9e/fff?text=Collar+Plata',     categoria: 'Collares',   stock: 8 },
      { id: 3, nombre: 'Pulsera Dorada',    precio: 37500,  imagen: 'https://placehold.co/300x300/c9a84c/fff?text=Pulsera+Dorada',   categoria: 'Pulseras',   stock: 3 },
      { id: 4, nombre: 'Aros de Perla',     precio: 55000,  imagen: 'https://placehold.co/300x300/e8e0d5/333?text=Aros+Perla',      categoria: 'Aros',       stock: 0 },
      { id: 5, nombre: 'Dije de Corazón',   precio: 28000,  imagen: 'https://placehold.co/300x300/c9a84c/fff?text=Dije+Corazon',    categoria: 'Dijes',      stock: 10 },
      { id: 6, nombre: 'Brazalete Plata',   precio: 61000,  imagen: 'https://placehold.co/300x300/9e9e9e/fff?text=Brazalete+Plata', categoria: 'Pulseras',   stock: 2 },
    ];
  }

  /**
   * Se ejecuta cuando el componente hijo JoyaCard emite el evento agregarAlCarrito.
   * Agrega la joya al carrito y muestra una notificación breve.
   */
  onAgregarAlCarrito(joya: Joya): void {
    this.carrito.push(joya);
    this.mensajeCarrito = `"${joya.nombre}" agregado al carrito. (${this.carrito.length} ítem/s)`;

    // Oculta la notificación luego de 3 segundos
    setTimeout(() => {
      this.mensajeCarrito = '';
    }, 3000);
  }
}
