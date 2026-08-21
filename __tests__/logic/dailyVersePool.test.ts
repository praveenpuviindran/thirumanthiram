import { VERSES, Verse } from '../../data/thirumanthiram';

// Replicated from components/ui/DailyVerse.tsx — MUST BE KEPT IN SYNC.
//   function inDailyPool(v) { return v.verseNumber <= 1842; }
//   function localEpochDay() {
//     const now = new Date();
//     return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
//   }
//   const pool = VERSES.filter(inDailyPool);
//   return pool[dayKey % pool.length];
function inDailyPool(v: Verse): boolean {
  return v.verseNumber <= 1842;
}

// The day key as the component computes it, but taking the "now" instant as a
// parameter so tests can drive it. Mirrors localEpochDay() exactly: local
// year/month/day, re-expressed as a UTC epoch-day index.
function localEpochDay(now: Date): number {
  return Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / 86400000);
}

function dailyVerse(verses: Verse[], now: Date): Verse {
  const p = verses.filter(inDailyPool);
  return p[localEpochDay(now) % p.length];
}

function pool() {
  return VERSES.filter(inDailyPool);
}

const DAY_MS = 86400000;

describe('Daily Verse pool composition', () => {
  it('corpus holds exactly 3048 records (audit-verified count)', () => {
    expect(VERSES.length).toBe(3048);
  });

  // Pool is verses 0 (Kaapu) through 1842 inclusive, by product decision —
  // this is a fixed cutoff, not derived from commentary coverage.
  it('the pool holds exactly 1,843 verses (verseNumber 0 through 1842)', () => {
    expect(pool().length).toBe(1843);
    expect(pool().every((v) => v.verseNumber <= 1842)).toBe(true);
  });

  it('NO verse belonging to tantraId 9 is in the pool', () => {
    const inPool = pool();
    expect(inPool.some((v) => v.tantraId === 9)).toBe(false);
  });

  it('NO verse with verseNumber > 1842 is in the pool', () => {
    expect(pool().some((v) => v.verseNumber > 1842)).toBe(false);
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
