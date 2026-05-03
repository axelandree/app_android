import { Component,ViewChild, ElementRef } from '@angular/core';
import { IonModal } from '@ionic/angular/standalone';
import { trophy } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { FormsModule } from '@angular/forms';
import { Haptics,ImpactStyle } from '@capacitor/haptics';
import { NgIf } from '@angular/common';
import { Preferences } from '@capacitor/preferences';
import { App } from '@capacitor/app';
import { ConfigComponent } from '../components/config/config.component';
import { HeaderComponent } from '../components/header/header.component';
import { JuegoComponent } from '../components/juego/juego.component';
import { RankingComponent } from '../components/ranking/ranking.component';
import { GameoverComponent } from '../components/gameover/gameover.component';
import { PausaComponent } from '../components/pausa/pausa.component';
import { InicioComponent } from '../components/inicio/inicio.component';
import { IonicModule } from "@ionic/angular";

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  imports: [HeaderComponent,
    JuegoComponent,
    RankingComponent,
    ConfigComponent,
    GameoverComponent,
    PausaComponent,
    InicioComponent,
    IonModal,
    FormsModule,
    NgIf,
    IonicModule],
})
export class HomePage {
  @ViewChild('gameoverCmp') gameoverCmp!: any;
  numero1: number = 0;
  numero2: number = 0;
  respuestaUsuario: number | null = null;
  resultadoCorrecto: number = 0;
  mensaje: string = '';
  vidas: number = 3;
  colorMensaje: string = 'white';
  nivel: number = 1;
  tiempo: number = 0;
  intervalo: any;
  rutSonidoCorrecto: string = 'assets/sounds/correcto.mp3';
  rutSonidoIncorrecto: string = 'assets/sounds/incorrecto.mp3';
  rutSonidoGameOver: string = 'assets/sounds/gameover.mp3';
  rutSonidoTension: string = 'assets/sounds/tension.mp3';
  rutGame:string = 'assets/sounds/game.mp3';
  rutImgMusicActiva:string = 'assets/icon/musica-encendida.svg';
  rutImgMusicApagada:string = 'assets/icon/musica-apagada.svg';
  rutImgEffectActivo:string = 'assets/icon/efecto-encendido.svg';
  rutImgEffectApagado:string = 'assets/icon/efecto-apagado.svg';
  rutImgSalir:string = 'assets/icon/salir.svg';
  claseAnimacion: string = '';
  ranking: { nombre: string; puntaje: number }[] = [];
  puntaje: number = 0;
  monedaActual: number = 0;
  monedaTotal: number = 0;
  mostrarModal: boolean = false;
  nombreJugador: string = '';
  estado: 'inicio' | 'jugando' | 'pausado' | 'fin' = 'inicio';
  animarPregunta: boolean = false;
  tiempoMax: number = 10;
  animarBarra: boolean = true;
  @ViewChild('barra') barra!: ElementRef;
  esNuevoRecord: boolean = false;
  audioFondo: HTMLAudioElement | null = null;
  audioTension: HTMLAudioElement | null = null;
  mostrarRanking: boolean = false;
  startY: number = 0;
  desplazamientoY: number = 0;
  swipeActivo: boolean = false;
  mostrarConfig: boolean = false;
  musicaActiva: boolean = true;
  efectosActivos: boolean = true;
  headerScrolled = false;

  constructor() {
    addIcons({ trophy });
  }

  fadeOut(audio: HTMLAudioElement, tipo: 'fondo' | 'tension' = 'fondo') {
    let vol = audio.volume;

    const fade = setInterval(() => {
      if (vol > 0.05) {
        vol -= 0.05;
        audio.volume = vol;
      } else {
        audio.pause();
        clearInterval(fade);
      }
    }, 50);

    if(tipo==='fondo') this.audioFondo = null;
    if(tipo==='tension') this.audioTension = null;
  }

  ngOnInit() {
    this.cargarRanking();
    this.cargarMoneda();
    //solo se debe de ejecutar una vez, no cada vez que se reinicie el juego, es para que borre el ranking viejo, si es que existiera, y se cargue el nuevo formato.
    //async  ngOnInit()
    // await Preferences.remove({ key: 'ranking' });
    // await Preferences.remove({ key: 'monedaTotal' });
    App.addListener('appStateChange', ({ isActive }) => {

      if (!isActive) {
        // 🔽 App en segundo plano
        if (this.estado === 'jugando') {
          this.pausarJuego();
        }
      }
    });
  }

  onScroll(event: any) {
    this.headerScrolled = event.detail.scrollTop > 20;
  }

  abrirRanking() {
    this.desplazamientoY = 0;
    this.mostrarRanking = true;
  }

  cerrarRanking() {
    this.mostrarRanking = false;
    this.desplazamientoY = 0;
  }

  iniciarMusica() {
    if (!this.musicaActiva) return;
    if(this.audioFondo) return; // 🎵 ya suena

    this.audioFondo = new Audio(this.rutGame);
    this.audioFondo.loop = true;
    this.audioFondo.volume = 0.4;
    this.audioFondo.play();
  }

  activarTension() {
    if (this.audioFondo) {
      this.fadeOut(this.audioFondo, 'fondo');
      this.audioFondo = null;
    }

    if (this.audioTension) {
      this.fadeOut(this.audioTension, 'tension');
      this.audioTension = null;
    }

      this.audioTension = new Audio(this.rutSonidoTension);
      this.audioTension.loop = true;
      this.audioTension.volume = 0.6;
      this.audioTension.play();
  }

