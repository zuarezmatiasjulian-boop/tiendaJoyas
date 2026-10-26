import { Directive, ElementRef, Renderer2, HostListener } from '@angular/core';

@Directive({
  selector: '[appHoverColor]', // Se aplica en el HTML como atributo
  standalone: true,
})
export class HoverColorDirective {

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  /**
   * @HostListener escucha eventos del DOM sobre el elemento.
   * 'mouseenter' se dispara cuando el cursor ENTRA al elemento.
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    // Aplicamos fondo dorado suave y sombra ligera al pasar el mouse
    this.renderer.setStyle(this.el.nativeElement, 'backgroundColor', '#fdf6e3');
    this.renderer.setStyle(this.el.nativeElement, 'boxShadow', '0 6px 24px rgba(201, 168, 76, 0.30)');
    this.renderer.setStyle(this.el.nativeElement, 'transition', 'background-color 0.3s ease, box-shadow 0.3s ease');
  }

  /**
   * 'mouseleave' se dispara cuando el cursor SALE del elemento.
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    // Quitamos los estilos agregados para volver al estado original
    this.renderer.removeStyle(this.el.nativeElement, 'backgroundColor');
    this.renderer.removeStyle(this.el.nativeElement, 'boxShadow');
  }
}