import { LangConfig } from './lang-config.type';

export interface StoredData {
  langConfig?: LangConfig; // Optional property for language configuration
  storedTexts?: string; // Optional property for stored texts
  dismissedWelcomeChangelog?: boolean; // Optional property to track if the welcome changelog has been dismissed
  lastSeenVersion?: string; // Optional property to track the last seen version of the application
  [key: string]: any; // This allows for any additional properties to be added dynamically
}
