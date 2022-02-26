import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SiteLayoutComponent } from './layouts/site-layout/site-layout.component';
import { CustomerLoginComponent } from './pages/auth/customer-login/customer-login.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { AuthGuardGuard } from './services/auth-guard.guard';

const routes: Routes = [
  {
    path: 'register',
    component: RegisterComponent,
  },
  {
    path: 'backend',
    component: LoginComponent,
  },
  {
    path: 'login',
    component: CustomerLoginComponent,
  },
  {
    path: '',
    component: SiteLayoutComponent,
    children: [
      {
        path: '',
        pathMatch: 'prefix',
        redirectTo: 'dashboard',
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
      },
      {
        path: 'employee',
        loadChildren: () =>
          import('./pages/employee/employee.module').then(
            (m) => m.EmployeeModule
          ),
      },
      {
        path: 'farm',
        loadChildren: () =>
          import('./pages/farm/farm.module').then((m) => m.FarmModule),
      },
      {
        path: 'product',
        loadChildren: () =>
          import('./pages/product/product.module').then((m) => m.ProductModule),
      },
      {
        path: 'dealer',
        loadChildren: () =>
          import('./pages/dealer/dealer.module').then((m) => m.DealerModule),
      },
    ],
    canActivate: [AuthGuardGuard],
  },
  {
    path: '**',
    redirectTo: 'backend',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
