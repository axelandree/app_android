import { Component, EventEmitter, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.scss'],
  standalone: true,
  imports: [IonicModule],
})
export class InicioComponent  {
  @Output() iniciar = new EventEmitter<void>();

  constructor() { }

  ngOnInit() {}

}
