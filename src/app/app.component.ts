import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet, Router, Route } from '@angular/router';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { doc, Firestore, getDoc } from '@angular/fire/firestore';

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

  constructor(private authService: AuthService, private firestore: Firestore, private router: Router) {}

  ngOnInit() {
    // Observa el estado de autenticación
    this.authService.obtenerEstadoAutenticacion().subscribe((usuario) => {
      if (usuario) {
        this.usuarioAutenticado = true
        this.obtenerRolUsuario(usuario.uid)
      } else {
        this.usuarioAutenticado = false
        this.rolUsuario = null
      }
    })
  }

   // Método para obtener el rol del usuario desde Firestore
  obtenerRolUsuario(uid: string) {
    const userDocRef = doc(this.firestore, `usuarios/${uid}`)
    getDoc(userDocRef).then(docSnapshot => {
      if (docSnapshot.exists()) {
        this.rolUsuario = docSnapshot.data()?.["role"] || null
      } else {
        this.rolUsuario = null
      }
    }).catch(error => {
      console.error('Error al obtener el rol del usuario:', error)
      this.rolUsuario = null
    })
  }

  iniciarSesion() {
    this.router.navigate(['/login'])
  }

  cerrarSesion() {
  this.authService.cerrarSesion().subscribe(() => {
      this.usuarioAutenticado = false
      this.rolUsuario = null
      this.router.navigate(['/home'])
    })
  }
}
