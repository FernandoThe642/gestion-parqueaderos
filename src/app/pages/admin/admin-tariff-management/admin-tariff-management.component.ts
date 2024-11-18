import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
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
      tipo: [''],
      valor: [0],
      descripcion: ['']
    });
  }

  crearTarifa(): void {
    if (this.formularioTarifa.valid) {
      const datos = this.formularioTarifa.value;
      this.tariffService.crearTarifa(datos).subscribe(() => {
        this.cargarTarifas(); // Recargar la lista de tarifas
        this.formularioTarifa.reset({ valor: 0 });
      });
    }
  }

  editarTarifa(tarifa: any): void {
    this.tarifaSeleccionada = tarifa;
    this.formularioTarifa.patchValue(tarifa); // Llena el formulario con los datos de la tarifa seleccionada
  }

  guardarCambios(): void {
    if (this.formularioTarifa.valid && this.tarifaSeleccionada) {
      const datos = this.formularioTarifa.value;
      this.tariffService.actualizarTarifa(this.tarifaSeleccionada.id, datos).subscribe(() => {
        this.cargarTarifas(); // Recargar la lista de tarifas
        this.tarifaSeleccionada = null; // Salir del modo de edición
        this.formularioTarifa.reset({ valor: 0 });
      });
    }
  }

  eliminarTarifa(id: string): void {
    if (confirm('¿Está seguro de eliminar esta tarifa?')) {
      this.tariffService.eliminarTarifa(id).subscribe(() => {
        this.cargarTarifas(); // Recargar la lista de tarifas
      });
    }
  }

  cancelarEdicion(): void {
    this.tarifaSeleccionada = null;
    this.formularioTarifa.reset({ valor: 0 });
  }
}
