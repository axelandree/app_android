import { Component, OnInit } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { StatusBar, Style } from '@capacitor/status-bar';
import { App } from '@capacitor/app';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent implements OnInit {

  constructor() {}

  async ngOnInit(){
    //Ocultar al iniciar
    await StatusBar.hide();

    //ocultar cuando regresa a la app
    App.addListener('appStateChange',async({isActive}) =>{
      if (isActive){
        await StatusBar.hide();
      }
    });

    //cuando el usuario toque la pantalla
    window.addEventListener('touchstart',async()=>{
      await StatusBar.hide();
    });

    //también para desktop (click)
    window.addEventListener('click',async()=>{
      await StatusBar.hide();
    });
  }
}


