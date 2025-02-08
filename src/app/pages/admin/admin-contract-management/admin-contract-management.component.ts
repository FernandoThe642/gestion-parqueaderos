import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ContractService } from '../../../services/contract.service';
import { UserService } from '../../../services/user.service';
import { SpaceService } from '../../../services/space.service';
import { TariffService } from '../../../services/tariff.service';
import { CommonModule } from '@angular/common';

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
      tarifa: ['', Validators.required],
      inicio: ['', Validators.required],
      meses: [1, Validators.required],
      fin: [{ value: '', disabled: true }]
    });
  }

  obtenerNombreUsuario(id: number): string {
    const usuario = this.usuarios.find((u) => u.id === id);
    return usuario ? usuario.nombre : 'Desconocido';
  }

  obtenerNombreEspacio(id: number): string {
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
      meses: this.calcularMeses(contrato.inicio, contrato.fin)
    });
  }

  calcularMeses(inicio: string, fin: string): number {
    const fechaInicio = new Date(inicio);
    const fechaFin = new Date(fin);
    return (fechaFin.getFullYear() - fechaInicio.getFullYear()) * 12 + (fechaFin.getMonth() - fechaInicio.getMonth());
  }

  calcularFechaFin(): void {
    const inicio = new Date(this.formularioContrato.value.inicio);
    const meses = this.formularioContrato.value.meses || 1;
    const fin = new Date(inicio);
    fin.setMonth(fin.getMonth() + meses);
    this.formularioContrato.patchValue({ fin: fin.toISOString().split('T')[0] });
  }

  guardarCambios(): void {
    if (this.formularioContrato.valid && this.contratoSeleccionado) {
      const datos = {
        id: this.contratoSeleccionado.id,
        ...this.formularioContrato.value
      };

      this.contractService.actualizarContrato(datos).subscribe(() => {
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
