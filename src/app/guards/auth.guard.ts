import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map, take } from 'rxjs/operators';
import { Observable } from 'rxjs';

export const canActivateAuth: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService)

  return authService.obtenerEstadoAutenticacion().pipe(
    take(1),  // Tomar solo el primer valor del observable
    map(usuario => {
      if (usuario) {
        return true  // Si el usuario está autenticado, permitir el acceso
      } else {
        return false  // Si no está autenticado, denegar el acceso
      }
    })
  );
};
