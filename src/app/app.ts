import { Component, signal, WritableSignal } from '@angular/core';
import { TopbarComponent } from './components/topbar/topbar.component';
import { LangConfig } from '../types/lang-config.type';
import { TranslateService } from '@ngx-translate/core';
import { LangConfigService } from './services/lang-config.service';
import { WriterWidgetComponent } from './components/writer-widget/writer-widget.component';
import { AppStateService } from './services/app-state.service';
import { localStorageSignal } from './services/local-storage.signal';
import { WelcomeChangelogComponent } from './components/welcome-changelog/welcome-changelog.component';

@Component({
  selector: 'app-root',
  imports: [
    TopbarComponent,
    WriterWidgetComponent,
    WelcomeChangelogComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  langConfig: WritableSignal<LangConfig> = signal<LangConfig>({} as LangConfig);

  constructor(
    public appStateService: AppStateService,
    private translateService: TranslateService,
    private langConfigService: LangConfigService,
  ) {
    this.langConfig.set(this.langConfigService.getLangConfig());
    this.translateService.addLangs(this.langConfig().supportedLanguages);
    this.translateService.setDefaultLang(
      localStorageSignal(
        'gracely_language',
        'en',
        this.appStateService['env'],
      )() ?? 'en',
    );
  }
}
