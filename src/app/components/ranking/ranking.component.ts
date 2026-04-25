import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-ranking',
  templateUrl: './ranking.component.html',
  styleUrls: ['./ranking.component.scss'],
  standalone: true,
  imports: [NgFor, NgClass, NgIf]
})
export class RankingComponent {

  @Input() ranking:  { nombre: string; puntaje: number }[] = [];
  @Input() visible: boolean = false;

  @Output() cerrar = new EventEmitter<void>();

  startY = 0;
  desplazamientoY = 0;

  constructor() { }

  obtenerMedalla(index: number): string {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '⭐';
  }

  cerrarModal() {
    this.cerrar.emit();
  }

  onTouchStart(event: TouchEvent) {
    this.startY = event.touches[0].clientY;
  }

  onTouchMove(event: TouchEvent) {
    const currentY = event.touches[0].clientY;
    this.desplazamientoY = currentY - this.startY;

    if (this.desplazamientoY < 0) {
      this.desplazamientoY = 0;
    }
  }

  onTouchEnd() {
    if (this.desplazamientoY > 100) {
      this.cerrarModal();
    }
    this.desplazamientoY = 0;
  }


}
