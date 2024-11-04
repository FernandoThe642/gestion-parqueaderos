import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-log-in',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent {
  email: string = ''
  password: string = ''

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion() {
    this.authService.iniciarSesionConCorreoYContrasena(this.email, this.password).subscribe(
      (usuarioCredential) => {
        console.log('Usuario ingresado:', usuarioCredential)
        this.router.navigate(['/home'])
      },
      (error) => {
        console.error('Error al iniciar sesión:', error)
        alert('Error al iniciar sesión. Verifique sus credenciales.')
      }
    )
  }

  iniciarSesionConGoogle() {
    this.authService.iniciarSesionConGoogle().subscribe(
      (usuarioCredential) => {
        console.log('Usuario ingresado con Google:', usuarioCredential)
        this.router.navigate(['/home'])
      },
      (error) => {
        console.error('Error al iniciar sesión con Google:', error)
        alert('Error al iniciar sesión con Google.')
      }
    )
  }

  cerrarSesion() {
    this.authService.cerrarSesion().subscribe(
      () => {
        console.log('Sesión cerrada')
        this.router.navigate(['/login'])
      },
      (error) => {
        console.error('Error al cerrar sesión:', error)
      }
    )
  }

  registrarse() {
    this.router.navigate(['/signup'])
  }
}
