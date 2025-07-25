import { effect, Injectable, signal, WritableSignal } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export interface AppState {
  preset: string;
  primary: string;
  surface: string | undefined | null;
  darkMode: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  _appState: AppState = {
    preset: 'Aura',
    primary: 'emerald',
    surface: null,
    darkMode: false,
  };

  appState: WritableSignal<AppState> = signal<AppState>(this._appState);

  transitionComplete: WritableSignal<boolean> = signal<boolean>(false);

  private initialized: boolean = false;

  private appStateUpdate: Subject<AppState> = new Subject<AppState>();

  appStateUpdate$: Observable<AppState> = this.appStateUpdate.asObservable();

  constructor() {
    effect(() => {
      const appState: AppState = this.appState();
      if (appState) {
        this.onAppStateUpdate();
      }
    });

    effect(() => {
      const state: AppState = this.appState();

      if (!this.initialized || !state) {
        this.initialized = true;
        return;
      }

      this.handleDarkModeTransition(state);
    });
  }

  toggleDarkMode(appState?: AppState): void {
    const _appState: AppState = appState || this.appState();
    if (_appState.darkMode) {
      document.documentElement.classList.add('p-dark');
    } else {
      document.documentElement.classList.remove('p-dark');
    }
  }

  onAppStateUpdate() {
    this._appState = { ...this.appState() };
    this.appStateUpdate.next(this.appState());
    this.toggleDarkMode();
  }

  private handleDarkModeTransition(config: AppState): void {
    if ((document as any).startViewTransition) {
      this.startViewTransition(config);
    } else {
      this.toggleDarkMode(config);
      this.onTransitionEnd();
    }
  }

  private startViewTransition(config: AppState): void {
    const transition: any = (document as any).startViewTransition(() => {
      this.toggleDarkMode(config);
    });

    transition.ready
      .then(() => {
        this.onTransitionEnd();
      })
      .catch(() => {});
  }

  private onTransitionEnd() {
    this.transitionComplete.set(true);
    setTimeout(() => {
      this.transitionComplete.set(false);
    });
  }
}
