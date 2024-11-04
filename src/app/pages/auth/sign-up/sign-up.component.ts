import { Component } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.scss']  // Cambiado de styleUrl a styleUrls
})
export class SignUpComponent {
  email: string = ''
  password: string = ''
  nombre: string = ''
  telefono: string = ''

  registrado: boolean = false

  constructor(private authService: AuthService, private router: Router) {}

  registrar() {
    this.authService.registrarConCorreoYContrasena(this.email, this.password).subscribe(
      (usuarioCredential) => {
        if (usuarioCredential && usuarioCredential.user) {
          const uid = usuarioCredential.user.uid;
          console.log('Usuario registrado con UID:', uid);
          
          if (uid) {
            // Generar URL del avatar para el usuario
            const fotoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.nombre)}&background=44444&color=FFFFFF&size=128`;
            
            // Crear el perfil con los campos necesarios
            const perfil = {
              nombre: this.nombre,
              telefono: this.telefono,
              email: this.email,
              fotoURL: fotoURL,
              role: 'user'
            };
            
            // Guardar el perfil en Firestore
            this.authService.guardarPerfil(uid, perfil).subscribe(
              () => {
                console.log('Perfil guardado exitosamente en Firestore');
                this.router.navigate(['/home']);
              },
              (error) => {
                console.error('Error al guardar el perfil:', error);
              }
            );
          }
        }
      },
      (error) => {
        console.error('Error al registrar:', error);
      }
    );
  }
  
  registrarPerfil(uid: string) {
    const perfil = {
      nombre: this.nombre,
      telefono: this.telefono
    }

    this.authService.guardarPerfil(uid, perfil).subscribe(
      (respuesta) => {
        console.log('Perfil guardado:', respuesta)
        this.registrado = true
        this.router.navigate(['/login'])  // Redirigir al usuario a la página de login
      },
      (error) => {
        console.error('Error al guardar el perfil:', error)
      }
    );
  }
}
