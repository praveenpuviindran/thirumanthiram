import { VERSES, Verse } from '../../data/thirumanthiram';

/** Fails the current test with a message listing the offending records, if any. */
function expectNone<T>(offenders: T[], message: string): void {
  if (offenders.length > 0) {
    throw new Error(`${message}: ${JSON.stringify(offenders)}`);
  }
  expect(offenders.length).toBe(0);
}

describe('text corruption', () => {
  it('no verse tamil/transliteration contains a literal backslash', () => {
    // PINS the LOW finding: escape corruption at verses_t4.ts:1572,1576 (id 957) and :5651,5655 (id 1148).
    // Expected to FAIL — exactly 2 verses / 4 fields.
    const offenders = VERSES.filter(
      v => v.tamil?.includes('\\') || v.transliteration?.includes('\\'),
    ).map(v => ({
      id: v.id,
      tamilHasBackslash: v.tamil?.includes('\\') ?? false,
      transliterationHasBackslash: v.transliteration?.includes('\\') ?? false,
    }));

    expectNone(offenders, 'Verses with a literal backslash in tamil/transliteration');
  });

  it('no verse english contains scraper footer cruft "TANTRA NINE ENDS"', () => {
    const offenders = VERSES.filter(v => v.english?.includes('TANTRA NINE ENDS')).map(v => v.id);
    expectNone(offenders, 'Verses with "TANTRA NINE ENDS" cruft in english');
  });

  it('no verse content field leaks a raw http(s) URL', () => {
    // Scoped to CONTENT fields only — audioUrl legitimately holds URLs and is excluded.
    // Verified against source: the known leak (verses_t3.ts:1465, id 619) sits in `elaborationTamil`,
    // not `english`/`elaborationEnglish` as originally assumed, so elaborationTamil (and tamil/
    // transliteration, for completeness) are included in the scan below.
    const urlRe = /https?:\/\//;
    const contentFields: (keyof Verse)[] = [
      'tamil',
      'transliteration',
      'english',
      'elaborationEnglish',
      'elaborationTamil',
    ];

    const offenders: { id: number; field: string }[] = [];
    for (const v of VERSES) {
      for (const field of contentFields) {
        const value = v[field] as string | undefined;
        if (value && urlRe.test(value)) {
          offenders.push({ id: v.id, field: String(field) });
        }
      }
    }

    expectNone(offenders, 'Verses with a raw URL leaked into a content field');
  });
});
