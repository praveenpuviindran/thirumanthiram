export interface WordEntry {
  tamil: string;
  transliteration: string;
  partOfSpeech: string;
  literalMeaning: string;
  meaningInVerse: string;
  saivaSiddhantaMeaning: string;
  yogicMeaning: string;
  vedicAgamicMeaning: string;
  symbolicMeaning: string;
  relatedConcepts: string[];
  otherMeaningsInThirumanthiram: string;
  exampleVerses: number[];
}

import { VERSE_WORDS_T0 } from './verse_words_t0';

const ALL_WORDS: Record<number, WordEntry[]> = {
  ...VERSE_WORDS_T0,
};

export function getVerseWords(verseNumber: number): WordEntry[] {
  return ALL_WORDS[verseNumber] ?? [];
}
