import { VERSES, TANTRAS } from '../../data/thirumanthiram';

// Import once at module top — VERSES is ~7.5MB of TS across 10 files, re-importing per test is wasteful.

/** Fails the current test with a message listing the offending records, if any. */
function expectNone<T>(offenders: T[], message: string): void {
  if (offenders.length > 0) {
    throw new Error(`${message}: ${JSON.stringify(offenders)}`);
  }
  expect(offenders.length).toBe(0);
}

describe('corpus integrity', () => {
  it('holds exactly 3048 verse records', () => {
    // PINS the MEDIUM finding: product copy says 3,047; data holds 3048.
    expect(VERSES.length).toBe(3048);
  });

  it('has contiguous ids 1..3048 with zero gaps', () => {
    const ids = VERSES.map(v => v.id).slice().sort((a, b) => a - b);
    const expected = new Set(Array.from({ length: VERSES.length }, (_, i) => i + 1));
    const actual = new Set(ids);
    const missing = Array.from(expected).filter(e => !actual.has(e));
    const unexpected = ids.filter(id => !expected.has(id));

    if (missing.length > 0 || unexpected.length > 0 || ids.length !== expected.size) {
      throw new Error(
        `id sequence is not contiguous 1..${expected.size}. missing=${JSON.stringify(
          missing,
        )} unexpected=${JSON.stringify(unexpected)}`,
      );
    }
    expect(missing.length).toBe(0);
  });

  it('has zero duplicate ids', () => {
    const seen = new Map<number, number>();
    for (const v of VERSES) {
      seen.set(v.id, (seen.get(v.id) ?? 0) + 1);
    }
    const dupes = Array.from(seen.entries()).filter(([, count]) => count > 1);
    expectNone(dupes, 'Duplicate ids found');
  });

  it('has id === verseNumber + 1 for every verse', () => {
    const offenders = VERSES.filter(v => v.id !== v.verseNumber + 1)
      .slice(0, 10)
      .map(v => ({ id: v.id, verseNumber: v.verseNumber }));
    expectNone(offenders, 'Found verses where id !== verseNumber + 1 (showing up to 10)');
  });

  it('has contiguous verseNumbers 0..3047 with zero dupes', () => {
    const verseNumbers = VERSES.map(v => v.verseNumber).slice().sort((a, b) => a - b);
    const expected = new Set(Array.from({ length: VERSES.length }, (_, i) => i));
    const actual = new Set(verseNumbers);
    const missing = Array.from(expected).filter(e => !actual.has(e));
    const unexpected = verseNumbers.filter(vn => !expected.has(vn));
    const hasDupes = actual.size !== verseNumbers.length;

    if (missing.length > 0 || unexpected.length > 0 || hasDupes) {
      throw new Error(
        `verseNumber sequence is not contiguous 0..${VERSES.length - 1}. missing=${JSON.stringify(
          missing,
        )} unexpected=${JSON.stringify(unexpected)} hasDupes=${hasDupes}`,
      );
    }
    expect(missing.length).toBe(0);
  });

  it('every verse has a tantraId that exists in TANTRAS', () => {
    const validTantraIds = new Set(TANTRAS.map(t => t.id));
    const offenders = VERSES.filter(v => !validTantraIds.has(v.tantraId))
      .slice(0, 10)
      .map(v => ({ id: v.id, tantraId: v.tantraId }));
    expectNone(offenders, 'Verses with unknown tantraId (showing up to 10)');
  });

  it('is stored in ascending id order (verse/[id].tsx relies on array order for prev/next swipe nav)', () => {
    const offenders: { index: number; id: number; nextId: number }[] = [];
    for (let i = 0; i < VERSES.length - 1; i++) {
      if (!(VERSES[i].id < VERSES[i + 1].id)) {
        offenders.push({ index: i, id: VERSES[i].id, nextId: VERSES[i + 1].id });
      }
    }
    expectNone(offenders.slice(0, 10), 'VERSES array is not in strictly ascending id order (showing up to 10)');
  });
});
