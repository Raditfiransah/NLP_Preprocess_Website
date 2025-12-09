
export interface ProcessingOptions {
  // Language Settings
  language: 'en' | 'id';

  // Basic Cleaning
  lowercase: boolean;
  removePunctuation: boolean;
  removeNumbers: boolean;
  removeUrls: boolean;
  removeEmails: boolean;
  removeEmoji: boolean;
  removeWhitespace: boolean;
  removeStopwords: boolean;
  
  // Advanced Text Cleaning
  removeMentions: boolean;  // @username
  removeHashtags: boolean;  // #topic
  removeRepeatedChars: boolean; // goood -> good
  
  // NLP Operations
  stemming: boolean; // Porter (EN) or Sastrawi-lite (ID)
  normalizeSlang: boolean; 
  fixTypos: boolean; // Typo correction / Formalization
  
  // Custom Dictionary
  useCustomSlang: boolean;
  customSlangRaw: string; // "key=value\nkey2=value2"

  // Dataset Level Operations
  removeDuplicates: boolean;
  removeMissingValues: boolean; // Drop rows with empty text
  
  // Custom Regex
  customCleaning: boolean;
  customFind: string;
  customReplace: string;
}

export type ProcessingStatus = 'idle' | 'processing' | 'completed' | 'error';

export interface DatasetRow {
  [key: string]: string | number | boolean | null;
}

export interface ProcessedRow extends DatasetRow {
  _processed_text?: string;
}

export interface ProcessingStats {
  totalRows: number;
  processedRows: number;
  startTime: number;
  estimatedTimeRemaining: number;
}