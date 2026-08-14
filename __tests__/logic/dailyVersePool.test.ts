import { VERSES, Verse } from '../../data/thirumanthiram';

// Replicated from components/ui/DailyVerse.tsx — MUST BE KEPT IN SYNC.
//   function hasTamilCommentary(v) { return (v.elaborationTamil ?? '').trim().length > 0; }
//   function localEpochDay() {
//     const now = new Date();
//     return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
//   }
//   const pool = VERSES.filter(hasTamilCommentary);
//   return pool[dayKey % pool.length];
function hasTamilCommentary(v: Verse): boolean {
  return (v.elaborationTamil ?? '').trim().length > 0;
}

// The day key as the component computes it, but taking the "now" instant as a
// parameter so tests can drive it. Mirrors localEpochDay() exactly: local
// year/month/day, re-expressed as a UTC epoch-day index.
function localEpochDay(now: Date): number {
  return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
}

function dailyVerse(verses: Verse[], now: Date): Verse {
  const p = verses.filter(hasTamilCommentary);
  return p[localEpochDay(now) % p.length];
}

function pool() {
  return VERSES.filter(hasTamilCommentary);
}

const DAY_MS = 86400000;

describe('Daily Verse pool composition', () => {
  it('corpus holds exactly 3048 records (audit-verified count)', () => {
    expect(VERSES.length).toBe(3048);
  });

  it('the pool excludes exactly the 429 verses that have no Tamil elaboration', () => {
    const excluded = VERSES.filter((v) => !hasTamilCommentary(v));
    expect(excluded.length).toBe(429);

    const pct = (excluded.length / VERSES.length) * 100;
    expect(pct).toBeGreaterThan(14.0);
    expect(pct).toBeLessThan(14.2);
  });

  it('the pool itself holds exactly 2,619 verses (3048 - 429)', () => {
    expect(pool().length).toBe(2619);
    expect(pool().length).toBe(VERSES.length - 429);
  });

  // The old `verseNumber <= 1842` cutoff was a strict SUBSET of the
  // commentary-backed set: every verse it admitted has Tamil elaboration, but
  // it also excluded 776 verses in Tantras 7 and 8 that DO have elaboration.
  // The predicate fix is therefore purely additive — nothing that used to be
  // eligible has become ineligible.
  it('the new pool is a strict superset of the old verseNumber <= 1842 pool', () => {
    const oldPool = VERSES.filter((v) => v.verseNumber <= 1842);
    expect(oldPool.length).toBe(1843);

    const newIds = new Set(pool().map((v) => v.id));
    expect(oldPool.every((v) => newIds.has(v.id))).toBe(true);

    const oldIds = new Set(oldPool.map((v) => v.id));
    const gained = pool().filter((v) => !oldIds.has(v.id));
    expect(gained.length).toBe(776);
    expect(gained.every((v) => v.tantraId === 7 || v.tantraId === 8)).toBe(true);
  });

  // PINS the MEDIUM finding: Daily Verse can never surface Tantra 9.
  // Still true after the predicate fix — no Tantra 9 verse has Tamil
  // elaboration yet — but now it holds for a content reason rather than an
  // arbitrary number, and self-corrects once that commentary is authored.
  it('NO verse belonging to tantraId 9 is in the pool', () => {
    const inPool = pool();
    expect(inPool.some((v) => v.tantraId === 9)).toBe(false);

    const tantra9Verses = VERSES.filter((v) => v.tantraId === 9);
    expect(tantra9Verses.length).toBeGreaterThan(0);
    expect(tantra9Verses.every((v) => !hasTamilCommentary(v))).toBe(true);
  });

  it('every excluded verse has a non-empty english field — exclusion is about commentary, not missing text', () => {
    const excluded = VERSES.filter((v) => !hasTamilCommentary(v));
    const withoutEnglish = excluded.filter((v) => !v.english || v.english.trim() === '');
    expect(withoutEnglish.length).toBe(0);
  });

  it('every pooled verse actually carries the Tamil commentary the card promises', () => {
    expect(pool().every((v) => (v.elaborationTamil ?? '').trim().length > 0)).toBe(true);
  });
});

describe('Daily Verse rollover (LOCAL calendar day, not UTC)', () => {
  // `Math.floor(Date.now() / 86400000)` buckets by UTC calendar day, so the
  // "daily" verse rolls over at a clock time that is not the user's local
  // midnight — 5:30am in India (UTC+5:30), 1pm the previous day in UTC-11.
  // localEpochDay() reads the LOCAL year/month/day, so the boundary is local
  // midnight in every timezone, DST included.

  it('selection is stable for many instants within one local day', () => {
    const dayStart = new Date(2025, 5, 14, 0, 0, 0, 0); // local midnight, 14 Jun 2025
    const first = dailyVerse(VERSES, dayStart);
    const midDay = dailyVerse(VERSES, new Date(2025, 5, 14, 12, 0, 0, 0));
    const lastMsOfDay = dailyVerse(VERSES, new Date(2025, 5, 14, 23, 59, 59, 999));

    expect(midDay.id).toBe(first.id);
    expect(lastMsOfDay.id).toBe(first.id);
  });

  it('selection changes exactly at LOCAL midnight, not UTC midnight', () => {
    const lastMsOfPrevDay = dailyVerse(VERSES, new Date(2025, 5, 13, 23, 59, 59, 999));
    const firstMsOfThisDay = dailyVerse(VERSES, new Date(2025, 5, 14, 0, 0, 0, 0));

    // The pool index advances by exactly 1 (mod pool length) once per day, so
    // consecutive days always select a different verse.
    expect(firstMsOfThisDay.id).not.toBe(lastMsOfPrevDay.id);
  });

  it('the local-day key is invariant to the time of day, unlike the UTC-day key', () => {
    // Same local calendar date, two instants that straddle UTC midnight for
    // any device east of Greenwich.
    const early = new Date(2025, 5, 14, 1, 0, 0, 0);
    const late = new Date(2025, 5, 14, 22, 0, 0, 0);
    expect(localEpochDay(early)).toBe(localEpochDay(late));

    // And the key does advance across a local date boundary.
    expect(localEpochDay(new Date(2025, 5, 15, 1, 0, 0, 0))).toBe(localEpochDay(early) + 1);
  });

  it('determinism: the same instant always yields the same verse', () => {
    const now = new Date(2027, 0, 9, 8, 30, 0, 0);
    const a = dailyVerse(VERSES, now);
    const b = dailyVerse(VERSES, now);
    expect(a.id).toBe(b.id);
    expect(a).toEqual(b);
  });

  it('selection is always a valid in-pool verse across a sweep of many days', () => {
    const validIds = new Set(pool().map((v) => v.id));
    const start = new Date(2020, 0, 1, 9, 0, 0, 0).getTime();
    for (let i = 0; i < 5000; i += 37) {
      const v = dailyVerse(VERSES, new Date(start + i * DAY_MS));
      expect(v).toBeDefined();
      expect(validIds.has(v.id)).toBe(true);
      expect((v.elaborationTamil ?? '').trim().length).toBeGreaterThan(0);
    }
  });
});
