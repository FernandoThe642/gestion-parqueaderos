import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ContractService {
  private contratosRef = collection(this.firestore, 'contratos'); // Referencia a la colección "contratos"

  constructor(private firestore: Firestore) {}

  // Obtener lista de contratos
  obtenerContratos(): Observable<any[]> {
    return collectionData(this.contratosRef, { idField: 'id' }); // Incluye el ID como campo "id"
  }

  // Crear un nuevo contrato
  crearContrato(datos: any): Observable<any> {
    return new Observable((observer) => {
      addDoc(this.contratosRef, datos)
        .then((docRef) => {
          observer.next({ ...datos, id: docRef.id });
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  // Actualizar un contrato existente
  actualizarContrato(id: string, datos: any): Observable<void> {
    const contratoDocRef = doc(this.firestore, `contratos/${id}`);
    return new Observable((observer) => {
      updateDoc(contratoDocRef, datos)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  // Eliminar un contrato
  eliminarContrato(id: string): Observable<void> {
    const contratoDocRef = doc(this.firestore, `contratos/${id}`);
    return new Observable((observer) => {
      deleteDoc(contratoDocRef)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }
}
