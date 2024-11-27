import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContractService } from '../../../services/contract.service';
import { UserService } from '../../../services/user.service';
import { SpaceService } from '../../../services/space.service';
import { CommonModule } from '@angular/common';
import { TariffService } from '../../../services/tariff.service';

@Component({
  selector: 'app-admin-contract-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-contract-management.component.html',
  styleUrl: './admin-contract-management.component.scss'
})
export class AdminContractManagementComponent implements OnInit {
  contratos: any[] = [];
  usuarios: any[] = [];
  espacios: any[] = [];
  tarifas: any[] = [];
  formularioContrato!: FormGroup;
  contratoSeleccionado: any = null;
  cargando: boolean = true;

  constructor(
    private contractService: ContractService,
    private userService: UserService,
    private spaceService: SpaceService,
    private tariffService: TariffService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.inicializarFormulario();
  }
  cargarDatos(): void {
    this.cargando = true;

    this.contractService.obtenerContratos().subscribe((contratos) => {
      this.contratos = contratos;
      this.cargando = false;
    });

    this.userService.obtenerUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios;
    });

    this.spaceService.obtenerEspacios().subscribe((espacios) => {
      this.espacios = espacios;
    });

    this.tariffService.obtenerTarifas().subscribe((tarifas) => {
      this.tarifas = tarifas;
    });
  }

  inicializarFormulario(): void {
    this.formularioContrato = this.fb.group({
      tarifa: [''],
      inicio: [''],
    });
  }

  obtenerNombreUsuario(uid: string): string {
    const usuario = this.usuarios.find((u) => u.uid === uid);
    return usuario ? usuario.nombre : 'Desconocido';
  }

  obtenerNombreEspacio(id: string): string {
    const espacio = this.espacios.find((e) => e.id === id);
    return espacio ? espacio.nombre : 'Desconocido';
  }

  calcularMonto(contrato: any): number {
    const tarifa = this.tarifas.find((t) => t.id === contrato.tarifa);
    if (!tarifa) return 0;

    const fechaInicio = new Date(contrato.inicio);
    const fechaFin = new Date(contrato.fin);
    const meses = (fechaFin.getFullYear() - fechaInicio.getFullYear()) * 12 + (fechaFin.getMonth() - fechaInicio.getMonth());

    return meses * tarifa.valor;
  }

  editarContrato(contrato: any): void {
    this.contratoSeleccionado = contrato;
    this.formularioContrato.patchValue({
      tarifa: contrato.tarifa,
      inicio: contrato.inicio,
    });
  }

  guardarCambios(): void {
    if (this.formularioContrato.valid && this.contratoSeleccionado) {
      const datos = {
        ...this.formularioContrato.value,
        id: this.contratoSeleccionado.id,
      };

      this.contractService.actualizarContrato(this.contratoSeleccionado.id, datos).subscribe(() => {
        this.cargarDatos();
        this.cancelarEdicion();
      });
    }
  }

  cancelarEdicion(): void {
    this.contratoSeleccionado = null;
    this.formularioContrato.reset();
  }
}
