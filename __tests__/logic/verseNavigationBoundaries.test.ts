import { VERSES, Verse } from '../../data/thirumanthiram';

// Replicated from app/(tabs)/verse/[id].tsx:52-55 — MUST BE KEPT IN SYNC.
//   const idx = VERSES.findIndex((v) => v.id === verseId);
//   const prevVerse = idx > 0 ? VERSES[idx - 1] : null;
//   const nextVerse = idx < VERSES.length - 1 ? VERSES[idx + 1] : null;
function computeNav(verseId: number): { idx: number; prevVerse: Verse | null; nextVerse: Verse | null } {
  const idx = VERSES.findIndex((v) => v.id === verseId);
  const prevVerse = idx > 0 ? VERSES[idx - 1] : null;
  const nextVerse = idx < VERSES.length - 1 ? VERSES[idx + 1] : null;
  return { idx, prevVerse, nextVerse };
}

describe('verse prev/next boundary math', () => {
  it('corpus has exactly 3048 verses, ids 1..3048 with no gaps', () => {
    expect(VERSES.length).toBe(3048);
    expect(VERSES[0].id).toBe(1);
    expect(VERSES[VERSES.length - 1].id).toBe(3048);
  });

  it('at verse id 1: prev is null, next is id 2', () => {
    const { prevVerse, nextVerse } = computeNav(1);
    expect(prevVerse).toBeNull();
    expect(nextVerse).not.toBeNull();
    expect(nextVerse!.id).toBe(2);
  });

  it('at the last id (3048): next is null, prev is 3047', () => {
    const { prevVerse, nextVerse } = computeNav(3048);
    expect(nextVerse).toBeNull();
    expect(prevVerse).not.toBeNull();
    expect(prevVerse!.id).toBe(3047);
  });

  it('mid-verse: both prev and next are non-null and contiguous with the current verse', () => {
    const midId = VERSES[Math.floor(VERSES.length / 2)].id;
    const { idx, prevVerse, nextVerse } = computeNav(midId);
    expect(prevVerse).not.toBeNull();
    expect(nextVerse).not.toBeNull();
    expect(prevVerse!.id).toBe(VERSES[idx - 1].id);
    expect(nextVerse!.id).toBe(VERSES[idx + 1].id);
    // Contiguity: prev/current/next occupy adjacent array slots.
    expect(VERSES[idx - 1]).toBe(prevVerse);
    expect(VERSES[idx + 1]).toBe(nextVerse);
  });

  it(
    // LATENT DEFECT (not in the audit table by number, but implied by the
    // reviewed lines): when verseId is not found, VERSES.findIndex returns
    // -1. `idx > 0` is false, so prevVerse is correctly null. But
    // `idx < VERSES.length - 1` (i.e. `-1 < 3047`) is TRUE, so nextVerse
    // becomes VERSES[idx + 1] === VERSES[0] — a bogus "next verse" pointing
    // at the very first verse in the corpus, for an id that doesn't exist.
    //
    // Reachability: CURRENTLY MASKED. app/(tabs)/verse/[id].tsx renders an
    // early-return "Verse not found" state (using the `verse` lookup via
    // getVerseById, not `idx`/nextVerse/prevVerse) before the nav row is
    // ever rendered, so this bogus nextVerse value is computed but never
    // surfaces in the UI today. It would become live/reachable the moment
    // anyone reorders the early-return relative to the nav row, or reuses
    // this idx/prevVerse/nextVerse logic somewhere without an equivalent
    // not-found guard.
    'a nonexistent verseId yields idx=-1, prevVerse=null, and a BOGUS nextVerse === VERSES[0] (currently masked by the "Verse not found" early return)',
    () => {
      const nonexistentId = 999999;
      const { idx, prevVerse, nextVerse } = computeNav(nonexistentId);
      expect(idx).toBe(-1);
      expect(prevVerse).toBeNull();
      expect(nextVerse).not.toBeNull();
      expect(nextVerse!.id).toBe(VERSES[0].id); // bogus: id 1, unrelated to nonexistentId
    }
  );
});
