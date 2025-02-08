import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReserveService {
  private apiUrl = 'http://localhost:8080/parqueaderos/rs/reservas';

  constructor(private http: HttpClient) {}


  obtenerReservas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  crearReserva(reserva: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, reserva);
  }


  actualizarReserva(reserva: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, reserva);
  }


  eliminarReserva(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }


  obtenerReservasActivas(fechaActual: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activas?fechaActual=${fechaActual}`);
  }


  obtenerReservasPorUsuario(usuarioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/usuario/${usuarioId}`);
  }


  obtenerReservasMensuales(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/mensuales`);
  }
}
