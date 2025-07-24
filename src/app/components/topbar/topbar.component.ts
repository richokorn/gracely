import {
  Component,
  computed,
  inject,
  input,
  InputSignal,
  Signal,
} from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LangConfig } from '../../../types/lang-config.type';
import { ButtonModule } from 'primeng/button';
import { AppState, LayoutService } from '../../services/layout.service';
import { Select, SelectModule } from 'primeng/select';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { SettingsConfigComponent } from '../settings-config/settings-config.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-topbar',
  imports: [
    CommonModule,
    ButtonModule,
    StyleClassModule,
    SettingsConfigComponent,
    ButtonModule,
    ConfirmDialogModule,
    SelectModule,
    TranslateModule,
    FormsModule,
    Select,
  ],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.scss',
  host: { class: 'topbar' },
})
export class TopbarComponent {
  layoutService: LayoutService = inject(LayoutService);
  langConfig: InputSignal<LangConfig> = input.required();
  isDarkMode: Signal<boolean> = computed(
    () => this.layoutService.appState().darkMode,
  );
  menuItems: InputSignal<MenuItem[]> = input.required();

  toggleDarkMode() {
    this.layoutService.appState.update((state: AppState) => ({
      ...state,
      darkMode: !state.darkMode,
    }));
  }
}
