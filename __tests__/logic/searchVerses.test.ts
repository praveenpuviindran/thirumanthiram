import { VERSES, searchVerses } from '../../data/thirumanthiram';

/**
 * Pins H3 (BUG_AUDIT.md): `data/thirumanthiram.ts:156-164`.
 *
 *   const q = query.toLowerCase().trim();
 *   ...
 *   v.tamil?.includes(query) ||               // <-- RAW query, not `q`
 *   v.transliteration?.toLowerCase().includes(q) ||
 *   v.english?.toLowerCase().includes(q)
 *
 * The Tamil branch checks membership against the untrimmed, un-lowercased
 * raw `query`. Tamil has no case, so lowercasing is harmless, but the
 * missing `.trim()` means a leading/trailing space (routine output from
 * Tamil IMEs) makes the Tamil branch silently return zero matches while
 * the transliteration/english branches (which use `q`) are unaffected.
 */

// Pick a real Tamil substring from the corpus at runtime so this test
// tracks the actual data rather than a hand-typed, possibly-wrong literal.
function findTamilToken(): string {
  for (const v of VERSES) {
    if (v.tamil && v.tamil.trim().length > 0) {
      // Take a contiguous run of Tamil-script (or any non-whitespace)
      // characters from the first line so we get a stable substring
      // that is guaranteed to appear verbatim in v.tamil.
      const firstLine = v.tamil.split('\n')[0].trim();
      const token = firstLine.split(/\s+/).find((w) => w.length >= 3);
      if (token) return token;
    }
  }
  throw new Error('No suitable Tamil token found in corpus — test setup is broken.');
}

// A token that is the FIRST word of the FIRST line of some verse's `tamil`
// field — i.e. it sits at the very start of the string, with nothing (not
// even a space) preceding it in that verse's text. Used to give a crisp,
// unambiguous repro for the leading-space case: this specific verse must be
// in the unpadded baseline, and must NOT be findable once a leading space
// is prepended to the query, because ' ' + token cannot occur at the start
// of the string.
function findStartOfTextToken(): { token: string; verseId: number } {
  for (const v of VERSES) {
    if (!v.tamil) continue;
    const firstLine = v.tamil.split('\n')[0]?.trim();
    if (!firstLine) continue;
    const firstWord = firstLine.split(/\s+/).find((w) => w.length >= 4);
    if (firstWord && v.tamil.startsWith(firstWord)) {
      return { token: firstWord, verseId: v.id };
    }
  }
  throw new Error('No suitable start-of-text Tamil token found — test setup is broken.');
}

// The mirror image: a token that is the LAST word of the LAST line of some
// verse's `tamil` field — nothing follows it in that verse's text. Used for
// a crisp, unambiguous repro of the trailing-space case: token + ' ' cannot
// occur at the end of the string, so this verse must be dropped once a
// trailing space is appended to the query.
function findEndOfTextToken(): { token: string; verseId: number } {
  for (const v of VERSES) {
    if (!v.tamil) continue;
    const lines = v.tamil.split('\n');
    const lastLine = lines[lines.length - 1]?.trim();
    if (!lastLine) continue;
    const words = lastLine.split(/\s+/).filter(Boolean);
    const lastWord = words[words.length - 1];
    if (lastWord && lastWord.length >= 4 && v.tamil.endsWith(lastWord)) {
      return { token: lastWord, verseId: v.id };
    }
  }
  throw new Error('No suitable end-of-text Tamil token found — test setup is broken.');
}

