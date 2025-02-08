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
  contrasenia: string = ''  

  constructor(private authService: AuthService, private router: Router) {}

  iniciarSesion() {
    this.authService.iniciarSesionConCorreoYContrasena(this.email, this.contrasenia).subscribe({
      next: (response) => {
        console.log('Usuario autenticado:', response) 
        console.log('UInicio de sesión exitoso')  
        this.router.navigate(['/home']) 
      },
      error: (error) => {
        console.error('Error al iniciar sesión:', error) 
        if (error.status === 401) {
          alert('Credenciales incorrectas. Verifique su email y contraseña.') 
        } else {
          alert('Error en el servidor. Intente más tarde.') 
        }
      }
    }) 
  }

  cerrarSesion() {
    this.authService.cerrarSesion() 
    console.log('Sesión cerrada') 
    
    this.router.navigate(['/login']) 
  }

  registrarse() {
    this.router.navigate(['/signup']) 
  }
}
