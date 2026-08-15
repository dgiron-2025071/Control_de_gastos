import { Routes } from "@angular/router";
import { authGuard } from "./core/guards/auth.guard";
import { loginGuard } from "./core/guards/login.guard";

export const routes: Routes = [
  { path: "", redirectTo: "login", pathMatch: "full" },
  {
    path: "login",
    canActivate: [loginGuard],
    loadComponent: () =>
      import("./features/login/login.component").then((m) => m.LoginComponent),
  },
  {
    path: "register",
    canActivate: [loginGuard],
    loadComponent: () =>
      import("./features/register/register.component").then(
        (m) => m.RegisterComponent
      ),
  },
  {
    path: "maintenance",
    canActivate: [authGuard],
    loadComponent: () =>
      import("./features/maintenance/maintenance.component").then(
        (m) => m.MaintenanceComponent
      ),
  },
  { path: "**", redirectTo: "login" },
];
