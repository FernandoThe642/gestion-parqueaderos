import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../../services/schedule.service';
import { ContractService } from '../../../services/contract.service';
import { UserService } from '../../../services/user.service';
import { SpaceService } from '../../../services/space.service';
import { TariffService } from '../../../services/tariff.service';
import { ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrl: './user-dashboard.component.scss',
})
export class UserDashboardComponent implements OnInit {
  usuario: any = null;
  horarios: any[] = [];
  contratos: any[] = [];
  tarifas: any[] = [];
  espacios: any[] = [];
  espacioSeleccionado: any = null;

  mostrarModalContrato: boolean = false;
  formularioContrato!: FormGroup;

  constructor(
    private userService: UserService,
    private scheduleService: ScheduleService,
    private contractService: ContractService,
    private spaceService: SpaceService,
    private tariffService: TariffService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarHorarios();
    this.cargarTarifas();
    this.cargarEspacios();
    this.inicializarFormularioContrato();
  }

  cargarUsuario(): void {
    const email = localStorage.getItem('email');
    if (email) {
      this.userService.obtenerUsuario(email).subscribe((usuario) => {
        this.usuario = usuario;
        this.cargarContratos();
      });
    }
  }

  cargarHorarios(): void {
    this.scheduleService.obtenerHorarios().subscribe((horarios) => {
      this.horarios = horarios;
    });
  }

  cargarTarifas(): void {
    this.tariffService.obtenerTarifas().subscribe((tarifas) => {
      this.tarifas = tarifas;
    });
  }

  cargarEspacios(): void {
    this.spaceService.obtenerEspaciosDisponibles().subscribe((espacios) => {
      this.espacios = espacios;
    });
  }

  cargarContratos(): void {
    this.contractService.obtenerContratos().subscribe((contratos) => {
      this.contratos = contratos.filter(
        (contrato) => contrato.usuario.id === this.usuario.id
      );
    });
  }

  calcularMonto(contrato: any): number {
    if (!contrato || !contrato.tarifa || !contrato.tarifa.valor) return 0;
  
    const fechaInicio = new Date(contrato.inicio);
    const fechaFin = new Date(contrato.fin);
    const diferenciaMeses = (fechaFin.getFullYear() - fechaInicio.getFullYear()) * 12 + fechaFin.getMonth() - fechaInicio.getMonth();
  
    return diferenciaMeses * contrato.tarifa.valor;
  }
   

  inicializarFormularioContrato(): void {
    this.formularioContrato = this.fb.group({
      tarifa: [''],
      inicio: [''],
      meses: [1],
      fin: [''],
    });
  }

  abrirModalContrato(espacio: any): void {
    this.espacioSeleccionado = espacio;
    this.formularioContrato.reset({ meses: 1 });
    this.mostrarModalContrato = true;
  }

  cerrarModalContrato(): void {
    this.mostrarModalContrato = false;
  }

  calcularFechaFin(): void {
    const inicio = new Date(this.formularioContrato.value.inicio);
    const meses = this.formularioContrato.value.meses || 1;
    const fin = new Date(inicio);
    fin.setMonth(fin.getMonth() + parseInt(meses, 10));
    this.formularioContrato.patchValue({ fin: fin.toISOString().split('T')[0] });
  }

  obtenerNombreEspacio(id: number): string {
    const espacio = this.espacios.find((e) => e.id === id);
    return espacio ? espacio.nombre : 'Desconocido';
  }

  crearContrato(): void {
    if (this.formularioContrato.valid) {
      const datos = {
        inicio: this.formularioContrato.value.inicio,
        fin: this.formularioContrato.value.fin,
        usuario: { id: this.usuario.id },
        espacio: { id: this.espacioSeleccionado.id },
        terminacion: 'Activo',
      };

      this.contractService.crearContrato(datos).subscribe(() => {
        this.spaceService
          .actualizarEspacio({ id: this.espacioSeleccionado.id, ocupado: true })
          .subscribe(() => {
            this.cerrarModalContrato();
            this.cargarEspacios();
            this.cargarContratos();
          });
      });
    }
  }
}
