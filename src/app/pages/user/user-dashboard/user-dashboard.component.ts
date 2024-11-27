import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../../services/schedule.service';
import { ContractService } from '../../../services/contract.service';
import { UserService } from '../../../services/user.service';
import { SpaceService } from '../../../services/space.service';
import { TariffService } from '../../../services/tariff.service';
import { ReactiveFormsModule,  FormBuilder, FormGroup } from '@angular/forms';
import { CommonModule } from '@angular/common';

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
    this.userService.obtenerPerfil().subscribe((perfil) => {
      this.usuario = perfil;
      this.cargarContratos();
    });
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



  cargarContratos(): void {
    this.contractService.obtenerContratos().subscribe((contratos) => {
      this.contratos = contratos.filter(
        (contrato) => contrato.cedula === this.usuario?.cedula
      );
    });
  }



  calcularMonto(contrato: any): number {
    const tarifa = this.tarifas.find((t) => t.id === contrato.tarifa);
    if (!tarifa) return 0;

    return contrato.meses * tarifa.valor;
  }

  cargarEspacios(): void {
    this.spaceService.obtenerEspacios().subscribe((espacios) => {
      this.espacios = espacios.filter((espacio) => espacio.disponible); // Mostrar solo disponibles
    });
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

  obtenerNombreEspacio(idEspacio: string): string {
    const espacio = this.espacios.find(e => e.id === idEspacio);
    return espacio ? espacio.nombre : 'Desconocido';
  }
  

  crearContrato(): void {
    if (this.formularioContrato.valid) {
      const datos = {
        ...this.formularioContrato.value,
        espacio: this.espacioSeleccionado.id,
        cedula: this.usuario.cedula,
        estado: 'Activo',
      };

      this.contractService.crearContrato(datos).subscribe(() => {
        this.spaceService.actualizarEspacio(this.espacioSeleccionado.id, { disponible: false }).subscribe(() => {
          this.cerrarModalContrato();
          this.cargarEspacios();
        });
      });
    }
  }

}
