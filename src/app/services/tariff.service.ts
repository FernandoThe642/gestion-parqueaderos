import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TariffService {
  private apiUrl = 'http://localhost:8080/parqueaderos/rs/tarifas'; 

  constructor(private http: HttpClient) {}

  obtenerTarifas(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/listar`);
  }

  crearTarifa(tarifa: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, tarifa);
  }
  
  
  actualizarTarifa(id: string, tarifa: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, tarifa);
  }
  
  

  eliminarTarifa(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  buscarPorTiempo(tiempo: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/tiempo/${tiempo}`);
  }


  listarPorRangoDePrecio(minPrecio: number, maxPrecio: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/rango-precio?min=${minPrecio}&max=${maxPrecio}`);
  }
}
