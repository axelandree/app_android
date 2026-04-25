import { Component, EventEmitter, Input,  Output, ViewEncapsulation } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-gameover',
  templateUrl: './gameover.component.html',
  styleUrls: ['./gameover.component.scss'],
  standalone: true,
  imports: [NgIf, FormsModule, IonicModule],
  encapsulation: ViewEncapsulation.None
})
export class GameoverComponent  {
  @Input() visible: boolean = false;
  @Input() puntaje: number = 0;
  @Input() esNuevoRecord: boolean = false;
  @Input() nombreJugador: string = '';

  @Output() nombreJugadorChange = new EventEmitter<string>();
  @Output() guardar = new EventEmitter<void>();
  @Output() reiniciar = new EventEmitter<void>();

  constructor() { }

  onNombreChange(valor: string | null |undefined) {
    this.nombreJugador = valor?? '';
    this.nombreJugadorChange.emit(this.nombreJugador);
  }

}
