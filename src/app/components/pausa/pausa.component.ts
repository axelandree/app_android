import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-pausa',
  templateUrl: './pausa.component.html',
  styleUrls: ['./pausa.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf],
})
export class PausaComponent   {
  @Input() visible: boolean = false;

  @Output() reanudar = new EventEmitter<void>();
  @Output() salir = new EventEmitter<void>();

  constructor() { }

}
