import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';
import { IonInput } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.scss'],
  standalone: true,
  imports: [IonicModule,FormsModule]
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

  @ViewChild('respuestaInput' ) input!: ElementRef;

  constructor() { }

  onInputChange(valor: string | null | undefined) {
    if (valor === '' || valor === null || valor === undefined) {
    this.respuesta.emit(null);
    return;
  }

  const numero = parseInt(valor, 10);

  this.respuesta.emit(isNaN(numero) ? null : numero);
  }

  focusInput() {
    this.input?.nativeElement.focus();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.input?.nativeElement.focus();
    }, 300);
  }

  ionViewDidEnter() {
    setTimeout(() => {
     this.input?.nativeElement.focus();
    }, 300);
  }
}

