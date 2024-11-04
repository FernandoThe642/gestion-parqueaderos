import { Injectable } from '@angular/core';
import { Auth, GoogleAuthProvider, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, signInWithPopup, authState } from '@angular/fire/auth';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth, 
    private firestore: Firestore 
  ) {}

    // Observador para saber si el usuario está autenticado
    obtenerEstadoAutenticacion(): Observable<any> {
      return authState(this.auth);
    }

  // Método para registrar al usuario con correo y contraseña
  registrarConCorreoYContrasena(email: string, password: string): Observable<any> {
    return new Observable((observer) => {
      createUserWithEmailAndPassword(this.auth, email, password)
        .then((usuarioCredential) => {
          observer.next(usuarioCredential)
          observer.complete()
        })
        .catch((error) => {
          observer.error(error)
        })
    })
  }

  // Método para iniciar sesión con correo y contraseña
  iniciarSesionConCorreoYContrasena(email: string, password: string): Observable<any> {
    return new Observable((observer) => {
      signInWithEmailAndPassword(this.auth, email, password)
        .then((usuarioCredential) => {
          observer.next(usuarioCredential)
          observer.complete()
        })
        .catch((error) => {
          observer.error(error)
        })
    })
  }

  // Método para iniciar sesión con Google
  iniciarSesionConGoogle(): Observable<any> {
    return new Observable((observer) => {
      const provider = new GoogleAuthProvider();
      signInWithPopup(this.auth, provider)
        .then(async (usuarioCredential) => {
          const user = usuarioCredential.user;
          if (user) {
            const uid = user.uid;
            const userDocRef = doc(this.firestore, 'usuarios', uid);
  
            try {
              const userDoc = await getDoc(userDocRef);
              if (!userDoc.exists()) {
                // Guardar el perfil básico si es un nuevo usuario
                const perfil = {
                  nombre: user.displayName,
                  email: user.email,
                  fotoURL: user.photoURL,
                  role: 'user'  // Asignar el rol predeterminado "user"
                };
                await setDoc(userDocRef, perfil);
                console.log('Perfil creado para usuario de Google con UID:', uid);
              } else {
                console.log('Usuario de Google ya tiene perfil en Firestore.');
              }
  
              observer.next(usuarioCredential);
              observer.complete();
            } catch (error) {
              console.error('Error al verificar o guardar el perfil en Firestore:', error);
              observer.error(error);
            }
          }
        })
        .catch((error) => {
          console.error('Error al iniciar sesión con Google:', error);
          observer.error(error);
        });
    });
  }
  

  // Método para guardar el perfil del usuario en Firestore
  guardarPerfil(uid: string, perfil: any): Observable<any> {
    return new Observable((observer) => {
      const userDocRef = doc(this.firestore, 'usuarios', uid);
      setDoc(userDocRef, perfil)
        .then(() => {
          console.log('Perfil guardado en Firestore para UID:', uid);
          observer.next('Perfil guardado');
          observer.complete();
        })
        .catch((error) => {
          console.error('Error al guardar el perfil en Firestore:', error);
          observer.error(error);
        });
    });
  }
  
  
  // Método para cerrar sesión del usuario
  cerrarSesion(): Observable<any> {
    return new Observable((observer) => {
      signOut(this.auth)
        .then(() => {
          observer.next('Sesión cerrada')
          observer.complete()
        })
        .catch((error) => {
          observer.error(error)
        })
    })
  }
}
