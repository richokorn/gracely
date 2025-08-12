import { computed, effect, EnvironmentInjector, inject, Injectable, Signal, signal, WritableSignal } from '@angular/core';
import { APP_VERSION } from '../../version';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { localStorageSignal } from './local-storage-signal';

@Injectable({
  providedIn: 'root',
})
export class AppStateService {
  private env: EnvironmentInjector = inject(EnvironmentInjector);
  private http: HttpClient = inject(HttpClient);

  readonly dismissedOnce: WritableSignal<boolean> = localStorageSignal('gracely_welcome_changelog_dismissed', false, this.env);
  readonly lastSeenVersion: WritableSignal<string> = localStorageSignal('gracely_last_seen_version', '', this.env);

  readonly shouldShowChangelog: Signal<boolean> = computed(() =>
    !this.dismissedOnce() || this.lastSeenVersion() !== APP_VERSION
  );

  readonly changelogVisible: WritableSignal<boolean> = signal(this.shouldShowChangelog());

  getChangelog(): Observable<ChangelogEntry[]> {
    return this.http.get<ChangelogEntry[]>('assets/changelog.json');
  }

  constructor() {
    effect(() => {
      this.changelogVisible.set(this.shouldShowChangelog());
    });
  }

  markChangelogDismissed(): void {
    this.dismissedOnce.set(true);
    this.lastSeenVersion.set(APP_VERSION);
  }

  resetChangelogState(): void {
    this.dismissedOnce.set(false);
    this.lastSeenVersion.set('');
  }
}

export interface ChangelogEntry {
  date: string;
  entries: string[];
}
