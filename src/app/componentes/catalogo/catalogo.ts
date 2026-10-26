import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';

import { Joya } from '../../clases/joya';
import { Usuario } from '../../clases/usuario';
import { JoyaCard } from '../joya-card/joya-card';
import { FiltroJoyaPipe } from '../../pipes/filtro-joya.pipe';
import { AuthService } from '../../servicios/auth.service';
import { Carrito } from '../carrito/carrito';

// ── Firestore ────────────────────────────────────────────────────────────────
import {
  getFirestore,
  collection,
  addDoc,       // agrega un documento nuevo
  onSnapshot,  // escucha cambios en tiempo real
  query,        // construye consultas
  where,        // filtra por joyaId
  Unsubscribe,  // tipo del "cancelador" de la suscripción
} from 'firebase/firestore';
import { firebaseApp } from '../../app.config';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [FormsModule, JoyaCard, FiltroJoyaPipe, Carrito, CurrencyPipe],
  templateUrl: './catalogo.html',
  styleUrl: './catalogo.css',
})
export class Catalogo implements OnInit, OnDestroy {

  // ── Variables del catálogo ────────────────────────────────────────────────
  listaJoyas: Joya[] = [];
  textoBusqueda: string = '';
  usuarioLogueado: Usuario | null = null;
  mensajeCarrito: string = '';
  carrito: Joya[] = [];

  // ── Variables del foro / comentarios ─────────────────────────────────────
  /** Joya sobre la que se muestran comentarios (null = ninguna seleccionada) */
  joyaSeleccionada: Joya | null = null;

  /** Lista de comentarios que llega en tiempo real desde Firestore */
  comentarios: { usuario: string; texto: string; fecha: string }[] = [];

  /** Texto que el usuario escribe en el input del foro */
  nuevoComentario: string = '';

  /**
   * onSnapshot devuelve una función "cancelador" (Unsubscribe).
   * La guardamos para llamarla en ngOnDestroy() y evitar memory leaks.
   */
  private cancelarSuscripcion: Unsubscribe | null = null;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.usuarioLogueado = this.authService.getUsuarioActual();

    this.listaJoyas = [
      { id: 1, nombre: 'Anillo de Oro 18k', precio: 85000,  imagen: 'https://placehold.co/300x300/c9a84c/fff?text=Anillo+Oro',      categoria: 'Anillos',  stock: 5  },
      { id: 2, nombre: 'Collar de Plata',   precio: 42000,  imagen: 'https://placehold.co/300x300/9e9e9e/fff?text=Collar+Plata',     categoria: 'Collares', stock: 8  },
      { id: 3, nombre: 'Pulsera Dorada',    precio: 37500,  imagen: 'https://placehold.co/300x300/c9a84c/fff?text=Pulsera+Dorada',   categoria: 'Pulseras', stock: 3  },
      // { id: 4, nombre: 'Aros de Perla',     precio: 55000,  imagen: 'https://placehold.co/300x300/e8e0d5/333?text=Aros+Perla',      categoria: 'Aros',     stock: 0  }, // Quitado: sin stock (stock <= 0)
      { id: 5, nombre: 'Dije de Corazón',   precio: 28000,  imagen: 'https://placehold.co/300x300/c9a84c/fff?text=Dije+Corazon',    categoria: 'Dijes',    stock: 10 },
      { id: 6, nombre: 'Brazalete Plata',   precio: 61000,  imagen: 'https://placehold.co/300x300/9e9e9e/fff?text=Brazalete+Plata', categoria: 'Pulseras', stock: 2  },
    ].filter(joya => joya.stock > 0); // Criterio de negocio: si está publicado significa que hay stock

