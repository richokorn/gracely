import { Component } from '@angular/core';
import { AppStateService, ChangelogEntry } from '../../services/app-state.service';
import { Accordion, AccordionContent, AccordionHeader, AccordionPanel } from 'primeng/accordion';
import { Dialog } from 'primeng/dialog';
import { TranslatePipe } from '@ngx-translate/core';
import { Divider } from 'primeng/divider';
import { BrandingComponent } from '../branding/branding.component';

@Component({
  selector: 'app-welcome-changelog',
  imports: [
    Accordion,
    AccordionPanel,
    AccordionHeader,
    AccordionContent,
    Dialog,
    TranslatePipe,
    Divider,
    BrandingComponent,
  ],
  templateUrl: './welcome-changelog.component.html',
  styleUrl: './welcome-changelog.component.scss',
})
export class WelcomeChangelogComponent {
  changelogEntries: ChangelogEntry[] = [];

  constructor(public appStateService: AppStateService) {
    this.appStateService.getChangelog().subscribe((data: ChangelogEntry[]) => {
      console.log('Changelog data loaded:', data);
      this.changelogEntries = data;
    });
  }

  hideWelcomeChangelog() {
    this.appStateService.markChangelogDismissed();
  }
}
