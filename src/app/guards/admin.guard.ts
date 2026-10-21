import { Injectable } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../servicios/auth.service';

// ─────────────────────────────────────────────────────────────────────────────
// AdminGuard — Protege rutas exclusivas de administrador
//
// ¿Cómo funciona?
//   Angular llama a esta función ANTES de cargar el componente de la ruta.
//   Si devuelve `true`  → la navegación continúa normalmente.
//   Si devuelve `false` → la navegación se cancela; redirige a /principal.
//
// Uso en app.routes.ts:
//   { path: 'publicar-producto', component: PublicarProducto, canActivate: [adminGuard] }
// ─────────────────────────────────────────────────────────────────────────────
export const adminGuard: CanActivateFn = () => {

  // Inyectamos los servicios necesarios usando inject()
  // (la forma moderna en Angular 15+ con guards funcionales)
  const authService = inject(AuthService);
  const router      = inject(Router);

  // Obtenemos el usuario que tiene sesión activa actualmente
  const usuarioActual = authService.getUsuarioActual();

  // ── Verificación ───────────────────────────────────────────────────────────
  // Condición para pasar: el usuario existe Y su rol es exactamente 'administrador'
  if (usuarioActual && usuarioActual.rol === 'administrador') {
    // ✅ Es administrador → dejamos pasar
    return true;
  }

  // ❌ No es administrador (o no hay sesión) → redirigimos al catálogo principal
  // `createUrlTree` es la forma correcta de redirigir dentro de un guard funcional
  return router.createUrlTree(['/principal']);
};
