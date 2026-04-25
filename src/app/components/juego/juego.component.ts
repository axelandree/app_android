import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.scss'],
  standalone: true,
  imports: [IonicModule]
})
export class JuegoComponent  {
  @Input() numero1!: number;
  @Input() numero2!: number;
  @Input() nivel!: number;
  @Input() puntaje!: number;
  @Input() vidas!: number;
  @Input() tiempo!: number;
  @Input() tiempoMax!: number;
  @Input() respuestaUsuario!: number | null;

  @Output() respuesta = new EventEmitter<number | null >();
  @Output() validar = new EventEmitter<void>();
  @Output() pausar = new EventEmitter<void>();

  constructor() { }

  onInputChange(valor: string | null | undefined) {
    const numero = valor ? Number(valor) : null;
    this.respuesta.emit(numero);
  }
}
