import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

export const canActivateAuth: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService);
  
  return of(authService.tokenValido()).pipe(
    map(isAuthenticated => {
      return isAuthenticated;
    })
  );
};
