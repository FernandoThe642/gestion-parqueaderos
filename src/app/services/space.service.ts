import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpaceService {
  private apiUrl = 'http://localhost:8080/parqueaderos/rs/espacios'; 

  constructor(private http: HttpClient) {}

  obtenerEspacios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  crearEspacio(espacio: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, espacio);
  }

  actualizarEspacio(espacio: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, espacio);
  }

  eliminarEspacio(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
  // Obtener la lista de espacios disponibles
  obtenerEspaciosDisponibles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/disponibles`);
  }

  // Obtener la lista de espacios reservados
  obtenerEspaciosReservados(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/reservados`);
  }

  // Obtener espacios por tarifa
  obtenerEspaciosPorTarifa(tarifaId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/tarifa/${tarifaId}`);
  }
}
