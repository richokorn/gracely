export interface LangConfig {
  supportedLanguages: string[];
  selectedLanguage: string;

  translate(lang: string): void;
}
