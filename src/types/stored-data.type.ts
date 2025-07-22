import { LangConfig } from './lang-config.type';

export interface StoredData {
  langConfig?: LangConfig; // Optional property for language configuration
  storedTexts?: string; // Optional property for stored texts

  [key: string]: any; // This allows for any additional properties to be added dynamically
}
