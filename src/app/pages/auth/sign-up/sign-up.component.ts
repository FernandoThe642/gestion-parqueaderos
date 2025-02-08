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
  styleUrls: ['./sign-up.component.scss']
})
export class SignUpComponent {
  usuario = {
    nombre: '',
    telefono: '',
    email: '',
    cedula: '',
    contrasenia: '',
    fotoPerfil: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  registrar() {
    this.usuario.fotoPerfil = `https://ui-avatars.com/api/?name=${encodeURIComponent(this.usuario.nombre)}&background=44444&color=FFFFFF&size=128`;
  
    this.authService.registrarUsuario(this.usuario).subscribe({
      next: (response) => {
        console.log('Usuario registrado con éxito:', response);
        this.router.navigate(['/home']);
      },
      error: (error) => {
        console.error('Error al registrar:', error);
        alert('Error al registrarse. Verifique los datos e intente nuevamente.');
      }
    });
  }

  irALogin() {
    this.router.navigate(['/login']);
  }
}
