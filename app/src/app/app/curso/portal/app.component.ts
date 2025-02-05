import { Component, OnInit } from '@angular/core';
import { AngularMaterialModule } from '../../../module/app.angular.material.component';
import { AngularModule } from '../../../module/app.angular.component copy';
import { ApiService } from '../../../service/api.service';
import { Router } from '@angular/router';
import { DomSanitizer, Title } from "@angular/platform-browser";
import { environment } from '../../../../environments/environment';
import { ComponentChatComponent } from '../../component/chat/app.component';

@Component({
  selector: 'app-curso-portal',
  standalone: true,
  imports: [AngularMaterialModule, AngularModule, ComponentChatComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppCursoPortalComponent implements OnInit {
  constructor(private api: ApiService, private router: Router, private sanitizer: DomSanitizer, private title: Title) { }

  level1!: any
  slevel1!: any
  level2!: any
  slevel2!: any
  video!: any
  svideo!: any
  curso!: any

  UrlApi: string = environment.URL_PUBLIC

  ngOnInit() {
    this.title.setTitle("Portal de curso - Clara Fuertes Nutrición")
    this.Get()
  }

  async Get() {
    const id = localStorage.getItem("jwz")
    if (id) {
      this.level1 = await this.api.Get("curso/level1")
      this.level2 = await this.api.Get("curso/level2")
      this.level2.data = this.level2.data.sort((a: any, b: any) => a.orden >= b.orden ? 1 : -1).sort((a: any, b: any) => a.depId >= b.depId ? 1 : -1)
      this.video = await this.api.Get("curso/video")
      this.video.data = this.video.data.sort((a: any, b: any) => a.Orden >= b.Orden ? 1 : -1)
      this.curso = await this.api.GetID("curso/curso", +id)
      this.checkprogress()
    } else this.router.navigate(["login"])
  }
  videoURL(src: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(src.replace("share", "embed") + "?hideEmbedTopBar=true");
  }
  canvaURL(src: string) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(src.replaceAll("&#x2F;", "/"));
  }
  CerrarSession() {
    localStorage.removeItem("jwt")
    this.router.navigate(["/login/"])
  }
  clickLevel1() {
    this.title.setTitle("Portal de curso - Clara Fuertes Nutrición")
  }
  clickLevel2() {
    this.title.setTitle("Portal de curso - Clara Fuertes Nutrición")
  }
  async seeVideo(v: any) {
    this.title.setTitle(v.Name + " - Clara Fuertes Nutrición")
    if (!v.active) {
      for (const c of this.curso.data) {
        const data = JSON.parse(c.progreso || "[]")
        data.push({ id: v.id })
        c.progreso = JSON.stringify(data)
        await this.api.Accion(c, "curso/curso", "update")
      }
      this.checkprogress()
    }
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  checkprogress() {
    for (const c of this.curso.data) {
      const now = new Date()
      const inicio = new Date(c.inicio)
      const l1 = this.level1.data.find((a: any) => a.id === c.cursoId && new Date(c.inicio) <= now && new Date(c.expiro) >= now)
      if (l1) {
        l1["active"] = true
        const progress = JSON.parse(c.progreso || "[]")
        for (const p of progress) {
          const v = this.video.data.find((a: any) => a.id === p.id)
          if (v) v["active"] = true
        }
        for (const l2 of this.level2.data) {
          if (now > new Date(inicio.setDate(inicio.getDate() + l2.Duracion)) || l2.depId === 0) l2["active"] = true
          else l2["active"] = false
        }
        for (const l2 of this.level2.data) {
          let act = true
          let vacio = true
          for (const v of this.video.data) {
            if (l2.id === v.level2) {
              vacio = false
              if (!v["active"]) act = false
            }
          }
          if (!act || vacio) {
            const l2d = this.level2.data.filter((a: any) => a.depId === l2.id)
            for (const d of l2d) {
              d["active"] = false
            }
          }
        }
      }
    }
  }
}
