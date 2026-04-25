import { Component, EventEmitter, HostBinding, HostListener, OnInit, Output, output } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import config from '../../../../capacitor.config';
import { IonHeader, IonToolbar, IonButtons, IonButton, IonTitle, IonIcon } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trophyOutline, settingsOutline } from 'ionicons/icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonButtons, IonButton, IonTitle,IonIcon,IonicModule],
})
export class HeaderComponent {
  @Output() ranking=new EventEmitter<void>();
  @Output() config=new EventEmitter<void>();
  @HostBinding('class.scrolled') isScrolled = false;
  @HostListener('window:scroll', [])
    onWindowScroll() {
      this.isScrolled = window.scrollY > 20;
    }

  constructor() {
    addIcons({
    'trophy-outline': trophyOutline,
    'settings-outline': settingsOutline
  });
  }



}
