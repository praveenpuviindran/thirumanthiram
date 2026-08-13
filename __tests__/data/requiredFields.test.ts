import { VERSES } from '../../data/thirumanthiram';

/** Fails the current test with a message listing the offending records, if any. */
function expectNone<T>(offenders: T[], message: string): void {
  if (offenders.length > 0) {
    throw new Error(`${message}: ${JSON.stringify(offenders)}`);
  }
  expect(offenders.length).toBe(0);
}

describe('required fields', () => {
  it('every verse has non-empty trimmed tamil, transliteration, and english', () => {
    const offenders = VERSES.filter(
      v => !v.tamil?.trim() || !v.transliteration?.trim() || !v.english?.trim(),
    ).map(v => ({
      id: v.id,
      tamilEmpty: !v.tamil?.trim(),
      transliterationEmpty: !v.transliteration?.trim(),
      englishEmpty: !v.english?.trim(),
    }));

    expectNone(offenders, 'Verses with a missing/blank required text field');
  });

  it('audioUrl, when present, is a non-empty string starting with http', () => {
    const offenders = VERSES.filter(
      v => v.audioUrl !== undefined && (!v.audioUrl.trim() || !v.audioUrl.startsWith('http')),
    ).map(v => ({ id: v.id, audioUrl: v.audioUrl }));

    expectNone(offenders, 'Verses with a malformed audioUrl');
  });

  describe('known content gaps (regression pins for the MEDIUM "content gaps" finding)', () => {
    it('tantra 9 has 0 verses with a non-empty elaborationTamil', () => {
      const count = VERSES.filter(v => v.tantraId === 9 && v.elaborationTamil?.trim()).length;
      expect(count).toBe(0);
    });

    it('tantra 9 has 0 verses with an audioUrl', () => {
      const count = VERSES.filter(v => v.tantraId === 9 && v.audioUrl?.trim()).length;
      expect(count).toBe(0);
    });

    it('tantra 8 has 0 verses with an audioUrl', () => {
      const count = VERSES.filter(v => v.tantraId === 8 && v.audioUrl?.trim()).length;
      expect(count).toBe(0);
    });

    it('exactly 1811 verses have an audioUrl and 1237 do not (verified against real data)', () => {
      const withAudio = VERSES.filter(v => v.audioUrl?.trim()).length;
      const withoutAudio = VERSES.length - withAudio;
      // Verified directly against source: matches the audit's stated numbers exactly.
      expect(withAudio).toBe(1811);
      expect(withoutAudio).toBe(1237);
    });
  });

  it('all audioUrls point at the single external host kvnthirumoolar.com (hot-linked, no offline copy)', () => {
    const offenders = VERSES.filter(v => v.audioUrl && !v.audioUrl.includes('kvnthirumoolar.com')).map(v => ({
      id: v.id,
      audioUrl: v.audioUrl,
    }));

    expectNone(offenders, 'Verses with an audioUrl NOT pointing at kvnthirumoolar.com');
  });
});
