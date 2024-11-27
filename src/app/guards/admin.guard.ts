import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { take, switchMap } from 'rxjs/operators';
import { Firestore, doc, getDoc } from '@angular/fire/firestore';

export const canActivateAdmin: CanActivateFn = (): Observable<boolean> => {
  const authService = inject(AuthService)
  const firestore = inject(Firestore)
  const router = inject(Router)

  return authService.obtenerEstadoAutenticacion().pipe(
    take(1),
    switchMap(async (usuario) => {
      if (usuario) {
        // Verificar el rol en Firestore
        const userDocRef = doc(firestore, `usuarios/${usuario.uid}`)
        const docSnapshot = await getDoc(userDocRef)

        if (docSnapshot.exists() && docSnapshot.data()?.["role"] === 'admin') {
          return true  // El usuario es administrador, permitir acceso
        } else {
          router.navigate(['/home'])  // Redirigir si no es administrador
          return false
        }
      } else {
        router.navigate(['/login'])  // Redirigir al login si no está autenticado
        return false
      }
    })
  )
}
