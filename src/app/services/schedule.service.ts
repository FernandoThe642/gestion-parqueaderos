import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private apiUrl = 'http://localhost:8080/parqueaderos/rs/horarios'; 

  constructor(private http: HttpClient) {}

  obtenerHorarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/obtenerTodos`);
  }

  definirHorario(horario: any): Observable<any> {
    return this.http.post(`${this.apiUrl}`, horario);
  }
  

  actualizarHorario(horario: any): Observable<any> {
    return this.http.put(`${this.apiUrl}`, horario);
  }

  obtenerHorariosPorDia(dia: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/dia/${dia}`);
  }


  obtenerHorariosPorEspacio(espacioId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/espacio/${espacioId}`);
  }


}
