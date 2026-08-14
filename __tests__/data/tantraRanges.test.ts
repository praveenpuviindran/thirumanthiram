import { VERSES, TANTRAS } from '../../data/thirumanthiram';

// NOTE: TANTRAS[].verseRange is expressed in verseNumber space (0-based), NOT id space (1-based).
// e.g. tantra 0 is [0, 112] (verseNumbers), which corresponds to ids 1..113.

/** Fails the current test with a message listing the offending records, if any. */
function expectNone<T>(offenders: T[], message: string): void {
  if (offenders.length > 0) {
    throw new Error(`${message}: ${JSON.stringify(offenders)}`);
  }
  expect(offenders.length).toBe(0);
}

describe('tantra structure', () => {
  it('has exactly 10 tantras with id === number, ids 0..9', () => {
    expect(TANTRAS.length).toBe(10);
    const offenders = TANTRAS.filter(t => t.id !== t.number);
    expectNone(offenders, 'Tantras where id !== number');
    const ids = TANTRAS.map(t => t.id).slice().sort((a, b) => a - b);
    expect(ids).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it("every verse with a given tantraId has a verseNumber inside that tantra's verseRange", () => {
    const rangeById = new Map(TANTRAS.map(t => [t.id, t.verseRange]));
    const offenders = VERSES.filter(v => {
      const range = rangeById.get(v.tantraId);
      if (!range) return true; // unknown tantraId is also an offense here
      return v.verseNumber < range[0] || v.verseNumber > range[1];
    })
      .slice(0, 10)
      .map(v => ({ id: v.id, tantraId: v.tantraId, verseNumber: v.verseNumber }));

    expectNone(offenders, "Verses whose verseNumber falls outside their own tantra's verseRange (showing up to 10)");
  });

  it("every verseNumber inside a tantra's range belongs to that tantraId (no cross-contamination)", () => {
    const offenders: { id: number; verseNumber: number; actualTantraId: number; expectedTantraId: number }[] = [];
    outer: for (const v of VERSES) {
      for (const t of TANTRAS) {
        if (v.verseNumber >= t.verseRange[0] && v.verseNumber <= t.verseRange[1]) {
          if (v.tantraId !== t.id) {
            offenders.push({
              id: v.id,
              verseNumber: v.verseNumber,
              actualTantraId: v.tantraId,
              expectedTantraId: t.id,
            });
          }
          continue outer; // ranges don't overlap (checked separately) so one match is enough
        }
      }
    }
    expectNone(
      offenders.slice(0, 10),
      "Verses inside a tantra's verseRange but tagged with a different tantraId (showing up to 10)",
    );
  });

  it('tantra ranges tile the whole corpus with no gaps and no overlaps', () => {
    const sorted = TANTRAS.slice().sort((a, b) => a.verseRange[0] - b.verseRange[0]);
    expect(sorted[0].verseRange[0]).toBe(0);
    expect(sorted[sorted.length - 1].verseRange[1]).toBe(3047);

    const offenders: { id: number; range: [number, number]; nextId: number; nextRange: [number, number] }[] = [];
    for (let i = 0; i < sorted.length - 1; i++) {
      if (sorted[i].verseRange[1] + 1 !== sorted[i + 1].verseRange[0]) {
        offenders.push({
          id: sorted[i].id,
          range: sorted[i].verseRange,
          nextId: sorted[i + 1].id,
          nextRange: sorted[i + 1].verseRange,
        });
      }
    }
    expectNone(offenders, 'Gap or overlap between adjacent tantra ranges');
  });

  it('per-tantra verse count equals verseRange[1] - verseRange[0] + 1', () => {
    const offenders = TANTRAS.map(t => {
      const expectedCount = t.verseRange[1] - t.verseRange[0] + 1;
      const actualCount = VERSES.filter(v => v.tantraId === t.id).length;
      return { id: t.id, expectedCount, actualCount };
    }).filter(o => o.expectedCount !== o.actualCount);

    expectNone(offenders, "Tantras whose verse count doesn't match their verseRange span");
  });

  it('each tantra has non-empty tamilName, englishName, description, and a valid #RRGGBB color; colors are unique', () => {
    const hexColorRe = /^#[0-9A-Fa-f]{6}$/;
    const fieldOffenders = TANTRAS.filter(
      t =>
        !t.tamilName?.trim() ||
        !t.englishName?.trim() ||
        !t.description?.trim() ||
        !hexColorRe.test(t.color ?? ''),
    ).map(t => ({ id: t.id, tamilName: t.tamilName, englishName: t.englishName, color: t.color }));

    expectNone(fieldOffenders, 'Tantras with missing/invalid text or color fields');

    const colorCounts = new Map<string, number[]>();
    for (const t of TANTRAS) {
      const arr = colorCounts.get(t.color) ?? [];
      arr.push(t.id);
      colorCounts.set(t.color, arr);
    }
    const dupeColors = Array.from(colorCounts.entries()).filter(([, ids]) => ids.length > 1);
    expectNone(dupeColors, 'Duplicate tantra colors');
  });
});
