import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNG } from 'primeng/config';

@Injectable({
  providedIn: 'root',
})
export class LangConfigService {
  constructor(
    private translateService: TranslateService,
    private primeNGConfig: PrimeNG,
  ) {}

  getLangConfig(userDefLang: string = 'en') {
    return {
      supportedLanguages: ['en', 'de'],
      selectedLanguage: userDefLang,
      translate: (lang: string) => {
        this.translateService.use(lang);
        this.translateService.get('primeng').subscribe((res: any) => {
          this.primeNGConfig.setTranslation(res);
        });
      },
    };
  }
}
