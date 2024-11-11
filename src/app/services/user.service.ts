import { Injectable } from '@angular/core';
import { Firestore, doc, updateDoc, getDoc, collection, collectionData } from '@angular/fire/firestore';
import { Auth } from '@angular/fire/auth';
import { Observable, from, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private firestore: Firestore, private auth: Auth) {}

  obtenerPerfil(): Observable<any> {
    const usuario = this.auth.currentUser;
    if (usuario) {
      const userDocRef = doc(this.firestore, `usuarios/${usuario.uid}`);
      return from(getDoc(userDocRef)).pipe(
        switchMap((docSnapshot) => {
          if (docSnapshot.exists()) {
            return of(docSnapshot.data());
          } else {
            return of(null);
          }
        })
      );
    } else {
      return of(null);
    }
  }

  actualizarPerfil(perfil: any): Observable<void> {
    const usuario = this.auth.currentUser;
    if (usuario) {
      const userDocRef = doc(this.firestore, `usuarios/${usuario.uid}`);
      return from(updateDoc(userDocRef, perfil));
    } else {
      return of(); // No hace nada si no hay usuario
    }
  }
  

  leerArchivoComoBase64(archivo: File): Observable<string> {
    const lector = new FileReader();
    return new Observable<string>((observer) => {
      lector.onload = () => observer.next(lector.result as string);
      lector.onerror = (error) => observer.error(error);
      lector.readAsDataURL(archivo); // Convierte a Base64
    });
  }

  subirFotoPerfil(archivo: File): Observable<void> {
    return this.leerArchivoComoBase64(archivo).pipe(
      switchMap((base64) => {
        const usuario = this.auth.currentUser;
        if (usuario) {
          const userDocRef = doc(this.firestore, `usuarios/${usuario.uid}`);
          return from(updateDoc(userDocRef, { fotoPerfil: base64 }));
        } else {
          return of();
        }
      })
    );
  }

  //Administrador:
    // Obtener lista de usuarios
    obtenerUsuarios(): Observable<any[]> {
      const usuariosRef = collection(this.firestore, 'usuarios');
      return collectionData(usuariosRef, { idField: 'uid' }); // Incluye el UID como idField
    }

      // Actualizar un usuario específico
  actualizarUsuario(uid: string, datos: any): Observable<void> {
    const usuarioDocRef = doc(this.firestore, `usuarios/${uid}`);
    return new Observable<void>((observer) => {
      updateDoc(usuarioDocRef, datos)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => observer.error(error));
    });
  }
}
