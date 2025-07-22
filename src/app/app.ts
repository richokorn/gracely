import { Component, OnInit, signal, WritableSignal } from '@angular/core';
import { TopbarComponent } from './components/topbar/topbar.component';
import { StoredData } from '../types/stored-data.type';
import { LangConfig } from '../types/lang-config.type';
import { TranslateService } from '@ngx-translate/core';
import { LangConfigService } from './services/lang-config.service';
import { MenuItemService } from './services/menu-item.service';
import { MenuItem } from 'primeng/api';
import { DataService } from './services/data.service';
import { WriterWidgetComponent } from './components/writer-widget/writer-widget.component';

@Component({
  selector: 'app-root',
  imports: [TopbarComponent, WriterWidgetComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  langConfig: WritableSignal<LangConfig> = signal<LangConfig>({} as LangConfig);
  menuItems: WritableSignal<MenuItem[]> = signal<MenuItem[]>([]);
  storedData: WritableSignal<StoredData> = signal<StoredData>({} as StoredData);

  constructor(
    private translateService: TranslateService,
    private langConfigService: LangConfigService,
    private menuItemService: MenuItemService,
    private dataService: DataService,
  ) {
    this.storedData.set(
      this.dataService.getLocalStorageData('gracely') || ({} as StoredData),
    );

    this.langConfig.set(this.langConfigService.getLangConfig());
    this.translateService.addLangs(this.langConfig().supportedLanguages);
    this.translateService.setDefaultLang(
      this.storedData().langConfig?.selectedLanguage ?? 'en',
    );
  }

  ngOnInit(): void {
    this.menuItems.set(this.menuItemService.getMenuItems());
  }
}
