import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel, IonInput, IonButton } from '@ionic/angular/standalone';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { Haptics,ImpactStyle } from '@capacitor/haptics';
import { NgClass, NgFor,NgIf } from '@angular/common';
import { Preferences } from '@capacitor/preferences';
import {IonModal} from '@ionic/angular/standalone';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonLabel,
            IonInput, IonButton, FormsModule, NgClass, NgFor, IonModal, NgIf],
})
export class HomePage {
  numero1: number = 0;
  numero2: number = 0;
  respuestaUsuario: number | null = null;
  resultadoCorrecto: number = 0;
  mensaje: string = '';
  puntaje: number = 0;
  vidas: number = 3;
  colorMensaje: string = 'white';
  nivel: number = 1;
  tiempo: number = 0;
  intervalo: any;
  rutSonidoCorrecto: string = 'assets/sounds/correcto.mp3';
  rutSonidoIncorrecto: string = 'assets/sounds/incorrecto.mp3';
  claseAnimacion: string = '';
  ranking: { nombre: string; puntaje: number }[] = [];
  mostrarModal: boolean = false;
  nombreJugador: string = '';
  estado: 'inicio' | 'jugando' | 'pausado' | 'fin' = 'inicio';

  ngOnInit() {
    this.cargarRanking();
  }

  iniciarJuego() {
    this.estado = 'jugando';

    this.puntaje = 0;
    this.vidas = 3;
    this.nivel = 1;
    this.mensaje = '';
    this.colorMensaje = 'white';

    this.generarPregunta();
  }

  pausarJuego() {
    this.estado = 'pausado';
    this.detenerTemporizador();
  }

  reanudarJuego() {
    this.estado = 'jugando';
    this.generarPregunta(); // 👈 nueva pregunta
  }

  async terminarJuego() {
    this.estado = 'fin';
    this.detenerTemporizador();
    this.mostrarModal = true;
  }

  //solo se debe de ejecutar una vez, no cada vez que se reinicie el juego, es para que borre el ranking viejo, si es que existiera, y se cargue el nuevo formato. --- IGNORE ---
  // async  ngOnInit() {
  //   await Preferences.remove({ key: 'ranking' }); // 🧹 limpiar viejo formato
  // await this.cargarRanking();
  // this.generarPregunta();
  // }


  async cargarRanking() {
    const { value } = await Preferences.get({ key: 'ranking' });
    this.ranking = value ? JSON.parse(value) : [];
  }

  generarPregunta() {
    let max = 10;

    if (this.nivel === 2) max = 20;
    if (this.nivel === 3) max = 50;

    this.numero1 = Math.floor(Math.random() * max);
    this.numero2 = Math.floor(Math.random() * max);
    this.resultadoCorrecto = this.numero1 + this.numero2;

    this.respuestaUsuario = null;
    this.mensaje = '';

    this.detenerTemporizador();
    this.iniciarTemporizador();
  }

  async validarRespuesta() {
    if (this.estado !== 'jugando') return;
    if (this.respuestaUsuario === this.resultadoCorrecto) {
      this.claseAnimacion = 'correcto';
      this.vibrarCorrecto();
      this.mensaje = '🎉 ¡Bien hecho!';
      this.colorMensaje = 'lightgreen';
      this.puntaje += 10;
      this.reproducirSonido(this.rutSonidoCorrecto);
      this.detenerTemporizador();
    } else {
      this.claseAnimacion = 'incorrecto';
      this.vibrarError();
      this.mensaje = '💥 ¡Intenta otra vez!';
      this.colorMensaje = 'red';
      this.vidas -= 1;
      this.reproducirSonido(this.rutSonidoIncorrecto);
    }

    setTimeout(() => {
      this.claseAnimacion = '';
    }, 300);

    if (this.vidas === 0) {
      await this.terminarJuego();
    }else {
      setTimeout(() => {
        this.generarPregunta();
      }, 1000);
    }

    if(this.puntaje >= 50) this.nivel = 2;
    if(this.puntaje >= 100) this.nivel = 3;
  }

  onInput(event: any) {
    const valor = event.detail.value;
    this.respuestaUsuario = valor ? Number(valor) : null;
  }

  reproducirSonido(ruta : string) {
    const audio = new Audio(ruta);
    audio.play();
  }

  iniciarTemporizador() {
    this.tiempo = 10;

    this.intervalo = setInterval(() => {
      if (this.estado !== 'jugando') return;

      this.tiempo--;

      if (this.tiempo === 0) {
        clearInterval(this.intervalo);

        this.mensaje = '⏰ Tiempo agotado';
        this.colorMensaje = 'orange';
        this.vidas--;
        if (this.vidas === 0) {
          this.terminarJuego();
        }
        this.reproducirSonido(this.rutSonidoIncorrecto);

        setTimeout(() => {
          this.generarPregunta();
        }, 1000);
      }
    }, 1000);
  }

  detenerTemporizador() {
    if (this.intervalo) {
      clearInterval(this.intervalo);
      this.intervalo = null;
    }
  }

  vibrarError() {
    Haptics.impact({ style: ImpactStyle.Heavy });
  }

  vibrarCorrecto() {
    Haptics.impact({ style: ImpactStyle.Light });
  }

  async guardarPuntaje(nombre: string) {
    const { value } = await Preferences.get({ key: 'ranking' });
    let ranking = value ? JSON.parse(value) : [];

    ranking.push({ nombre: nombre, puntaje: this.puntaje });
    // ordenar de mayor a menor
    ranking.sort((a: any, b: any) => b.puntaje - a.puntaje);
    // solo top 5
    ranking = ranking.slice(0, 5);
    await Preferences.set({
      key: 'ranking',
      value: JSON.stringify(ranking),
    });

    this.ranking = ranking;
  }

  // async finDelJuego() {
  //     this.mensaje = '💀 Juego Terminado';
  //     this.mostrarModal = true;
  //     // const nombre = prompt('Ingresa tu nombre:') || 'Jugador';
  // }

  async guardarDesdeModal() {
    const nombre = this.nombreJugador || 'Jugador';

    await this.guardarPuntaje(nombre);

    this.mostrarModal = false;
    this.nombreJugador = '';

    this.estado = 'inicio';
    this.puntaje = 0;
    this.vidas = 3;
    this.nivel = 1;
  }

  obtenerMedalla(index: number): string {
    if (index === 0) return '🥇';
    if (index === 1) return '🥈';
    if (index === 2) return '🥉';
    return '⭐';
  }

}
