import {
  signal,
  WritableSignal,
  effect,
  runInInjectionContext,
  EnvironmentInjector, Injector
} from '@angular/core';

export interface LocalStorageMap {
  gracely_welcome_changelog_dismissed: boolean;
  gracely_last_seen_version: string;
  gracely_permanent_text: string;
  gracely_chosen_language: string;
}

export function localStorageSignal<K extends keyof LocalStorageMap>(
  key: K,
  defaultValue: LocalStorageMap[K],
  injector: EnvironmentInjector
): WritableSignal<LocalStorageMap[K]> {

  const stored: string | null = localStorage.getItem(key);
  const initial: LocalStorageMap[K] = stored ? (JSON.parse(stored) as LocalStorageMap[K]) : defaultValue;

  const sig: WritableSignal<LocalStorageMap[K]> = signal<LocalStorageMap[K]>(initial);

  runInInjectionContext(injector, () => {
    effect(() => {
      localStorage.setItem(key, JSON.stringify(sig()));
    });
  });

  return sig;
}
