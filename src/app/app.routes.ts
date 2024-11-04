import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { LogInComponent } from './pages/auth/log-in/log-in.component';


import { canActivateAuth } from './guards/auth.guard';
import { canActivateAdmin } from './guards/admin.guard';
import { AdminUserManagementComponent } from './pages/admin/admin-user-management/admin-user-management.component';
import { UserComponent } from './pages/user/user/user.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'user',
    component: UserComponent,
    canActivate: [canActivateAuth]  // Aplicar el AuthGuard como función
  },
  {
    path: 'signup',
    component: SignUpComponent
  },
  {
    path: 'login',
    component: LogInComponent
  },
  {
    path: 'admin/user-management',
    component: AdminUserManagementComponent,
    canActivate: [canActivateAuth, canActivateAdmin]  // Aplicar el AdminGuard como función
  }
];