describe('searchVerses', () => {
  const tamilToken = findTamilToken();

  it('baseline: a real Tamil substring from the corpus returns matches', () => {
    expect(tamilToken.length).toBeGreaterThan(0);
    expect(searchVerses(tamilToken).length).toBeGreaterThan(0);
  });

  it(
    // PINS H3 — expected to FAIL until searchVerses uses trimmed q for the Tamil branch.
    'trailing space on a Tamil query returns the SAME results as no trailing space',
    () => {
      const withTrailingSpace = searchVerses(tamilToken + ' ');
      const baseline = searchVerses(tamilToken);
      // Today, withTrailingSpace is a proper SUBSET of baseline: any verse
      // where the token is followed by a space elsewhere in the text still
      // matches (v.tamil.includes(query) is a raw substring check), but
      // verses where the token only occurs at end-of-line/end-of-string
      // are silently dropped. This assertion documents the DESIRED
      // behavior (full equality) and fails against current (buggy) code.
      expect(withTrailingSpace).toEqual(baseline);
    }
  );

  it(
    // PINS H3 — expected to FAIL until searchVerses uses trimmed q for the Tamil branch.
    'leading space on a Tamil query returns the SAME results as no leading space',
    () => {
      const withLeadingSpace = searchVerses(' ' + tamilToken);
      const baseline = searchVerses(tamilToken);
      // Same shape of bug, mirrored: withLeadingSpace is a subset of
      // baseline, missing verses where the token occurs at the very start
      // of a line/string with no preceding space.
      expect(withLeadingSpace).toEqual(baseline);
    }
  );

  it(
    // PINS H3 — expected to FAIL until searchVerses uses trimmed q for the Tamil branch.
    'leading AND trailing space on a Tamil query returns the SAME results as neither',
    () => {
      const withBothSpaces = searchVerses(' ' + tamilToken + ' ');
      const baseline = searchVerses(tamilToken);
      expect(withBothSpaces).toEqual(baseline);
    }
  );

  it('REGRESSION H3: a trailing space drops no results and preserves order', () => {
    const baseline = searchVerses(tamilToken);
    const withTrailingSpace = searchVerses(tamilToken + ' ');
    expect(baseline.length).toBeGreaterThan(0);
    // Before the fix, searchVerses matched the Tamil branch against the raw
    // untrimmed `query`, so a trailing space silently dropped every verse
    // where the token was not followed by another word. Now identical.
    expect(withTrailingSpace.length).toEqual(baseline.length);
    expect(withTrailingSpace.map((v) => v.id)).toEqual(baseline.map((v) => v.id));
  });

  it('REGRESSION H3: a verse whose Tamil text ENDS with the query token survives a trailing space', () => {
    const { token, verseId } = findEndOfTextToken();
    const baseline = searchVerses(token);
    const withTrailingSpace = searchVerses(token + ' ');

    const baselineIds = baseline.map((v) => v.id);
    const trailingIds = withTrailingSpace.map((v) => v.id);

    expect(baselineIds).toContain(verseId);
    // This verse is the sharpest possible repro: nothing follows the token in
    // its Tamil text, so `includes(token + ' ')` could never match it. Tamil
    // IMEs routinely append a trailing space on word commit.
    expect(trailingIds).toContain(verseId);
  });

  it('REGRESSION H3: a verse whose Tamil text STARTS with the query token survives a leading space', () => {
    const { token, verseId } = findStartOfTextToken();
    const baseline = searchVerses(token);
    const withLeadingSpace = searchVerses(' ' + token);

    const baselineIds = baseline.map((v) => v.id);
    const leadingIds = withLeadingSpace.map((v) => v.id);

    expect(baselineIds).toContain(verseId);
    // Nothing precedes the token in this verse's text, so `includes(' ' + token)`
    // could never match it. A leading space arrives from pasted text.
    expect(leadingIds).toContain(verseId);
  });

  it('REGRESSION H3: a verse whose Tamil text ENDS with the query token survives BOTH a leading and trailing space', () => {
    const { token, verseId } = findEndOfTextToken();
    const baseline = searchVerses(token);
    const withBothSpaces = searchVerses(' ' + token + ' ');

    expect(baseline.map((v) => v.id)).toContain(verseId);
    // Padding on both sides was previously a guaranteed miss for this verse.
    expect(withBothSpaces.map((v) => v.id)).toContain(verseId);
  });

  it('transliteration search DOES tolerate surrounding whitespace (asymmetry proof, should PASS)', () => {
    // Find a real transliteration token from the corpus.
    const verseWithTranslit = VERSES.find((v) => v.transliteration && v.transliteration.trim().split(/\s+/)[0]?.length >= 3);
    expect(verseWithTranslit).toBeDefined();
    const translitToken = verseWithTranslit!.transliteration.trim().split(/\s+/)[0];

    const baseline = searchVerses(translitToken);
    expect(baseline.length).toBeGreaterThan(0);
    expect(searchVerses(translitToken + ' ')).toEqual(baseline);
    expect(searchVerses(' ' + translitToken)).toEqual(baseline);
    expect(searchVerses(' ' + translitToken + ' ')).toEqual(baseline);
  });

  it('english search DOES tolerate surrounding whitespace (asymmetry proof, should PASS)', () => {
    const verseWithEnglish = VERSES.find((v) => v.english && v.english.trim().split(/\s+/)[0]?.length >= 3);
    expect(verseWithEnglish).toBeDefined();
    const englishToken = verseWithEnglish!.english.trim().split(/\s+/)[0];

    const baseline = searchVerses(englishToken);
    expect(baseline.length).toBeGreaterThan(0);
    expect(searchVerses(englishToken + ' ')).toEqual(baseline);
    expect(searchVerses(' ' + englishToken)).toEqual(baseline);
  });

  it('empty query returns []', () => {
    expect(searchVerses('')).toEqual([]);
  });

  it('whitespace-only query returns []', () => {
    expect(searchVerses('   ')).toEqual([]);
  });

  it('english search is case-insensitive', () => {
    const verseWithEnglish = VERSES.find((v) => v.english && v.english.trim().split(/\s+/)[0]?.length >= 3);
    expect(verseWithEnglish).toBeDefined();
    const englishToken = verseWithEnglish!.english.trim().split(/\s+/)[0];

    const lower = searchVerses(englishToken.toLowerCase());
    const upper = searchVerses(englishToken.toUpperCase());
    expect(lower.length).toBeGreaterThan(0);
    expect(upper).toEqual(lower);
  });
});
