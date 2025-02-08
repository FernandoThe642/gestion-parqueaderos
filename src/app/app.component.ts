import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Parqueaderos';
  usuarioAutenticado: boolean = false;
  rolUsuario: string | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.authService.usuarioAutenticado$.subscribe((autenticado) => {
      this.usuarioAutenticado = autenticado;
      this.rolUsuario = this.authService.obtenerRolUsuario();
      
      // Redirigir automáticamente al inicio cuando el usuario inicie sesión
      if (this.usuarioAutenticado) {
        this.router.navigate(['/home']);
      }
    });
  }

  
  iniciarSesion() {
    this.router.navigate(['/login']);
  }

  cerrarSesion(): void {
    this.authService.cerrarSesion(); // Usar el método del servicio de autenticación
    this.router.navigate(['/home']);
  }
  

}
