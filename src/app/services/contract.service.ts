import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ContractService {
  private apiUrl = 'http://localhost:8080/parqueaderos/rs/contratos';

  constructor(private http: HttpClient) {}

  obtenerContratos(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  crearContrato(contrato: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, contrato);
  }

  actualizarContrato(contrato: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, contrato);
  }


  eliminarContrato(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  obtenerContratosActivos(fechaInicio: string, fechaFin: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/activos?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}`);
  }


obtenerContratosPorUsuario(idUsuario: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/usuario/${idUsuario}`);
}

}
