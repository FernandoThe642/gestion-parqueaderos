import { Injectable } from '@angular/core';
import { Firestore, collection, doc, setDoc, updateDoc, collectionData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ScheduleService {
  private horariosRef = collection(this.firestore, 'horarios'); // Referencia a la colección "horarios"

  constructor(private firestore: Firestore) {}

  // Obtener lista de horarios
  obtenerHorarios(): Observable<any[]> {
    return collectionData(this.horariosRef, { idField: 'id' }); // Incluye el ID como campo "id"
  }

  // Definir un horario
  definirHorario(dia: string, horario: any): Observable<void> {
    const horarioDocRef = doc(this.firestore, `horarios/${dia}`);
    return new Observable((observer) => {
      setDoc(horarioDocRef, horario, { merge: true })
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }

  // Actualizar un horario existente
  actualizarHorario(dia: string, horario: any): Observable<void> {
    const horarioDocRef = doc(this.firestore, `horarios/${dia}`);
    return new Observable((observer) => {
      updateDoc(horarioDocRef, horario)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }
}