    // ── Auto-seleccionar la primera joya ─────────────────────────────────────
    // Garantiza que onSnapshot se active al cargar el componente (incluyendo F5).
    // Sin esto, los comentarios solo aparecerían al hacer clic manualmente.
    if (this.listaJoyas.length > 0) {
      this.seleccionarJoya(this.listaJoyas[0]);
    }
  }

  /** Cancela el listener de Firestore al destruir el componente (evita memory leak). */
  ngOnDestroy(): void {
    if (this.cancelarSuscripcion) {
      this.cancelarSuscripcion();
    }
  }

  // ── Carrito ───────────────────────────────────────────────────────────────

  onAgregarAlCarrito(joya: Joya): void {
    const cantidadEnCarrito = this.carrito.filter(j => j.id === joya.id).length;

    if (cantidadEnCarrito >= joya.stock) {
      this.mensajeCarrito = `⚠️ Stock agotado para "${joya.nombre}". Máximo: ${joya.stock} unidad/es.`;
      setTimeout(() => { this.mensajeCarrito = ''; }, 3000);
      return;
    }

    this.carrito.push(joya);
    this.mensajeCarrito = `"${joya.nombre}" agregado al carrito. (${cantidadEnCarrito + 1}/${joya.stock} en stock)`;
    setTimeout(() => { this.mensajeCarrito = ''; }, 3000);
  }

  /**
   * Quita o elimina un producto de la lista del catálogo.
   * Criterio: si no hay stock o el admin usa la opción de quitar, deja de estar disponible.
   */
  quitarProducto(id: number): void {
    this.listaJoyas = this.listaJoyas.filter(joya => joya.id !== id);
    if (this.joyaSeleccionada?.id === id) {
      this.joyaSeleccionada = this.listaJoyas.length > 0 ? this.listaJoyas[0] : null;
    }
  }

  // ── Foro / Comentarios ────────────────────────────────────────────────────

  /**
   * Se ejecuta al hacer clic en una tarjeta (o automáticamente desde ngOnInit).
   * Cambia la joya seleccionada y activa la escucha en tiempo real de Firestore.
   *
   * ⚠️ IMPORTANTE: NO usamos orderBy() en la consulta de Firestore porque
   * ese campo es un string y requeriría crear un índice compuesto manualmente
   * en la consola de Firebase. Si falta el índice, onSnapshot lanza un error
   * silencioso y los comentarios nunca se muestran.
   * Solución: traemos todos los docs sin orden y los ordenamos en el cliente.
   */
  seleccionarJoya(joya: Joya): void {
    this.joyaSeleccionada = joya;
    this.comentarios      = [];  // limpia la lista anterior
    this.nuevoComentario  = '';  // limpia el input

    // Cancelar suscripción anterior antes de abrir una nueva
    if (this.cancelarSuscripcion) {
      this.cancelarSuscripcion();
    }

    const db = getFirestore(firebaseApp);

    // Consulta SIMPLE: solo filtramos por joyaId (sin orderBy → sin índice necesario).
    // El orden lo aplicamos nosotros en el callback del cliente.
    const consulta = query(
      collection(db, 'comentarios'),
      where('joyaId', '==', joya.id)
    );

    // onSnapshot mantiene una conexión abierta y dispara el callback
    // cada vez que Firestore detecta un cambio → los comentarios se actualizan
    // en tiempo real Y también al cargar la página (primera ejecución).
    this.cancelarSuscripcion = onSnapshot(
      consulta,
      (snapshot) => {
        // Mapeamos los documentos y ordenamos por fecha en el cliente
        this.comentarios = snapshot.docs
          .map((doc) => ({
            usuario: doc.data()['usuario'] as string,
            texto:   doc.data()['texto']   as string,
            fecha:   doc.data()['fecha']   as string,
          }))
          // Ordenamos del más antiguo al más nuevo comparando los strings de fecha
          .sort((a, b) => a.fecha.localeCompare(b.fecha));
      },
      (error) => {
        // Si Firestore rechaza la consulta (p. ej. reglas de seguridad),
        // mostramos la lista vacía en lugar de quedarnos sin respuesta.
        console.error('Error en onSnapshot de comentarios:', error.message);
        this.comentarios = [];
      }
    );
  }

  /**
   * Guarda un nuevo comentario en Firestore.
   * addDoc() crea un documento nuevo con ID auto-generado.
   * La lista se actualiza sola vía onSnapshot — no hace falta recargar.
   */
  async enviarComentario(): Promise<void> {
    if (!this.nuevoComentario.trim() || !this.joyaSeleccionada) return;

    const nombreUsuario = this.usuarioLogueado?.nombre ?? 'Anónimo';
    const db = getFirestore(firebaseApp);

    await addDoc(collection(db, 'comentarios'), {
      joyaId:  this.joyaSeleccionada.id,
      usuario: nombreUsuario,
      texto:   this.nuevoComentario.trim(),
      fecha:   new Date().toLocaleString('es-AR'), // string legible para ordenar
    });

    // Limpiamos el input — onSnapshot actualiza la lista automáticamente
    this.nuevoComentario = '';
  }

  // ── CSV ───────────────────────────────────────────────────────────────────

  descargarCatalogoCSV(): void {
    const encabezados = 'Nombre,Categoria,Precio,Stock';
    const filas = this.listaJoyas.map(
      (j) => `"${j.nombre}","${j.categoria}",${j.precio},${j.stock}`
    );
    const contenidoCSV = [encabezados, ...filas].join('\n');
    const blob         = new Blob([contenidoCSV], { type: 'text/csv;charset=utf-8;' });
    const urlTemporal  = URL.createObjectURL(blob);
    const enlace       = document.createElement('a');
    enlace.href        = urlTemporal;
    enlace.download    = 'catalogo_meraki.csv';
    enlace.click();
    URL.revokeObjectURL(urlTemporal);
  }
}
