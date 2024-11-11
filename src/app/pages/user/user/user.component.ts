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
  perfilForm!: FormGroup;
  fotoPerfilUrl: string = '';
  cargando: boolean = false;
  mensaje: string = '';
  editandoFoto: boolean = false; // Controla la visibilidad del campo para subir fotos

  constructor(private userService: UserService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.inicializarFormulario();
    this.cargarPerfil();
  }

  inicializarFormulario(): void {
    this.perfilForm = this.fb.group({
      email: [{ value: '', disabled: true }], // Ahora email aparece primero
      nombre: [''],
      telefono: [''],
      cedula: [''] 
    });
  }

  cargarPerfil(): void {
    this.cargando = true;
    this.userService.obtenerPerfil().subscribe((perfil) => {
      if (perfil) {
        this.perfilForm.patchValue({
          email: perfil.email,
          nombre: perfil.nombre,
          telefono: perfil.telefono || '',
          cedula: perfil.cedula || ''
        });
        this.fotoPerfilUrl = perfil.fotoPerfil || perfil.fotoURL || ''; // Prioriza fotoPerfil, luego fotoURL
      }
      this.cargando = false;
    });
  }

  actualizarPerfil(): void {
    if (this.perfilForm.valid) {
      const { nombre, telefono, cedula } = this.perfilForm.value;
      this.userService.actualizarPerfil({ nombre, telefono, cedula }).subscribe(() => {
        this.mensaje = 'Perfil actualizado exitosamente';
      });
    }
  }

  editarFoto(): void {
    if(this.editandoFoto==true){
    this.editandoFoto = false; 
    }else{
      this.editandoFoto = true; 
    }
  }

  subirFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const archivo = input.files[0];
      this.cargando = true;
      this.userService.subirFotoPerfil(archivo).subscribe({
        next: () => {
          this.fotoPerfilUrl = ''; // Limpia la URL momentáneamente
          this.mensaje = 'Foto de perfil actualizada';
          this.cargarPerfil(); // Recarga el perfil para obtener la nueva foto
          this.cargando = false;
          this.editandoFoto = false; // Salir del modo de edición
        },
        error: () => {
          this.mensaje = 'Error al subir la foto';
          this.cargando = false;
          this.editandoFoto = false;
        }
      });
    }
  }

  
}
