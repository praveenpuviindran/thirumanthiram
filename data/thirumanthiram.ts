// Tamil verse text sourced from Tamil Virtual University (tamilvu.org).
// The Thirumanthiram is ancient Tamil classical poetry (c. 5th–8th century CE), public domain.
// English translations and elaborations are original scholarly compositions.

export interface Verse {
  id: number;
  tantraId: number;
  verseNumber: number;
  tamil: string;
  transliteration: string;
  english: string;
  elaborationEnglish?: string;
  elaborationTamil?: string;
  audioUrl?: string;
}

export interface Tantra {
  id: number;
  number: number;
  tamilName: string;
  englishName: string;
  description: string;
  verseRange: [number, number];
  color: string;
}

export const TANTRAS: Tantra[] = [
  {
    id: 0,
    number: 0,
    tamilName: "கடவுள் வாழ்த்து",
    englishName: "Kadavul Vaazhththu",
    description: "The Paayiram (Prologue) — Vinayagar Kaapu, praises of Shiva, the Vedas, Agamas, the guru lineage, and Thirumoolar's history. The foundational vision of the Thirumanthiram.",
    verseRange: [0, 112],
    color: "#C8860A",
  },
  {
    id: 1,
    number: 1,
    tamilName: "முதல் தந்திரம்",
    englishName: "Tantra 1",
    description: "Upadesha and ethical teachings — the impermanence of body, wealth, youth, and life; non-killing, abstaining from meat, love, learning, and the foundations of Shaiva living.",
    verseRange: [113, 336],
    color: "#7B4EA0",
  },
  {
    id: 2,
    number: 2,
    tamilName: "இரண்டாம் தந்திரம்",
    englishName: "Tantra 2",
    description: "Cosmological teachings — the five cosmic functions of Shiva (creation, preservation, dissolution, concealment, grace), the nature of sacred places, ritual conduct, and the three impurities.",
    verseRange: [337, 548],
    color: "#1A6B8A",
  },
  {
    id: 3,
    number: 3,
    tamilName: "மூன்றாம் தந்திரம்",
    englishName: "Tantra 3",
    description: "Ashtanga Yoga — the eight limbs of yoga (Yama, Niyama, Asana, Pranayama, Pratyahara, Dharana, Dhyana, Samadhi), the yogic powers, and the path of inner purification.",
    verseRange: [549, 883],
    color: "#C0392B",
  },
  {
    id: 4,
    number: 4,
    tamilName: "நான்காம் தந்திரம்",
    englishName: "Tantra 4",
    description: "Mantra and chakra teachings — Ajapa (the unspoken mantra), the Thiruambala Chakra, sacred worship practices, the Bhairavi and Bhairava mantras, and the deeper science of Shaiva tantra.",
    verseRange: [884, 1418],
    color: "#2E7D32",
  },
  {
    id: 5,
    number: 5,
    tamilName: "ஐந்தாம் தந்திரம்",
    englishName: "Tantra 5",
    description: "The four paths of Shaiva practice — Chariya, Kriya, Yoga, and Jnana — and the four states of liberation: Salokam, Sameepam, Saroopam, and Sayujyam.",
    verseRange: [1419, 1572],
    color: "#4A148C",
  },
  {
    id: 6,
    number: 6,
    tamilName: "ஆறாம் தந்திரம்",
    englishName: "Tantra 6",
    description: "The guru, renunciation, and tapas — the Shiva-guru, the sacred ash (thiruneeru), the marks of the ripe (pakuvan) and unripe (apakuvan) soul, and the nature of true renunciation.",
    verseRange: [1573, 1703],
    color: "#BF360C",
  },
  {
    id: 7,
    number: 7,
    tamilName: "ஏழாம் தந்திரம்",
    englishName: "Tantra 7",
    description: "The six chakras, the various forms of the Lingam, Shiva-puja, guru-puja, the conduct of Shaiva sages, and the deeper mysteries of Shaiva yoga.",
    verseRange: [1704, 2121],
    color: "#006064",
  },
  {
    id: 8,
    number: 8,
    tamilName: "எட்டாம் தந்திரம்",
    englishName: "Tantra 8",
    description: "Shaiva Siddhanta philosophy — Pati, Pashu, and Pasha (God, soul, and bondage), the three impurities, the three entities, liberation, and the path to final union with Shiva.",
    verseRange: [2122, 2648],
    color: "#827717",
  },
  {
    id: 9,
    number: 9,
    tamilName: "ஒன்பதாம் தந்திரம்",
    englishName: "Tantra 9",
    description: "The ultimate liberation — Pranava Samadhi, the five-syllable mantra's deeper dimensions, the vision of Shiva's cosmic dance, the nature of Jnana, and the final state of eternal union.",
    verseRange: [2649, 3047],
    color: "#880E4F",
  },
];

import { VERSES_T0 } from './verses_t0';
import { VERSES_T1 } from './verses_t1';
import { VERSES_T2 } from './verses_t2';
import { VERSES_T3 } from './verses_t3';
import { VERSES_T4 } from './verses_t4';
import { VERSES_T5 } from './verses_t5';
import { VERSES_T6 } from './verses_t6';
import { VERSES_T7 } from './verses_t7';
import { VERSES_T8 } from './verses_t8';
import { VERSES_T9 } from './verses_t9';

export const VERSES: Verse[] = [
  ...VERSES_T0,
  ...VERSES_T1,
  ...VERSES_T2,
  ...VERSES_T3,
  ...VERSES_T4,
  ...VERSES_T5,
  ...VERSES_T6,
  ...VERSES_T7,
  ...VERSES_T8,
  ...VERSES_T9,
];

export function getTantraById(id: number): Tantra | undefined {
  return TANTRAS.find(t => t.id === id);
}

export function getVersesByTantra(tantraId: number): Verse[] {
  return VERSES.filter(v => v.tantraId === tantraId);
}

export function getVerseById(id: number): Verse | undefined {
  return VERSES.find(v => v.id === id);
}

export function searchVerses(query: string): Verse[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return VERSES.filter(v =>
    v.tamil?.includes(q) ||
    v.transliteration?.toLowerCase().includes(q) ||
    v.english?.toLowerCase().includes(q)
  );
}
