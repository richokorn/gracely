import {
  computed,
  effect,
  ElementRef,
  EnvironmentInjector,
  inject,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { TimedChar } from '../../types/timed-char.type';
import { localStorageSignal } from './local-storage.signal';

@Injectable({
  providedIn: 'root',
})
export class WriterService {
  readonly _placeholder: WritableSignal<string> = signal<string>(
    this.generatePlaceholder(),
  );
  private env: EnvironmentInjector = inject(EnvironmentInjector);

  private readonly lockDelayMs: number = 5000; // ms
  private readonly _now: WritableSignal<number> = signal<number>(Date.now());
  private readonly _currentText: WritableSignal<TimedChar[]> = signal<
    TimedChar[]
  >([]);

  private readonly _permanentText: WritableSignal<string> = localStorageSignal(
    'gracely_permanent_text',
    '',
    this.env,
  );

  readonly _currentFontSize: WritableSignal<string> = localStorageSignal(
    'gracely_font_size',
    '16',
    this.env,
  );

  readonly _currentFontFamily: WritableSignal<string> = localStorageSignal(
    'gracely_font_family',
    'monospace',
    this.env,
  );
  readonly _currentLetterSpacing: WritableSignal<string | number> =
    localStorageSignal('gracely_letter_spacing', 'normal', this.env);

  readonly combinedText: Signal<string> = computed(
    () =>
      this._permanentText() +
      this._currentText()
        .map((c: TimedChar) => c.char)
        .join(''),
  );

  private _textAreaEl!: HTMLTextAreaElement;

  constructor() {
    // Ticks the timer, promotes expired chars, and updates the UI.
    // We no longer write to localStorage here; _permanentText syncs itself.
    effect(() => {
      const interval: number = setInterval(() => {
        this._now.set(Date.now());
        this.promoteExpiredText();
      }, 500);
      return () => clearInterval(interval);
    });
  }

  registerTextArea(el: ElementRef<HTMLTextAreaElement>) {
    this._textAreaEl = el.nativeElement;
  }

  resetText(): void {
    navigator.clipboard.writeText(this.combinedText());
    this._currentText.set([]);
    this._permanentText.set('');
    this._placeholder.set(this.generatePlaceholder());
    this.updateTextarea();
  }

  promoteExpiredText() {
    const now: number = this._now();
    const expired: TimedChar[] = this._currentText().filter(
      (c: TimedChar) => c.expiresAt <= now,
    );

    if (expired.length > 0) {
      const fresh: TimedChar[] = this._currentText().filter(
        (c: TimedChar) => c.expiresAt > now,
      );

      this._permanentText.set(
        this._permanentText() + expired.map((c: TimedChar) => c.char).join(''),
      );

      this._currentText.set(fresh);
      this.updateTextarea();
    }
  }

  initTextArea(): void {
    this._textAreaEl.style.fontSize = this._currentFontSize();
    this._textAreaEl.style.fontFamily = this._currentFontFamily();
    this._textAreaEl.style.letterSpacing =
      this._currentLetterSpacing() as string;
    this.updateTextarea();
  }

  updateTextarea(): void {
    this._textAreaEl.selectionStart = this.combinedText().length;
    this._textAreaEl.selectionEnd = this.combinedText().length;
    this._textAreaEl.value = this.combinedText();

    setTimeout(() => {
      this._textAreaEl.scrollTop = this._textAreaEl.scrollHeight;
    }, 0);
  }

  generatePlaceholder() {
    const placeholders: string[] = [
      `Well? We're waiting...`,
      `Unlike cake, your book need not be a lie.`,
      `One does not simply write a whole book.`,
      `Remember to drink water...you know what that is, right?`,
      `The quick brown fox jumps over the lazy dog.`,
      `It ain't gonna write itself.`,
    ];

    return placeholders[Math.floor(Math.random() * placeholders.length)];
  }

  clearPlaceholder(): void {
    this._placeholder.set('');
  }

  onInput(): void {
    const relativeCaret: number =
      this._textAreaEl.selectionStart - this._permanentText().length;

    if (!this._textAreaEl.value.startsWith(this._permanentText())) {
      this.updateTextarea();
      return;
    }

    // Strip off the permanent part
    const newCurrentRaw: string = this._textAreaEl.value.slice(
      this._permanentText().length,
    );

    const newCurrent: TimedChar[] = [];

    for (let i: number = 0; i < newCurrentRaw.length; i++) {
      const existing: TimedChar | undefined = this._currentText()[i];

      newCurrent.push({
        char: newCurrentRaw[i],
        expiresAt:
          !existing || existing.char !== newCurrentRaw[i] || i >= relativeCaret
            ? this._now() + this.lockDelayMs
            : existing.expiresAt,
      });
    }

    setTimeout(() => {
      this._textAreaEl.scrollTop = this._textAreaEl.scrollHeight;
    }, 0);

    this._currentText.set(newCurrent);
    this.updateTextarea();
  }

  updateFontSize(action: '+' | '-' | 'reset'): void {
    let currentFontSize: number = Number(
      window.getComputedStyle(this._textAreaEl).fontSize.slice(0, -2),
    );

    switch (action) {
      case '+':
        currentFontSize = currentFontSize + 2;
        break;
      case '-':
        currentFontSize = Math.max(currentFontSize - 2, 10);
        break;
      case 'reset':
        currentFontSize = 16;
        break;
      default:
        return; // Invalid action, do nothing
    }

    this._textAreaEl.style.fontSize = currentFontSize + 'px';
    this._currentFontSize.set(currentFontSize + 'px');
  }

  updateLetterSpacing(action: '+' | '-' | 'reset'): void {
    let currentLetterSpacing: number =
      window.getComputedStyle(this._textAreaEl).letterSpacing === 'normal'
        ? 0
        : Number(
            window
              .getComputedStyle(this._textAreaEl)
              .letterSpacing.slice(0, -2),
          );

    switch (action) {
      case '+':
        currentLetterSpacing = currentLetterSpacing + 1;
        break;
      case '-':
        currentLetterSpacing = Math.max(currentLetterSpacing - 1, 0);
        break;
      case 'reset':
        currentLetterSpacing = 0;
        break;
      default:
        return;
    }

    this._textAreaEl.style.letterSpacing = currentLetterSpacing === 0 ? 'normal' : currentLetterSpacing + 'px';
    this._currentLetterSpacing.set(currentLetterSpacing === 0 ? 'normal' : currentLetterSpacing + 'px');
  }

  updateFontFamily(fontFamily: string): void {
    if (this._textAreaEl) {
      this._textAreaEl.style.fontFamily = fontFamily;
    }
    localStorageSignal('gracely_font_family', fontFamily, this.env).set(
      fontFamily,
    );
    this._currentFontFamily.set(fontFamily);
  }
}
