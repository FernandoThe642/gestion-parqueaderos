import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/parqueaderos/rs/usuarios'; 
  private usuarioAutenticadoSubject = new BehaviorSubject<boolean>(this.estaAutenticado());

  private usuarioAutenticado = new BehaviorSubject<boolean>(this.tokenValido());


  constructor(private http: HttpClient) {}

  usuarioAutenticado$ = this.usuarioAutenticadoSubject.asObservable();

  iniciarSesionConCorreoYContrasena(email: string, contrasenia: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, contrasenia }).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.usuarioAutenticadoSubject.next(true);
        }
      })
    );
  }
  

  registrarUsuario(usuario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, usuario).pipe(
      tap((response: any) => {
        if (response.token) {
          localStorage.setItem('token', response.token);
          this.usuarioAutenticadoSubject.next(true);
        }
      })
    );
  }

  obtenerRolUsuario(): string | null {
    const token = this.obtenerToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1])); 
      return payload.rol || null;
    }
    return null;
  }

  cerrarSesion(): void {
    localStorage.removeItem('token');
    this.usuarioAutenticadoSubject.next(false);
  }
  

  estaAutenticado(): boolean {
    return !!this.obtenerToken();
  }

  obtenerToken(): string | null {
    return localStorage.getItem('token');
  }
    tokenValido(): boolean {
    const token = this.obtenerToken();
    return token !== null; 
  }


  obtenerEstadoAutenticacion(): Observable<boolean> {
    return this.usuarioAutenticado.asObservable();
  }
}
