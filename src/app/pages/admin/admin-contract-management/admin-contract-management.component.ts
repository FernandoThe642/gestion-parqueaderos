import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ContractService } from '../../../services/contract.service';
import { UserService } from '../../../services/user.service';
import { SpaceService } from '../../../services/space.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-contract-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-contract-management.component.html',
  styleUrl: './admin-contract-management.component.scss'
})


export class AdminContractManagementComponent implements OnInit {
  contratos: any[] = []; // Lista de contratos
  usuarios: any[] = []; // Lista de usuarios
  espacios: any[] = []; // Lista de espacios
  formularioContrato!: FormGroup; // Formulario para crear/editar contratos
  contratoSeleccionado: any = null; // Contrato en edición
  cargando: boolean = true;

  constructor(
    private contractService: ContractService,
    private userService: UserService,
    private spaceService: SpaceService,
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
    });

    this.userService.obtenerUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios;
    });

    this.spaceService.obtenerEspacios().subscribe((espacios) => {
      this.espacios = espacios;
      this.cargando = false;
    });
  }

  inicializarFormulario(): void {
    this.formularioContrato = this.fb.group({
      usuario: [''],
      espacio: [''],
      inicio: [''],
      fin: [''],
      monto: [0],
      activo: [true]
    });
  }

  crearContrato(): void {
    if (this.formularioContrato.valid) {
      const datos = this.formularioContrato.value;
      this.contractService.crearContrato(datos).subscribe(() => {
        this.cargarDatos(); // Recargar la lista de contratos
        this.formularioContrato.reset({ monto: 0, activo: true });
      });
    }
  }

  editarContrato(contrato: any): void {
    this.contratoSeleccionado = contrato;
    this.formularioContrato.patchValue(contrato); // Llena el formulario con los datos del contrato seleccionado
  }

  guardarCambios(): void {
    if (this.formularioContrato.valid && this.contratoSeleccionado) {
      const datos = this.formularioContrato.value;
      this.contractService.actualizarContrato(this.contratoSeleccionado.id, datos).subscribe(() => {
        this.cargarDatos(); // Recargar la lista de contratos
        this.contratoSeleccionado = null; // Salir del modo de edición
        this.formularioContrato.reset({ monto: 0, activo: true });
      });
    }
  }

  eliminarContrato(id: string): void {
    if (confirm('¿Está seguro de eliminar este contrato?')) {
      this.contractService.eliminarContrato(id).subscribe(() => {
        this.cargarDatos(); // Recargar la lista de contratos
      });
    }
  }

  cancelarEdicion(): void {
    this.contratoSeleccionado = null;
    this.formularioContrato.reset({ monto: 0, activo: true });
  }
}