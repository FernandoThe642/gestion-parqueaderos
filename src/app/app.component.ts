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
  title = 'Parqueaderos'
  usuarioAutenticado: boolean = false
  rolUsuario: string | null = null

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit() {
    // Observa el estado de autenticación
    this.authService.obtenerEstadoAutenticacion().subscribe((usuario) => {
      this.usuarioAutenticado = !!usuario
    })
  }

  iniciarSesion() {
    this.router.navigate(['/login'])
  }

  cerrarSesion() {
    this.authService.cerrarSesion().subscribe(() => {
      this.router.navigate(['/login'])
    })
  }
}
