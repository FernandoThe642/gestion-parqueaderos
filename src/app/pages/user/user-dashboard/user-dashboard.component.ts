import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../../../services/schedule.service';
import { ContractService } from '../../../services/contract.service';
import { UserService } from '../../../services/user.service';
import { SpaceService } from '../../../services/space.service';
import { TariffService } from '../../../services/tariff.service';
import { ReactiveFormsModule } from '@angular/forms';
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
  espacios: Map<string, string> = new Map();

  constructor(
    private userService: UserService,
    private scheduleService: ScheduleService,
    private contractService: ContractService,
    private spaceService: SpaceService,
    private tariffService: TariffService
  ) {}

  ngOnInit(): void {
    this.cargarUsuario();
    this.cargarHorarios();
    this.cargarTarifas();
    this.cargarEspacios();
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

  cargarEspacios(): void {
    this.spaceService.obtenerEspacios().subscribe((espacios) => {
      espacios.forEach((espacio) => {
        this.espacios.set(espacio.id, espacio.nombre);
      });
    });
  }

  cargarContratos(): void {
    this.contractService.obtenerContratos().subscribe((contratos) => {
      this.contratos = contratos.filter(
        (contrato) => contrato.cedula === this.usuario?.cedula
      );
    });
  }

  obtenerNombreEspacio(id: string): string {
    return this.espacios.get(id) || 'Desconocido';
  }

  calcularMonto(contrato: any): number {
    const tarifa = this.tarifas.find((t) => t.id === contrato.tarifa);
    if (!tarifa) return 0;

    return contrato.meses * tarifa.valor;
  }
}
