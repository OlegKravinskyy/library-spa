import { MenuItem } from '../spa/services/menu.service';

export const AppMenuItems: Array<MenuItem> = [
  {
    text: 'Authors',
    route: '/authors',
    submenu: [],
  },

  {
    text: 'Genres',
    route: '/genres',
    submenu: [],
  },
  { text: 'Home', route: '/home', submenu: [] },
];
