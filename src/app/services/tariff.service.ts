import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TariffService {

  private tarifasRef = collection(this.firestore, 'tarifas'); // Referencia a la colección "tarifas"

  constructor(private firestore: Firestore) {}

  // Obtener lista de tarifas
  obtenerTarifas(): Observable<any[]> {
    return collectionData(this.tarifasRef, { idField: 'id' }); // Incluye el ID como campo "id"
  }

  // Crear una nueva tarifa
  crearTarifa(datos: any): Observable<any> {
    return new Observable((observer) => {
      addDoc(this.tarifasRef, datos)
        .then((docRef) => {
          observer.next({ ...datos, id: docRef.id });
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  // Actualizar una tarifa existente
  actualizarTarifa(id: string, datos: any): Observable<void> {
    const tarifaDocRef = doc(this.firestore, `tarifas/${id}`);
    return new Observable((observer) => {
      updateDoc(tarifaDocRef, datos)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  // Eliminar una tarifa
  eliminarTarifa(id: string): Observable<void> {
    const tarifaDocRef = doc(this.firestore, `tarifas/${id}`);
    return new Observable((observer) => {
      deleteDoc(tarifaDocRef)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  
}

