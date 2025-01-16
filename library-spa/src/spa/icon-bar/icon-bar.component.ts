import { Component } from '@angular/core';
import { SpaConfigService } from '../services/spa.config.service';

@Component({
  selector: 'icon-bar',
  templateUrl: './icon-bar.component.html',
  styleUrl: './icon-bar.component.css',
})
export class IconBarComponent {
  showLoader = false;

  constructor(private spaConfigService: SpaConfigService) {}

  get socialIcons() {
    return this.spaConfigService.socialIcons;
  }

  get showUserControls() {
    return this.spaConfigService.showUserControls;
  }

  signOut() {
    console.log('Sign out');
  }
}
