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
      email: [{ value: '' }], 
      rol: [''] 
    });
  }

  editarUsuario(usuario: any): void {
    this.usuarioSeleccionado = usuario;
    this.formularioEdicion.patchValue(usuario); // Rellena el formulario con los datos del usuario
  }

  guardarCambios(): void {
    if (this.formularioEdicion.valid && this.usuarioSeleccionado) {
      const { nombre, telefono, cedula, rol } = this.formularioEdicion.value;
      const id = this.usuarioSeleccionado.id; // Se usa `id` en lugar de `uid`

      this.userService.actualizarUsuario(id, { nombre, telefono, cedula, rol }).subscribe(() => {
        this.usuarioSeleccionado = null;
        this.cargarUsuarios(); // Recarga la lista de usuarios
      });
    }
  }

  cancelarEdicion(): void {
    this.usuarioSeleccionado = null;
  }
}
