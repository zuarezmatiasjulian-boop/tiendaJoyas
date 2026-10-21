import { Pipe, PipeTransform } from '@angular/core';
import { Joya } from '../clases/joya';

// El decorador @Pipe le da un nombre al pipe para usarlo en el HTML
@Pipe({
  name: 'filtroJoya',  // se usa en el HTML como: listaJoyas | filtroJoya: textoBusqueda
  standalone: true,    // standalone: no necesita declararse en ningún módulo
})
export class FiltroJoyaPipe implements PipeTransform {

  /**
   * transform() es el método principal del Pipe.
   * Angular lo llama automáticamente cada vez que cambia la lista o el término.
   *
   * @param joyas      - La lista completa de joyas (viene del Padre)
   * @param termino    - El texto que escribe el usuario en el input
   * @returns          - La lista filtrada (o la lista completa si no hay término)
   */
  transform(joyas: Joya[], termino: string): Joya[] {

    // Si la lista está vacía o no hay término de búsqueda, devuelve todo sin cambios
    if (!joyas || !termino || termino.trim() === '') {
      return joyas;
    }

    // Convierte el término a minúsculas para comparar sin importar mayúsculas
    const texto = termino.trim().toLowerCase();

    // Filtra: mantiene solo las joyas cuyo nombre o categoría incluyan el término
    return joyas.filter(joya =>
      joya.nombre.toLowerCase().includes(texto) ||
      joya.categoria.toLowerCase().includes(texto)
    );
  }
}
