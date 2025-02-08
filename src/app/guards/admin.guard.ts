import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';

export const canActivateAdmin: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  return of(authService.tokenValido()).pipe(
    map(isAuthenticated => {
      if (isAuthenticated) {
        const token = authService.obtenerToken();
        const decodedToken = token ? JSON.parse(atob(token.split('.')[1])) : null;
        if (decodedToken && decodedToken.rol === 'admin') {
          return true;
        } else {
          router.navigate(['/home']);
          return false;
        }
      } else {
        router.navigate(['/login']);
        return false;
      }
    })
  );
};
