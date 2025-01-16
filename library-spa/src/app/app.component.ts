import { Component } from '@angular/core';
import {
  SpaConfigService,
  SpaConfigSettings,
} from '../spa/services/spa.config.service';
import { MenuService } from '../spa/services/menu.service';
import { AppMenuItems } from './app.menu';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'library-spa';

  constructor(
    private spaConfigService: SpaConfigService,
    menuService: MenuService
  ) {
    const config: SpaConfigSettings = {
      socialIcons: [
        {
          imageFile: 'src/images/logo.png',
          alt: 'Facebook',
          url: 'http://facebook.com',
        },
        {
          imageFile: 'src/images/logo.png',
          alt: 'Facebook',
          url: 'http://facebook.com',
        },
        {
          imageFile: 'src/images/logo.png',
          alt: 'Facebook',
          url: 'http://facebook.com',
        },
        {
          imageFile: 'src/images/logo.png',
          alt: 'Facebook',
          url: 'http://facebook.com',
        },
      ],
      showUserControls: true,
    };

    spaConfigService.configure(config);

    menuService.items = AppMenuItems;
  }
}
