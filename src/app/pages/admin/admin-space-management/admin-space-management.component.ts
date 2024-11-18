import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SpaceService } from '../../../services/space.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-space-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-space-management.component.html',
  styleUrl: './admin-space-management.component.scss'
})
export class AdminSpaceManagementComponent implements OnInit {

  espacios: any[] = []; // Lista de espacios
  formularioEspacio!: FormGroup; // Formulario para crear/editar espacios
  espacioSeleccionado: any = null; // Espacio en edición
  cargando: boolean = true;

  constructor(private spaceService: SpaceService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cargarEspacios();
    this.inicializarFormulario();
  }

  cargarEspacios(): void {
    this.spaceService.obtenerEspacios().subscribe((espacios) => {
      this.espacios = espacios;
      this.cargando = false;
    });
  }

  inicializarFormulario(): void {
    this.formularioEspacio = this.fb.group({
      nombre: [''],
      disponible: [true]
    });
  }

  crearEspacio(): void {
    if (this.formularioEspacio.valid) {
      const datos = this.formularioEspacio.value;
      this.spaceService.crearEspacio(datos).subscribe(() => {
        this.cargarEspacios(); // Recargar la lista de espacios
        this.formularioEspacio.reset({ disponible: true });
      });
    }
  }

  editarEspacio(espacio: any): void {
    this.espacioSeleccionado = espacio;
    this.formularioEspacio.patchValue(espacio); // Llena el formulario con los datos del espacio seleccionado
  }

  guardarCambios(): void {
    if (this.formularioEspacio.valid && this.espacioSeleccionado) {
      const datos = this.formularioEspacio.value;
      this.spaceService.actualizarEspacio(this.espacioSeleccionado.id, datos).subscribe(() => {
        this.cargarEspacios(); // Recargar la lista de espacios
        this.espacioSeleccionado = null; // Salir del modo de edición
        this.formularioEspacio.reset({ disponible: true });
      });
    }
  }

  eliminarEspacio(id: string): void {
    if (confirm('¿Está seguro de eliminar este espacio?')) {
      this.spaceService.eliminarEspacio(id).subscribe(() => {
        this.cargarEspacios(); // Recargar la lista de espacios
      });
    }
  }

  cancelarEdicion(): void {
    this.espacioSeleccionado = null;
    this.formularioEspacio.reset({ disponible: true });
  }
}
