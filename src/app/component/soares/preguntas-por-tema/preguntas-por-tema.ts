// Componente que muestra las preguntas agrupadas por tema y permite expandir cada grupo para ver las preguntas
// Agrupa las preguntas por tema usando palabras clave
import { Component, OnInit, computed, signal } from '@angular/core';
import { ISoares } from '../../../model/soares';
import { SoaresService } from '../../../service/soares';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-preguntas-por-tema',
  templateUrl: './preguntas-por-tema.html',
  styleUrl: './preguntas-por-tema.css',
  standalone: true,
  imports: [CommonModule],
})
export class PreguntasPorTemaComponent implements OnInit {
  soaresList = signal<ISoares[]>([]);
  temas = signal<Array<{ tema: string, preguntas: ISoares[], expanded: boolean }>>([]);
  error = signal<string|null>(null);

  toggleExpand(index: number): void {
    const arr = [...this.temas()];
    arr[index] = { ...arr[index], expanded: !arr[index].expanded };
    this.temas.set(arr);
  }

  iniciarEdicion(pregunta: ISoares) {
  }

  cancelarEdicion() {
    this.error.set(null);
  }


  constructor(private soaresService: SoaresService) {}

  ngOnInit(): void {
    this.soaresService.getPageUser(0, 1000, 'fechaCreacion', 'desc', '').subscribe({
      next: resp => {
        this.soaresList.set(resp.content);
        this.temas.set(this.agruparPorTema(resp.content));
      }
    });
  }

  agruparPorTema(preguntas: ISoares[]): Array<{ tema: string, preguntas: ISoares[], expanded: boolean }> {
    const temasMap = new Map<string, ISoares[]>();
    preguntas.forEach(p => {
      const palabras = p.preguntas.split(/\W+/).filter(w => w.length > 4);
      const tema = palabras.length ? palabras[0].toLowerCase() : 'general';
      if (!temasMap.has(tema)) temasMap.set(tema, []);
      temasMap.get(tema)!.push(p);
    });
    return Array.from(temasMap.entries()).map(([tema, preguntas]) => ({ tema, preguntas, expanded: false }));
  }
}
