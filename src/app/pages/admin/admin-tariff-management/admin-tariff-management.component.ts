import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { TariffService } from '../../../services/tariff.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-tariff-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-tariff-management.component.html',
  styleUrl: './admin-tariff-management.component.scss'
})
export class AdminTariffManagementComponent implements OnInit {
  tarifas: any[] = []; // Lista de tarifas
  formularioTarifa!: FormGroup; // Formulario para agregar/editar tarifas
  tarifaSeleccionada: any = null; // Tarifa en edición
  cargando: boolean = true;

  constructor(private tariffService: TariffService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cargarTarifas();
    this.inicializarFormulario();
  }

  cargarTarifas(): void {
    this.tariffService.obtenerTarifas().subscribe((tarifas) => {
      this.tarifas = tarifas;
      this.cargando = false;
    });
  }

  inicializarFormulario(): void {
    this.formularioTarifa = this.fb.group({
      nombre: [''],
      precio: [0],  
      descripcion: ['']
    });
    
    
  }

  crearTarifa(): void {
    if (this.formularioTarifa.valid) {
      const datos = this.formularioTarifa.value;
      this.tariffService.crearTarifa(datos).subscribe(() => {
        this.cargarTarifas();
        this.formularioTarifa.reset({ precio: 0 });

      });
    }
  }

  editarTarifa(tarifa: any): void {
    this.tarifaSeleccionada = tarifa;
    this.formularioTarifa.patchValue({
      nombre: tarifa.nombre,
      precio: tarifa.precio, 
      descripcion: tarifa.descripcion
    });
  }
  
  

  guardarCambios(): void {
    if (this.formularioTarifa.valid && this.tarifaSeleccionada) {
      const tarifaActualizada = {
        nombre: this.formularioTarifa.value.nombre,
        precio: this.formularioTarifa.value.precio,
        descripcion: this.formularioTarifa.value.descripcion
      };
  
      this.tariffService.actualizarTarifa(this.tarifaSeleccionada.id, tarifaActualizada).subscribe(() => {
        this.cargarTarifas();
        this.tarifaSeleccionada = null;
        this.formularioTarifa.reset({ precio: 0 });

      });
    }
  }
  

  eliminarTarifa(id: number): void {
    if (confirm('¿Está seguro de eliminar esta tarifa?')) {
      this.tariffService.eliminarTarifa(id).subscribe(() => {
        this.cargarTarifas();
      });
    }
  }

  cancelarEdicion(): void {
    this.tarifaSeleccionada = null;
    this.formularioTarifa.reset({ precio: 0 });

  }
}
