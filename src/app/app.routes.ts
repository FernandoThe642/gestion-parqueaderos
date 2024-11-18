import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { SignUpComponent } from './pages/auth/sign-up/sign-up.component';
import { LogInComponent } from './pages/auth/log-in/log-in.component';


import { canActivateAuth } from './guards/auth.guard';
import { canActivateAdmin } from './guards/admin.guard';
import { AdminUserManagementComponent } from './pages/admin/admin-user-management/admin-user-management.component';
import { UserComponent } from './pages/user/user/user.component';
import { AdminSpaceManagementComponent } from './pages/admin/admin-space-management/admin-space-management.component';
import { AdminTariffManagementComponent } from './pages/admin/admin-tariff-management/admin-tariff-management.component';
import { AdminScheduleManagementComponent } from './pages/admin/admin-schedule-management/admin-schedule-management.component';
import { AdminContractManagementComponent } from './pages/admin/admin-contract-management/admin-contract-management.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'home',
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
        path: 'user-management',
        component: AdminUserManagementComponent,
        canActivate: [canActivateAuth, canActivateAdmin]  // Aplicar el AdminGuard como función
    },
    {
        path: 'space-management',
        component: AdminSpaceManagementComponent,
        canActivate: [canActivateAuth, canActivateAdmin]  
    },
    {
        path: 'tariff-management',
        component: AdminTariffManagementComponent,
        canActivate: [canActivateAuth, canActivateAdmin]  
    },
    {
        path: 'contract-management',
        component: AdminContractManagementComponent,
        canActivate: [canActivateAuth, canActivateAdmin]  
    },
    {
        path: 'schedule-management',
        component: AdminScheduleManagementComponent,
        canActivate: [canActivateAuth, canActivateAdmin]  
    }

];
