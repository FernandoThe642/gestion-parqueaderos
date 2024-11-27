import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { SpaceService } from '../../../services/space.service';
import { ContractService } from '../../../services/contract.service';
import { TariffService } from '../../../services/tariff.service';
import { UserService } from '../../../services/user.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-space-management',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './admin-space-management.component.html',
  styleUrl: './admin-space-management.component.scss'
})

export class AdminSpaceManagementComponent implements OnInit {
  espacios: any[] = [];
  tarifas: any[] = [];
  usuarios: any[] = [];
  cargando: boolean = true;

  mostrarModalContrato: boolean = false;
  mostrarModalEspacio: boolean = false;
  mostrarModalEditarEspacio: boolean = false;
  espacioSeleccionado: any = null;

  formularioContrato!: FormGroup;
  formularioEspacio!: FormGroup;

  constructor(
    private spaceService: SpaceService,
    private contractService: ContractService,
    private tariffService: TariffService,
    private userService: UserService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.cargarEspacios();
    this.cargarTarifas();
    this.cargarUsuarios();
    this.inicializarFormularioContrato();
    this.inicializarFormularioEspacio();
  }

  cargarEspacios(): void {
    this.spaceService.obtenerEspacios().subscribe((espacios) => {
      // Ordenar espacios alfanuméricamente
      this.espacios = espacios.sort((a, b) => this.ordenarAlfanumerico(a.nombre, b.nombre));
      this.verificarDisponibilidad(); // Revisar disponibilidad
      this.cargando = false;
    });
  }
  
  ordenarAlfanumerico(a: string, b: string): number {
    const regex = /^([a-zA-Z]+)(\d+)$/;
    const matchA = a.match(regex);
    const matchB = b.match(regex);
  
    if (matchA && matchB) {
      const [_, letraA, numeroA] = matchA;
      const [__, letraB, numeroB] = matchB;
  
      // Comparar letras primero
      const comparacionLetras = letraA.localeCompare(letraB);
      if (comparacionLetras !== 0) {
        return comparacionLetras;
      }
  
      // Comparar números como enteros
      return parseInt(numeroA, 10) - parseInt(numeroB, 10);
    }
  
    // Si no coinciden con el patrón, usar comparación normal
    return a.localeCompare(b);
  }
  
  verificarDisponibilidad(): void {
    this.espacios.forEach((espacio) => {
      if (!espacio.disponible) {
        // Si el espacio no está disponible, podría hacer otras verificaciones aquí
        console.log(`El espacio ${espacio.nombre} está ocupado.`);
      }
    });
  }

  cargarTarifas(): void {
    this.tariffService.obtenerTarifas().subscribe((tarifas) => {
      this.tarifas = tarifas;
    });
  }

  cargarUsuarios(): void {
    this.userService.obtenerUsuarios().subscribe((usuarios) => {
      this.usuarios = usuarios;
    });
  }

  inicializarFormularioContrato(): void {
    this.formularioContrato = this.fb.group({
      cedula: [''],
      tarifa: [''],
      inicio: [''],
      meses: [1],
      fin: [''],
    });
  }

  inicializarFormularioEspacio(): void {
    this.formularioEspacio = this.fb.group({
      nombre: [''],
    });
  }

  

  abrirModalContrato(espacio: any): void {
    this.espacioSeleccionado = espacio;
  
    this.contractService.obtenerContratoPorEspacio(espacio.id).subscribe((contrato) => {
      if (contrato) {
        this.formularioContrato.patchValue({
          cedula: contrato.cedula,
          tarifa: contrato.tarifa,
          inicio: contrato.inicio,
          meses: contrato.meses,
          fin: contrato.fin,
        });
        this.formularioContrato.get('cedula')?.disable(); 
      } else {
    
        this.formularioContrato.reset({ meses: 1 });
        this.formularioContrato.get('cedula')?.enable();
      }
      this.mostrarModalContrato = true;
    });
  }
  

  cerrarModalContrato(): void {
    this.mostrarModalContrato = false;
    this.formularioContrato.reset({ meses: 1 });
    this.formularioContrato.get('cedula')?.enable(); 
  }

  abrirModalEspacio(): void {
    this.mostrarModalEspacio = true;
  }

  cerrarModalEspacio(): void {
    this.mostrarModalEspacio = false;
    this.formularioEspacio.reset();
  }

  calcularFechaFin(): void {
    const inicio = new Date(this.formularioContrato.value.inicio);
    const meses = this.formularioContrato.value.meses || 1;
    const fin = new Date(inicio);
    fin.setMonth(fin.getMonth() + parseInt(meses, 10));
    this.formularioContrato.patchValue({ fin: fin.toISOString().split('T')[0] });
  }

  crearContrato(): void {
    if (this.formularioContrato.valid) {
      const usuarioSeleccionado = this.usuarios.find(
        (usuario) => usuario.cedula === this.formularioContrato.value.cedula
      );

      const datos = {
        ...this.formularioContrato.value,
        espacio: this.espacioSeleccionado.id,
        estado: 'Activo', // El contrato se crea como Activo
        nombreUsuario: usuarioSeleccionado?.nombre || 'Desconocido',
      };

      this.contractService.crearContrato(datos).subscribe(() => {
        this.spaceService.actualizarEspacio(this.espacioSeleccionado.id, { disponible: false }).subscribe(() => {
          this.cerrarModalContrato();
          this.cargarEspacios();
        });
      });
    }
  }

  agregarEspacio(): void {
    if (this.formularioEspacio.valid) {
      const nuevoEspacio = {
        ...this.formularioEspacio.value,
        disponible: true, // Siempre disponible al crear
      };
      this.spaceService.crearEspacio(nuevoEspacio).subscribe(() => {
        this.cerrarModalEspacio();
        this.cargarEspacios();
      });
    }
  }
}