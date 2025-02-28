import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AngularMaterialModule } from '../../module/app.angular.material.component';
import { MatDialog } from '@angular/material/dialog';
import { ApiService } from '../../service/api.service';

@Component({
  selector: 'app-head',
  standalone: true,
  imports: [CommonModule, AngularMaterialModule],
  templateUrl: './head.component.html',
  styleUrl: './head.component.css'
})
export class HeadComponent {
  constructor(public router: Router, public dialog: MatDialog, public api: ApiService) { }

  Menu: { Name: string, Router: string, Disabled?: boolean }[] = [
    { Name: "Inicio", Router: "" },
    { Name: "Recursos gratuitos", Router: "recursos" },
    { Name: "Cursos para ti", Router: "/", Disabled: true },
    { Name: "Sana tus digestiones", Router: "digestion" },
    { Name: "Pérdida de grasa", Router: "perdidagrasa" },
    { Name: "Asesoramiento único", Router: "asesoramiento" },
    { Name: "Portal Curso", Router: "login" },
  ]

  href(item: any) {
    if (!item.Disabled) {
      this.router.navigate([item.Router])
    } else if (item.Disabled) {
      event?.preventDefault()
      this.dialog.open(DialogDisabled, {});
    }
  }
  CerrarSession() {
    localStorage.removeItem("jwt")
    this.router.navigate(["/login/"])
  }
  find(array: any[], value: string, data: string) {
    return array.find((a: any) => a[value] === data)
  }
}

@Component({
  selector: 'dialog-component-disabled',
  templateUrl: 'dialog.component.html',
  standalone: true,
  imports: [AngularMaterialModule],
})
export class DialogDisabled { }
