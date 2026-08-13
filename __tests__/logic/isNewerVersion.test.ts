// Replicated verbatim from hooks/useAppUpdateCheck.ts:10-15 — MUST BE KEPT IN SYNC. Not exported by the source.
function isNewer(latest: string, current: string): boolean {
  const parse = (v: string) => v.split('.').map(Number);
  const [la, lb, lc] = parse(latest);
  const [ca, cb, cc] = parse(current);
  return la > ca || (la === ca && lb > cb) || (la === ca && lb === cb && lc > cc);
}

describe('isNewer — correct semver-ish behavior (baseline)', () => {
  it('1.1.4 vs 1.1.3 (patch bump) → true', () => {
    expect(isNewer('1.1.4', '1.1.3')).toBe(true);
  });

  it('equal versions → false', () => {
    expect(isNewer('1.1.3', '1.1.3')).toBe(false);
  });

  it('older version → false', () => {
    expect(isNewer('1.1.2', '1.1.3')).toBe(false);
  });

  it('major bump: 2.0.0 vs 1.9.9 → true', () => {
    expect(isNewer('2.0.0', '1.9.9')).toBe(true);
  });

  it('minor bump: 1.2.0 vs 1.1.9 → true', () => {
    expect(isNewer('1.2.0', '1.1.9')).toBe(true);
  });

  it('patch bump: 1.1.4 vs 1.1.3 → true', () => {
    expect(isNewer('1.1.4', '1.1.3')).toBe(true);
  });
});

describe('isNewer — pinned DEFECTS (current behavior, not desired behavior)', () => {
  it('two-segment "1.2" vs "1.1.9": la/lb decide it before lc (undefined) is ever consulted', () => {
    // parse('1.2') => [1, 2, undefined]  (lc = undefined)
    // Expected-vs-desired: desired = true (1.2 i.e. "1.2.0" > 1.1.9). Actual = true.
    // This one happens to be CORRECT, but only by luck: lb (2) already
    // differs from cb (1), so the `la === ca && lb > cb` clause resolves
    // the comparison to true before the third clause (which would divide
    // by the undefined lc) is ever reached.
    expect(isNewer('1.2', '1.1.9')).toBe(true);
  });

  it('BUG: two-segment "1.2" vs "1.2.0" — undefined lc silently loses to a numeric cc of 0, but this coincidentally matches "equal"', () => {
    // parse('1.2') => [1, 2, undefined]
    // la===ca && lb===cb, so result hinges on `lc > cc`, i.e. `undefined > 0`,
    // which is always false in JS. Desired = false (1.2 == 1.2.0, not newer).
    // Actual = false. Coincidentally correct here ONLY because `undefined > n`
    // is always false for any non-negative n — see the next test for where
    // this breaks down.
    expect(isNewer('1.2', '1.2.0')).toBe(false);
  });

  it('BUG: "1.2.1" vs two-segment "1.2" — undefined cc makes a genuinely newer version look NOT newer', () => {
    // parse('1.2') as current => [1, 2, undefined] => cc = undefined.
    // la===ca && lb===cb, so result hinges on `lc > cc`, i.e. `1 > undefined`,
    // which is always false in JS (undefined coerces to NaN).
    // Desired = true (1.2.1 > 1.2, i.e. > 1.2.0). Actual = false.
    // This is the real manifestation of the "lc is undefined" defect the
    // audit calls out: a genuine newer patch version is missed whenever the
    // CURRENT installed version string has fewer than 3 segments.
    expect(isNewer('1.2.1', '1.2')).toBe(false); // BUG: should be true
  });

  it('BUG: four-segment "1.1.3.1" vs "1.1.3" — the 4th segment is ignored entirely', () => {
    // parse('1.1.3.1') => [1, 1, 3, 1] destructured to (la, lb, lc) = (1, 1, 3);
    // the trailing `1` is dropped on the floor.
    // Desired = true (1.1.3.1 > 1.1.3). Actual = false.
    expect(isNewer('1.1.3.1', '1.1.3')).toBe(false); // BUG: should be true
  });

  it('BUG: four-segment "1.1.3.1" vs "1.1.3.0" — also treated as equal since only 3 segments are compared', () => {
    // Desired = true (1.1.3.1 > 1.1.3.0). Actual = false.
    expect(isNewer('1.1.3.1', '1.1.3.0')).toBe(false); // BUG: should be true
  });

  it('BUG: non-numeric segment "1.1.x" vs "1.1.0" — NaN comparisons are always false', () => {
    // parse('1.1.x') => [1, 1, NaN]. Any `NaN > n` / `n > NaN` is false.
    // Desired behavior is undefined/unspecified for malformed input, but the
    // actual failure mode is worth pinning: this can never be judged "newer"
    // no matter which side it's on (see next test too).
    expect(isNewer('1.1.x', '1.1.0')).toBe(false);
  });

  it('BUG: non-numeric segment "1.1.0" vs "1.1.x" — also always false, i.e. neither direction ever wins', () => {
    // parse('1.1.x') => [1, 1, NaN] on the `current` side this time.
    // Both isNewer('1.1.x','1.1.0') and isNewer('1.1.0','1.1.x') are false,
    // so a malformed version string can never trigger (or be treated as
    // superseding) an update in either direction — it's a silent dead end,
    // not a thrown error.
    expect(isNewer('1.1.0', '1.1.x')).toBe(false);
  });

  it('leading/trailing whitespace is tolerated — NOT actually a bug, documented for completeness', () => {
    // Expected-vs-desired: one might assume whitespace (e.g. a stray
    // newline from a config value) would corrupt the parse, since there is
    // no explicit .trim() anywhere in isNewer. In practice `String.split`
    // preserves the whitespace inside each segment, but `Number(' 1')`,
    // `Number('1 ')`, etc. coerce and trim automatically, so comparisons
    // still resolve correctly. Desired = true, Actual = true — whitespace
    // is a non-issue for this function, despite the missing .trim().
    expect(isNewer(' 1.1.4', '1.1.3')).toBe(true);
    expect(isNewer('1.1.4 ', '1.1.3')).toBe(true);
    expect(isNewer('1.1.4', '1.1.3 ')).toBe(true);
  });
});
