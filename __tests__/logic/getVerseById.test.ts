import {
  VERSES,
  TANTRAS,
  getVerseById,
  getTantraById,
  getVersesByTantra,
} from '../../data/thirumanthiram';

describe('getVerseById', () => {
  it('returns the verse whose id matches, for id 1', () => {
    const v = getVerseById(1);
    expect(v).toBeDefined();
    expect(v!.id).toBe(1);
  });

  it('returns the verse whose id matches, for a mid id', () => {
    const midId = VERSES[Math.floor(VERSES.length / 2)].id;
    const v = getVerseById(midId);
    expect(v).toBeDefined();
    expect(v!.id).toBe(midId);
  });

  it('returns the verse whose id matches, for id 3048', () => {
    const v = getVerseById(3048);
    expect(v).toBeDefined();
    expect(v!.id).toBe(3048);
  });

  it('the corpus holds exactly 3048 records (audit-verified count)', () => {
    expect(VERSES.length).toBe(3048);
  });

  it.each([0, -1, 3049, NaN])('returns undefined for id=%p', (id) => {
    expect(getVerseById(id as number)).toBeUndefined();
  });

  it('getVerseById(n).id === n for a sample sweep across the corpus', () => {
    const step = Math.max(1, Math.floor(VERSES.length / 50));
    for (let i = 0; i < VERSES.length; i += step) {
      const id = VERSES[i].id;
      const v = getVerseById(id);
      expect(v).toBeDefined();
      expect(v!.id).toBe(id);
    }
  });
});

describe('getTantraById', () => {
  it('returns tantra 0', () => {
    const t = getTantraById(0);
    expect(t).toBeDefined();
    expect(t!.id).toBe(0);
  });

  it('returns tantra 9', () => {
    const t = getTantraById(9);
    expect(t).toBeDefined();
    expect(t!.id).toBe(9);
  });

  it('returns undefined for a nonexistent tantra id', () => {
    expect(getTantraById(10)).toBeUndefined();
    expect(getTantraById(-1)).toBeUndefined();
  });

  it('TANTRAS holds exactly 10 tantras (ids 0-9)', () => {
    expect(TANTRAS.length).toBe(10);
    expect(TANTRAS.map((t) => t.id).sort((a, b) => a - b)).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });
});

describe('getVersesByTantra', () => {
  it('tantra 0 returns only verses with tantraId 0, and at least one verse', () => {
    const verses = getVersesByTantra(0);
    expect(verses.length).toBeGreaterThan(0);
    expect(verses.every((v) => v.tantraId === 0)).toBe(true);
  });

  it('tantra 9 returns only verses with tantraId 9, and at least one verse', () => {
    const verses = getVersesByTantra(9);
    expect(verses.length).toBeGreaterThan(0);
    expect(verses.every((v) => v.tantraId === 9)).toBe(true);
  });

  it('a nonexistent tantra id returns an empty array', () => {
    expect(getVersesByTantra(99)).toEqual([]);
  });

  it('every verse in VERSES belongs to exactly one tantra bucket (partition check)', () => {
    const total = TANTRAS.reduce((sum, t) => sum + getVersesByTantra(t.id).length, 0);
    expect(total).toBe(VERSES.length);
  });
});
