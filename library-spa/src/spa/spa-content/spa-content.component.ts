import { Component } from '@angular/core';
import { ScreenService } from '../services/screen.service';
import { MenuService } from '../services/menu.service';

@Component({
  selector: 'spa-content',
  templateUrl: './spa-content.component.html',
  styleUrl: './spa-content.component.css',
})
export class SpaContentComponent {
  constructor(
    public screenService: ScreenService,
    public menuService: MenuService
  ) {}
}
