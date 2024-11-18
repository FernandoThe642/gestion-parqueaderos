import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SpaceService {
  private espaciosRef = collection(this.firestore, 'espacios')

  constructor(private firestore: Firestore) {}

  // Obtener la lista de espacios
  obtenerEspacios(): Observable<any[]> {
    return collectionData(this.espaciosRef, { idField: 'id' }) 
  }

  // Crear un nuevo espacio
  crearEspacio(datos: any): Observable<any> {
    return new Observable((observer) => {
      addDoc(this.espaciosRef, datos)
        .then((docRef) => {
          observer.next({ ...datos, id: docRef.id })
          observer.complete()
        })
        .catch((error) => observer.error(error))
    })
  }

  // Actualizar un espacio existente
  actualizarEspacio(id: string, datos: any): Observable<void> {
    const espacioDocRef = doc(this.firestore, `espacios/${id}`)
    return new Observable((observer) => {
      updateDoc(espacioDocRef, datos)
        .then(() => {
          observer.next()
          observer.complete()
        })
        .catch((error) => observer.error(error))
    })
  }

  // Eliminar un espacio
  eliminarEspacio(id: string): Observable<void> {
    const espacioDocRef = doc(this.firestore, `espacios/${id}`)
    return new Observable((observer) => {
      deleteDoc(espacioDocRef)
        .then(() => {
          observer.next()
          observer.complete()
        })
        .catch((error) => observer.error(error))
    })
  }
}
