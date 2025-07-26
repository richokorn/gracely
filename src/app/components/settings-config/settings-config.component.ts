import {
  Component,
  computed,
  inject,
  input,
  Input,
  InputSignal,
  OnInit,
  PLATFORM_ID,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import Aura from '@primeng/themes/aura';
import Lara from '@primeng/themes/lara';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { $t, updatePreset, updateSurfacePalette } from '@primeuix/themes';
import { PrimeNG } from 'primeng/config';
import { LayoutService } from '../../services/layout.service';
import { SelectButtonModule } from 'primeng/selectbutton';
import { DrawerModule } from 'primeng/drawer';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RippleModule } from 'primeng/ripple';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { surfacesExport, SurfacesType } from './settings-config-presets';
import { AuraBaseTokenSections } from '@primeuix/themes/aura/base';
import { LaraBaseTokenSections } from '@primeuix/themes/lara/base';
import { Divider } from 'primeng/divider';
import { TranslatePipe } from '@ngx-translate/core';
import { Dialog } from 'primeng/dialog';
import { WriterService } from '../../services/writer.service';
import { Select } from 'primeng/select';
import { LangConfig } from '../../../types/lang-config.type';

const presets = {
  Aura,
  Lara,
} as const;

declare type KeyOfType<T> = keyof T extends infer U ? U : never;

@Component({
  selector: 'app-settings-config',
  imports: [
    CommonModule,
    FormsModule,
    SelectButtonModule,
    DrawerModule,
    ToggleSwitchModule,
    RadioButtonModule,
    RippleModule,
    ButtonModule,
    Divider,
    TranslatePipe,
    Dialog,
    Select,
  ],
  templateUrl: './settings-config.component.html',
  styleUrl: './settings-config.component.scss',
  host: {
    class: 'config-panel',
  },
})
export class SettingsConfigComponent implements OnInit {
  @Input() simple: boolean = false;
  langConfig: InputSignal<LangConfig> = input.required();

  writerService: WriterService = inject(WriterService);
  resetTextDialogVisible: WritableSignal<boolean> = signal(false);

  config: PrimeNG = inject(PrimeNG);

  layoutService: LayoutService = inject(LayoutService);

  platformId: Object = inject(PLATFORM_ID);

  primeng: PrimeNG = inject(PrimeNG);

  presets: string[] = Object.keys(presets);
  surfaces: SurfacesType[] = surfacesExport;

  selectedPrimaryColor = computed(() => {
    return this.layoutService.appState().primary;
  });

  selectedPreset: Signal<string> = computed(
    () => this.layoutService.appState().preset,
  );
  isDarkMode: Signal<boolean> = computed(
    () => this.layoutService.appState().darkMode,
  );
  selectedSurface: Signal<string | undefined | null> = computed(
    () => this.layoutService.appState().surface,
  );
  primaryColors: Signal<SurfacesType[]> = computed<SurfacesType[]>(() => {
    const presetPalette:
      | AuraBaseTokenSections.Primitive
      | LaraBaseTokenSections.Primitive
      | undefined =
      presets[this.layoutService.appState().preset as KeyOfType<typeof presets>]
        .primitive;
    const colors = [
      'emerald',
      'green',
      'lime',
      'orange',
      'amber',
      'yellow',
      'teal',
      'cyan',
      'sky',
      'blue',
      'indigo',
      'violet',
      'purple',
      'fuchsia',
      'pink',
      'rose',
    ];
    const palettes: SurfacesType[] = [];

    colors.forEach((color) => {
      palettes.push({
        name: color,
        palette: presetPalette?.[
          color as KeyOfType<typeof presetPalette>
        ] as SurfacesType['palette'],
      });
    });

    return palettes;
  });

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.onPresetChange(this.layoutService.appState().preset);
    }
  }

  getPresetExt() {
    const color: SurfacesType =
      this.primaryColors().find(
        (c) => c.name === this.selectedPrimaryColor(),
      ) || {};

    if (color.name === 'noir') {
      return {
        semantic: {
          primary: {
            50: '{surface.50}',
            100: '{surface.100}',
            200: '{surface.200}',
            300: '{surface.300}',
            400: '{surface.400}',
            500: '{surface.500}',
            600: '{surface.600}',
            700: '{surface.700}',
            800: '{surface.800}',
            900: '{surface.900}',
            950: '{surface.950}',
          },
          colorScheme: {
            light: {
              primary: {
                color: '{primary.950}',
                contrastColor: '#ffffff',
                hoverColor: '{primary.800}',
                activeColor: '{primary.700}',
              },
              highlight: {
                background: '{primary.950}',
                focusBackground: '{primary.700}',
                color: '#ffffff',
                focusColor: '#ffffff',
              },
            },
            dark: {
              primary: {
                color: '{primary.50}',
                contrastColor: '{primary.950}',
                hoverColor: '{primary.200}',
                activeColor: '{primary.300}',
              },
              highlight: {
                background: '{primary.50}',
                focusBackground: '{primary.300}',
                color: '{primary.950}',
                focusColor: '{primary.950}',
              },
            },
          },
        },
      };
    } else {
      return {
        semantic: {
          primary: color.palette,
          colorScheme: {
            light: {
              primary: {
                color: '{primary.500}',
                contrastColor: '#ffffff',
                hoverColor: '{primary.600}',
                activeColor: '{primary.700}',
              },
              highlight: {
                background: '{primary.50}',
                focusBackground: '{primary.100}',
                color: '{primary.700}',
                focusColor: '{primary.800}',
              },
            },
            dark: {
              primary: {
                color: '{primary.400}',
                contrastColor: '{surface.900}',
                hoverColor: '{primary.300}',
                activeColor: '{primary.200}',
              },
              highlight: {
                background:
                  'color-mix(in srgb, {primary.400}, transparent 84%)',
                focusBackground:
                  'color-mix(in srgb, {primary.400}, transparent 76%)',
                color: 'rgba(255,255,255,.87)',
                focusColor: 'rgba(255,255,255,.87)',
              },
            },
          },
        },
      };
    }
  }

  updateColors(event: any, type: string, color: any) {
    if (type === 'primary') {
      this.layoutService.appState.update((state: any) => ({
        ...state,
        primary: color.name,
      }));
    } else if (type === 'surface') {
      this.layoutService.appState.update((state: any) => ({
        ...state,
        surface: color.name,
      }));
    }
    this.applyTheme(type, color);

    event.stopPropagation();
  }

  applyTheme(type: string, color: any) {
    if (type === 'primary') {
      updatePreset(this.getPresetExt());
    } else if (type === 'surface') {
      updateSurfacePalette(color.palette);
    }
  }

  onPresetChange(event: any) {
    this.layoutService.appState.update((state: any) => ({
      ...state,
      preset: event,
    }));
    const preset = presets[event as KeyOfType<typeof presets>];
    const surfacePalette = this.surfaces.find(
      (s) => s.name === this.selectedSurface(),
    )?.palette;
    $t()
      .preset(preset)
      .preset(this.getPresetExt())
      .surfacePalette(surfacePalette)
      .use({ useDefaultOptions: true });
  }

  toggleDarkMode() {
    this.executeDarkModeToggle();
  }

  executeDarkModeToggle() {
    this.layoutService.appState.update((state) => ({
      ...state,
      darkMode: !state.darkMode,
    }));
  }
}
