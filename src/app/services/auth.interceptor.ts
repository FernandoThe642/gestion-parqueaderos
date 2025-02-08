import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { Observable } from 'rxjs';

export const AuthInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> => {
    const authService = inject(AuthService);
    const token = authService.obtenerToken();

    if (token) {
    const clonedRequest = req.clone({
        setHeaders: {
        Authorization: `Bearer ${token}`
        }
    });
    return next(clonedRequest);
    }

    return next(req);
};
