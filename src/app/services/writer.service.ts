import {
  computed,
  effect,
  ElementRef,
  Injectable,
  Signal,
  signal,
  WritableSignal,
} from '@angular/core';
import { TimedChar } from '../../types/timed-char.type';

@Injectable({
  providedIn: 'root',
})
export class WriterService {
  readonly _placeholder: WritableSignal<string> = signal<string>(
    this.generatePlaceholder(),
  );
  private readonly localStorageKey: string = 'gracely-text';
  private readonly lockDelayMs: number = 5000; // ms
  private readonly _now: WritableSignal<number> = signal<number>(Date.now());
  private readonly _currentText: WritableSignal<TimedChar[]> = signal<
    TimedChar[]
  >([]);
  private readonly _permanentText: WritableSignal<string> = signal<string>(
    this.loadText(),
  );
  readonly combinedText: Signal<string> = computed(() => {
    return (
      this._permanentText() +
      this._currentText()
        .map((c: TimedChar) => c.char)
        .join('')
    );
  });
  private _textAreaEl!: HTMLTextAreaElement;

  constructor() {
    effect(() => {
      const interval: number = setInterval(() => {
        this._now.set(Date.now());
        this.promoteExpiredText();
        this.saveText();
      }, 500);
      return () => clearInterval(interval);
    });
  }

  registerTextArea(el: ElementRef<HTMLTextAreaElement>) {
    this._textAreaEl = el.nativeElement;
    console.log('Text area registered:', this._textAreaEl);
  }

  // correctly ported

  loadText(): string {
    const storedText: string | null = localStorage.getItem(
      this.localStorageKey,
    );
    return storedText ? storedText : '';
  }

  saveText(): void {
    localStorage.setItem(this.localStorageKey, this.combinedText());
  }

  resetText(): void {
    navigator.clipboard.writeText(this.combinedText());
    this._currentText.set([]);
    this._permanentText.set('');
    localStorage.setItem(this.localStorageKey, '');
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

    this._currentText.set(newCurrent);
    this.updateTextarea();
  }

  updateFontSize(action: '+' | '-' | 'reset'): void {
    if (action === 'reset') {
      this._textAreaEl.style.fontSize = '16px'; // Reset to default size
      return;
    }

    const currentSize: number = parseFloat(
      window.getComputedStyle(this._textAreaEl).fontSize,
    );

    if (action === '+') {
      this._textAreaEl.style.fontSize = `${currentSize + 1}px`;
    } else if (action === '-') {
      this._textAreaEl.style.fontSize = `${Math.max(currentSize - 1, 10)}px`;
    }
  }
}
