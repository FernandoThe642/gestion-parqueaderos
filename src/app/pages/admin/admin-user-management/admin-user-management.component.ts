import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-user-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-user-management.component.html',
  styleUrl: './admin-user-management.component.scss'
})
export class AdminUserManagementComponent implements OnInit {
  usuarios: any[] = []; // Lista de usuarios
  formularioEdicion!: FormGroup; // Formulario para editar un usuario
  usuarioSeleccionado: any = null; // Usuario actualmente en edición
  cargando: boolean = true;

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cargarUsuarios();
    this.inicializarFormulario();
  }

  cargarUsuarios(): void {
    this.userService.obtenerUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios;
      this.cargando = false;
    });
  }

  inicializarFormulario(): void {
    this.formularioEdicion = this.fb.group({
      nombre: [''],
      telefono: [''],
      cedula: [''],
      email: [{ value: '', disabled: true }] // El email no es editable
    });
  }

  editarUsuario(usuario: any): void {
    this.usuarioSeleccionado = usuario;
    this.formularioEdicion.patchValue(usuario); // Rellena el formulario con los datos del usuario
  }

  guardarCambios(): void {
    if (this.formularioEdicion.valid && this.usuarioSeleccionado) {
      const { nombre, telefono, cedula } = this.formularioEdicion.value;
      const uid = this.usuarioSeleccionado.uid;

      this.userService.actualizarUsuario(uid, { nombre, telefono, cedula }).subscribe(() => {
        this.usuarioSeleccionado = null;
        this.cargarUsuarios(); // Recarga la lista de usuarios
      });
    }
  }

  cancelarEdicion(): void {
    this.usuarioSeleccionado = null;
  }
  
  subirFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const archivo = input.files[0];
      const uid = this.usuarioSeleccionado.uid;
  
      this.userService.subirFotoPerfil(archivo).subscribe({
        next: (fotoURL) => {
          this.usuarioSeleccionado.fotoPerfil = fotoURL;
          this.formularioEdicion.patchValue({ fotoPerfil: fotoURL });
          this.userService.actualizarUsuario(uid, { fotoPerfil: fotoURL }).subscribe(() => {
            console.log('Foto de perfil actualizada.');
          });
        },
        error: () => {
          console.error('Error al subir la foto');
        }
      });
    }
  }
  
}
