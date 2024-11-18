import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ScheduleService } from '../../../services/schedule.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-schedule-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ],
  templateUrl: './admin-schedule-management.component.html',
  styleUrl: './admin-schedule-management.component.scss'
})

export class AdminScheduleManagementComponent implements OnInit {
  horarios: any[] = []; // Lista de horarios
  formularioHorario!: FormGroup; // Formulario para definir/editar horarios
  diaSeleccionado: string | null = null; // Día en edición
  cargando: boolean = true;

  diasDeLaSemana = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];

  constructor(private scheduleService: ScheduleService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.cargarHorarios();
    this.inicializarFormulario();
  }

  cargarHorarios(): void {
    this.scheduleService.obtenerHorarios().subscribe((horarios) => {
      this.horarios = horarios;
      this.cargando = false;
    });
  }

  inicializarFormulario(): void {
    this.formularioHorario = this.fb.group({
      horaApertura: [''],
      horaCierre: ['']
    });
  }

  definirHorario(dia: string): void {
    this.diaSeleccionado = dia;
    const horarioExistente = this.horarios.find((h) => h.id === dia);
    if (horarioExistente) {
      this.formularioHorario.patchValue(horarioExistente); // Rellenar formulario con horario existente
    } else {
      this.formularioHorario.reset(); // Limpiar formulario para un nuevo horario
    }
  }

  guardarHorario(): void {
    if (this.formularioHorario.valid && this.diaSeleccionado) {
      const datos = this.formularioHorario.value;
      this.scheduleService.definirHorario(this.diaSeleccionado, datos).subscribe(() => {
        this.cargarHorarios(); // Recargar lista de horarios
        this.diaSeleccionado = null; // Salir del modo de edición
      });
    }
  }

  obtenerHorario(dia: string): string {
    const horario = this.horarios.find((h) => h.id === dia);
    if (horario) {
      return `${horario.horaApertura || '--:--'} - ${horario.horaCierre || '--:--'}`;
    }
    return '--:-- - --:--';
  }
  
  cancelarEdicion(): void {
    this.diaSeleccionado = null;
    this.formularioHorario.reset();
  }
}
