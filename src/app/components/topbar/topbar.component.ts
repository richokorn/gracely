import { Component, computed, inject, input, InputSignal } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LangConfig } from '../../../types/lang-config.type';
import { Button } from 'primeng/button';
import { LayoutService } from '../../services/layout.service';
import { Select } from 'primeng/select';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { StyleClass } from 'primeng/styleclass';
import { SettingsConfigComponent } from '../settings-config/settings-config.component';

@Component({
  selector: 'app-topbar',
  imports: [
    Button,
    Select,
    TranslatePipe,
    FormsModule,
    NgClass,
    StyleClass,
    SettingsConfigComponent,
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  host: { class: 'topbar' },
})
export class TopbarComponent {
  layoutService: LayoutService = inject(LayoutService);
  langConfig: InputSignal<LangConfig> = input.required();
  isDarkMode = computed(() => this.layoutService.appState().darkMode);
  menuItems: InputSignal<MenuItem[]> = input.required();

  toggleDarkMode() {
    this.layoutService.appState.update((state) => ({
      ...state,
      darkMode: !state.darkMode,
    }));
  }
}
