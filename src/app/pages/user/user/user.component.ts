import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit {
  usuarioForm!: FormGroup;
  fotoPerfilUrl: string = ''; // Solo para mostrar la foto de perfil (no editable)
  cargando: boolean = false;
  mensaje: string = '';
  usuarioId: number | null = null; // Guardar el ID del usuario

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarUsuario();
  }

  inicializarFormulario(): void {
    this.usuarioForm = this.fb.group({
      email: [{ value: '', disabled: true }], // El email no se puede editar
      nombre: [''],
      telefono: [''],
      cedula: [''] 
    });
  }

  cargarUsuario(): void {
    this.cargando = true;
    
    // Obtener el token
    const token = localStorage.getItem('token');
    if (!token) {
      this.mensaje = 'Error: No se encontró el token de autenticación';
      this.cargando = false;
      return;
    }
  
    // Extraer el email del token JWT
    const payload = JSON.parse(atob(token.split('.')[1]));
    const email = payload.sub; // Asegúrate de que el backend pone el email en "sub"
  
    if (!email) {
      this.mensaje = 'Error: No se encontró el email en el token';
      this.cargando = false;
      return;
    }
  
    this.userService.obtenerUsuario(email).subscribe({
      next: (usuario) => {
        if (usuario) {
          this.usuarioForm.patchValue({
            email: usuario.email,
            nombre: usuario.nombre,
            telefono: usuario.telefono || '',
            cedula: usuario.cedula || ''
          });
          this.fotoPerfilUrl = usuario.fotoPerfil || '';
          this.usuarioId = usuario.id;
        }
        this.cargando = false;
      },
      error: () => {
        this.mensaje = 'Error al cargar usuario';
        this.cargando = false;
      }
    });
  }
  

  actualizarUsuario(): void {
    if (this.usuarioForm.valid && this.usuarioId !== null) {
      const { nombre, telefono, cedula } = this.usuarioForm.value;

      this.userService.actualizarUsuario(this.usuarioId, { nombre, telefono, cedula }).subscribe({
        next: () => {
          this.mensaje = 'Usuario actualizado correctamente';
        },
        error: () => {
          this.mensaje = 'Error al actualizar usuario';
        }
      });
    }
  }

  
}