  detenerMusica() {
    if (this.audioFondo) this.fadeOut(this.audioFondo, 'fondo');
    if (this.audioTension) this.fadeOut(this.audioTension, 'tension');
  }

  iniciarJuego() {
    this.estado = 'jugando';
    this.puntaje = 0;
    this.vidas = 3;
    this.nivel = 1;
    this.mensaje = '';
    this.colorMensaje = 'white';

    this.detenerMusica();
    this.iniciarMusica();
    this.generarPregunta();
  }

  pausarJuego() {
    this.estado = 'pausado';
    this.detenerTemporizador();

    if (this.audioFondo) this.fadeOut(this.audioFondo, 'fondo');
    if (this.audioTension) this.fadeOut(this.audioTension, 'tension');
  }

  reanudarJuego() {
    this.estado = 'jugando';

    if (this.tiempo <= 3) {
      this.activarTension();
    } else {
      this.iniciarMusica();
    }

    this.generarPregunta(); // 👈 nueva pregunta
  }

  async guardarYReiniciar() {
    const nombre = this.nombreJugador || 'Jugador';
    await this.guardarPuntaje(nombre);

    this.nombreJugador = '';
    this.reiniciarJuego();
  }

  async terminarJuego() {
    this.detenerTemporizador();
    this.detenerMusica();
    // this.mostrarModal = true;
    this.reproducirSonido(this.rutSonidoGameOver);

    // 🔍 validar ranking
    const { value } = await Preferences.get({ key: 'ranking' });
    const ranking = value ? JSON.parse(value) : [];

    if (ranking.length < 5) {
      this.esNuevoRecord = true;
    } else {
      const menor = ranking[ranking.length - 1].puntaje;
      this.esNuevoRecord = this.puntaje > menor;
    }

    this.guardarMoneda();
    this.estado = 'fin';
  }

  async cargarRanking() {
    const { value } = await Preferences.get({ key: 'ranking' });
    this.ranking = value ? JSON.parse(value) : [];
  }

  async cargarMoneda(){
    const { value } = await Preferences.get({ key:'monedaTotal'});
    this.monedaTotal = value ? JSON.parse(value) : 0;
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

    if (this.audioTension) {
      this.fadeOut(this.audioTension, 'tension');
      this.audioTension = null;
    }

    this.iniciarMusica();

    this.animarPregunta = true;
     setTimeout(() => {
      this.animarPregunta = false;
    }, 300);

    if (this.barra?.nativeElement) {
      // ❌ quitar animación
      this.barra.nativeElement.style.transition = 'none';
      // 🔄 recargar instantáneo
      this.tiempo = this.tiempoMax;
      // ⚡ forzar render (MUY IMPORTANTE)
      this.barra.nativeElement.offsetHeight;
      // ✅ volver animación suave
      this.barra.nativeElement.style.transition = 'width 0.9s linear';
    }

    // ⏱️ Timer
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

    // if(this.puntaje >= 50) this.nivel = 2;
    // if(this.puntaje >= 100) this.nivel = 3;
    this.nivel = Math.floor(this.puntaje / 50) + 1;
    this.monedaActual = Math.floor(this.puntaje / 50) * 3;
  }

  onInput(valor: number | null) {
    this.respuestaUsuario = valor;
  }

  reproducirSonido(ruta : string) {
    if (!this.efectosActivos) return;

    const audio = new Audio(ruta);
    audio.play();
  }

  iniciarTemporizador() {
    this.tiempo = this.tiempoMax;

    this.intervalo = setInterval(() => {
      if (this.estado !== 'jugando') {
        this.detenerTemporizador();
        return;
      }

      this.tiempo--;

      if (this.tiempo === 3) {
        this.activarTension(); // ⚠️ últimos segundos
      }

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

  async guardarMoneda(){
    const { value } = await Preferences.get({ key:'monedaTotal'});
    let monedaGuardada = value ? JSON.parse(value) : 0;

    this.monedaTotal =  monedaGuardada + this.monedaActual;

    await Preferences.set({
      key: 'monedaTotal',
      value: JSON.stringify(this.monedaTotal),
    });

    this.monedaActual = 0;
  }

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

  salirJuego() {
    this.detenerTemporizador();
    this.estado = 'inicio';
  }

  reiniciarJuego() {
    this.detenerMusica();
    this.puntaje = 0;
    this.vidas = 3;
    this.nivel = 1;
    this.mensaje = '';
    this.estado = 'jugando';

    this.iniciarMusica();
    this.generarPregunta();
  }

  abrirConfig() {
    this.mostrarConfig = true;
  }

  cerrarConfig() {
    this.mostrarConfig = false;
  }

  toggleMusica() {
    this.musicaActiva = !this.musicaActiva;

    if (!this.musicaActiva) {
      this.detenerMusica();
    } else {
      this.iniciarMusica();
    }
  }

  toggleEfectos() {
    this.efectosActivos = !this.efectosActivos;
  }

  salirApp() {
    App.exitApp(); // 👈 esto cierra la app
  }

  salirConAnimacion() {
    const btn = document.querySelector('.salir');

    if (btn) {
      btn.classList.add('ios-click');

      setTimeout(() => {
        btn.classList.remove('ios-click');
      }, 250);
    }

    // 📳 vibración ligera (iOS feel)
    this.vibrarCorrecto();

    // ⏳ pequeño delay para que se sienta natural
    setTimeout(() => {
      this.salirApp();
    }, 200);
  }

  onGameOverOpen() {
    // pequeño delay para evitar bug de animación
    setTimeout(() => {
      this.gameoverCmp?.focusInput();
    }, 100);
  }

}
