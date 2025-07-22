import { Injectable } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class MenuItemService {
  getMenuItems(): MenuItem[] {
    return []; // tbd
  }
}
