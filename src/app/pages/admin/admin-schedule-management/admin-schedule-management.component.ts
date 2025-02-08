import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ScheduleService } from '../../../services/schedule.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-schedule-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-schedule-management.component.html',
  styleUrl: './admin-schedule-management.component.scss'
})
export class AdminScheduleManagementComponent implements OnInit {
  horarios: any[] = [];
  formularioHorario!: FormGroup;
  diaSeleccionado: string | null = null;
  cargando: boolean = true;


  diasDeLaSemana = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

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
      dia: ['', Validators.required],
      inicio: ['', Validators.required], 
      fin: ['', Validators.required]     
    });
  }
  

  definirHorario(dia: string): void {
    this.diaSeleccionado = dia;
    this.scheduleService.obtenerHorariosPorDia(dia).subscribe((horarios) => {
      if (horarios.length > 0) {
        this.formularioHorario.patchValue(horarios[0]); // Si ya existe un horario, lo llena
      } else {
        this.formularioHorario.reset({ dia: dia }); // Si no, deja los campos en blanco
      }
    });
  }

  guardarHorario(): void {
    if (this.formularioHorario.valid && this.diaSeleccionado) {
      const datos = {
        dia: this.diaSeleccionado,
        inicio: this.formularioHorario.value.inicio,
        fin: this.formularioHorario.value.fin
      };

      this.scheduleService.definirHorario(datos).subscribe({
        next: () => {
          this.cargarHorarios();
          this.cerrarModal();
        },
        error: (error) => {
          console.error('Error al guardar horario:', error);
        }
      });
    }
  }

  obtenerHorario(dia: string): string {
    const horario = this.horarios.find((h) => h.dia === dia);
    return horario ? `${horario.inicio} - ${horario.fin}` : '--:-- - --:--';
  }

  cancelarEdicion(): void {
    this.diaSeleccionado = null;
    this.formularioHorario.reset();
  }

  
  abrirModal(dia: string): void {
    this.diaSeleccionado = dia;
    this.scheduleService.obtenerHorariosPorDia(dia).subscribe((horarios) => {
      if (horarios.length > 0) {
        this.formularioHorario.patchValue(horarios[0]); 
      } else {
        this.formularioHorario.reset({ dia: dia });
      }
    });
  }

  cerrarModal(): void {
    this.diaSeleccionado = null;
    this.formularioHorario.reset();
  }
}
