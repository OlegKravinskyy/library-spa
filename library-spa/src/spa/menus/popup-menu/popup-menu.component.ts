import { Component, Input } from '@angular/core';
import { MenuService, MenuItem } from '../../services/menu.service';

@Component({
  selector: 'spa-popup-menu',
  templateUrl: './popup-menu.component.html',
  styleUrl: './popup-menu.component.css',
})
export class PopupMenuComponent {
  @Input() menu!: Array<MenuItem>;

  constructor(public menuService: MenuService) {}
}
