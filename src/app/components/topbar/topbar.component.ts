import { Component, input, InputSignal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LangConfig } from '../../../types/lang-config.type';

@Component({
  selector: 'app-topbar',
  imports: [],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
})
export class TopbarComponent {
  langConfig: InputSignal<LangConfig> = input.required();
  menuItems: InputSignal<MenuItem[]> = input.required();
}
