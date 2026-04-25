import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgIf } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { IonToggle } from '@ionic/angular/standalone';

@Component({
  selector: 'app-config',
  templateUrl: './config.component.html',
  styleUrls: ['./config.component.scss'],
  standalone: true,
  imports: [IonicModule, NgIf,IonToggle]
})
export class ConfigComponent    {
  @Input() visible: boolean = false;
  @Input() musicaActiva: boolean = true;
  @Input() efectosActivos: boolean = true;

  @Output() cerrar = new EventEmitter<void>();
  @Output() toggleMusica = new EventEmitter<void>();
  @Output() toggleEfectos = new EventEmitter<void>();
  @Output() salir = new EventEmitter<void>();

  rutImgMusicOn:string = 'assets/icon/musica-encendida.svg';
  rutImgMusicOff:string = 'assets/icon/musica-apagada.svg';
  rutImgEffectOn:string = 'assets/icon/efecto-encendido.svg';
  rutImgEffectOff:string = 'assets/icon/efecto-apagado.svg';

  rutImgSalir:string = 'assets/icon/salir.svg';

  constructor() { }

  cerrarModal() {
    this.cerrar.emit();
  }
}
