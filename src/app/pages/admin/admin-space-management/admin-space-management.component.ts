import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
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
      this.espacios = espacios;
      this.verificarDisponibilidad();
      this.cargando = false;
    });
  }

  verificarDisponibilidad(): void {
    this.espacios.forEach((espacio) => {
      if (espacio.ocupado) {
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
      cedula: ['', Validators.required],
      tarifa: ['', Validators.required],
      inicio: ['', Validators.required],
      meses: [1, [Validators.required, Validators.min(1)]],
      fin: [{ value: '', disabled: true }]
    });
  }

  inicializarFormularioEspacio(): void {
    this.formularioEspacio = this.fb.group({
      nombre: ['', Validators.required],
      tarifa: ['', Validators.required] 
    });
  }
  

  abrirModalContrato(espacio: any): void {
    this.espacioSeleccionado = espacio;
    this.formularioContrato.reset({ meses: 1 });
    this.mostrarModalContrato = true;
  }
  
  cerrarModalContrato(): void {
    this.mostrarModalContrato = false;
    this.formularioContrato.reset({ meses: 1 });
  }
  
  crearContrato(): void {
    if (this.formularioContrato.valid) {
      const datos = {
        ...this.formularioContrato.value,
        espacio: this.espacioSeleccionado.id,
        estado: 'Activo'
      };
  
      this.contractService.crearContrato(datos).subscribe(() => {
        this.spaceService.actualizarEspacio({
          id: this.espacioSeleccionado.id,
          ocupado: true // Enviar "ocupado: true" en lugar de "disponible: false"
        }).subscribe(() => {
          this.cerrarModalContrato();
          this.cargarEspacios();
        });
      });
    }
  }
  
  agregarEspacio(): void {
    if (this.formularioEspacio.valid) {
      const nuevoEspacio = {
        nombre: this.formularioEspacio.value.nombre,
        ocupado: false,
        tarifa: { id: this.formularioEspacio.value.tarifa } // Se envía la tarifa seleccionada
      };
  
      this.spaceService.crearEspacio(nuevoEspacio).subscribe(() => {
        this.cerrarModalEspacio();
        this.cargarEspacios();
      }, error => {
        console.error('Error al agregar espacio:', error);
      });
    }
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

  

  ordenarAlfanumerico(a: string, b: string): number {
    const regex = /^([a-zA-Z]+)(\d+)$/;
    const matchA = a.match(regex);
    const matchB = b.match(regex);

    if (matchA && matchB) {
      const [_, letraA, numeroA] = matchA;
      const [__, letraB, numeroB] = matchB;

      const comparacionLetras = letraA.localeCompare(letraB);
      if (comparacionLetras !== 0) {
        return comparacionLetras;
      }
      return parseInt(numeroA, 10) - parseInt(numeroB, 10);
    }

    return a.localeCompare(b);
  }



  actualizarEspacio(id: number, estado: boolean): void {
    this.spaceService.actualizarEspacio({ id, ocupado: estado }).subscribe(() => {
      this.cargarEspacios();
    });
  }




}
