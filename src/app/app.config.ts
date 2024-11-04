import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';  
import { environment } from '../environments/environment';
import { getDatabase, provideDatabase } from '@angular/fire/database'; 

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), 
    provideFirebaseApp(() => initializeApp(environment.firebase)), 
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()), provideFirebaseApp(() => initializeApp({"projectId":"gestion-parqueaderos","appId":"1:707113644606:web:67a5b8313b3fbbb7e6576f","storageBucket":"gestion-parqueaderos.firebasestorage.app","apiKey":"AIzaSyDOjFa41i9A7GR6_AFWLvGrY9o9pkCuzzc","authDomain":"gestion-parqueaderos.firebaseapp.com","messagingSenderId":"707113644606"})), provideFirestore(() => getFirestore()), provideDatabase(() => getDatabase())
  ]
  }
