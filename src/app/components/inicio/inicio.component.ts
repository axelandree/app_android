import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class InicioComponent  {
  @Input() ranking:  { nombre: string; puntaje: number }[] = [];
  @Input() monedaTotal: number = 0;
  @Output() iniciar = new EventEmitter<void>();

  rutImgMoneda:string = 'assets/image/moneda1.png';

  constructor() { }

  obtenerRankingTop(): number {
    if (!this.ranking || this.ranking.length === 0) {
      return 0;
    }

    return this.ranking.reduce(
      (maxPuntaje, item) => item.puntaje > maxPuntaje ? item.puntaje : maxPuntaje,
      this.ranking[0].puntaje
    );
  }

}
