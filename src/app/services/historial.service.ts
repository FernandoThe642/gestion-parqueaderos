import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class HistorialService {
  private apiUrl = 'http://localhost:8080/parqueaderos/rs/historial'; // URL base del backend en Java EE

  constructor(private http: HttpClient) {}

  // Obtener lista de todos los registros de historial
  obtenerHistorial(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  // Registrar un nuevo historial de uso
  registrarHistorial(historial: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, historial);
  }

  // Eliminar un historial por ID
  eliminarHistorial(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  // Obtener historial por espacio de parqueadero
  obtenerHistorialPorEspacio(espacioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/espacio/${espacioId}`);
  }

  // Obtener historial por rango de fechas
  obtenerHistorialPorFechas(fechaInicio: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/fechas?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }

  // Obtener historial por placa de vehículo
  obtenerHistorialPorPlaca(placa: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/placa/${placa}`);
  }
}
