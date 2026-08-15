import { Component } from "@angular/core";
import { CommonModule } from "@angular/common";
import { Router } from "@angular/router";
import { AuthService } from "../../core/services/auth.service";

@Component({
  selector: "app-maintenance",
  standalone: true,
  imports: [CommonModule],
  templateUrl: "./maintenance.component.html",
  styleUrl: "./maintenance.component.css",
})
export class MaintenanceComponent {
  constructor(private authService: AuthService, private router: Router) {}

  get user() {
    return this.authService.currentUser();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(["/login"], { replaceUrl: true });
  }
}
