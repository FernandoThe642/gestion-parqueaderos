import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, getDoc, collection, collectionData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'http://localhost:8080/parqueaderos/rs/usuarios'; 

  constructor(private http: HttpClient) {}

  // Obtener usuario autenticado
  obtenerUsuario(email: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuario/${email}`);
  }

  obtenerUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/obtenerTodos`);
  }


  actualizarUsuario(id: number, usuario: { nombre: string, telefono: string, cedula: string, rol?: string }): Observable<any> {
    return this.http.put(`${this.apiUrl}/actualizar/${id}`, usuario);
  }
  
}
