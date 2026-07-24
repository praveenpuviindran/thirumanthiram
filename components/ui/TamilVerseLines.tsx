import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Text,
  View,
  StyleProp,
  TextStyle,
  ViewStyle,
  NativeSyntheticEvent,
  TextLayoutEventData,
} from 'react-native';

const MIN_FONT_SIZE = 12;

interface Props {
  tamilText: string;
  baseFontSize: number;
  textStyle: StyleProp<TextStyle>;
  defaultColor: string;
  /** Per-line color overrides indexed by line position. */
  lineColors?: string[];
  containerStyle?: StyleProp<ViewStyle>;
  /** Unique stable ID for this verse. Used in Text keys to guarantee
   *  remount (and fresh onTextLayout) when navigating between verses. */
  verseId?: number | string;
}

/**
 * Renders Tamil verse lines with automatic uniform font scaling.
 *
 * Algorithm:
 *  1. Render all lines at baseFontSize.
 *  2. Collect onTextLayout results from every line.
 *  3. Once ALL lines have reported, check whether any wrapped (lines.length > 1).
 *  4. If any wrapped → decrement shared fontSize by 1pt and go to step 1.
 *  5. Stop when all lines fit on one visual row, or MIN_FONT_SIZE is reached.
 *
 * Stale-callback safety: every measurement cycle gets a unique generation
 * number captured in each Text node's closure. Callbacks from previous
 * renders are silently discarded.
 *
 * Debug: in __DEV__, each cycle logs verseId, current fontSize, and per-line
 * visual row counts. Final settled size is also logged.
 */
export function TamilVerseLines({
  tamilText,
  baseFontSize,
  textStyle,
  defaultColor,
  lineColors,
  containerStyle,
  verseId,
}: Props) {
  const lines = useMemo(() => tamilText.split('\n'), [tamilText]);
  const [fontSize, setFontSize] = useState(baseFontSize);

  // Monotonically increasing counter. Each measurement cycle (and each
  // verse/baseFontSize reset) bumps this. Text node closures capture it at
  // render time; callbacks whose captured value differs from current are stale.
  const genRef = useRef(0);

  // Collected visual-row counts for the active measurement cycle.
  // Key: line index. Value: number of visual rows (1 = fits, >1 = wrapped).
  const layoutsRef = useRef<Map<number, number>>(new Map());

  // Baseline size at the start of each verse, for debug logging only.
  const initialFontRef = useRef(baseFontSize);

  // ─── Reset when verse text or user-selected base size changes ───────────
  useEffect(() => {
    initialFontRef.current = baseFontSize;
    genRef.current += 1;
    layoutsRef.current = new Map();
    setFontSize(baseFontSize);
  }, [baseFontSize, tamilText]);

  const lineCount = lines.length;

  // Stable key prefix: verseId when available, otherwise first 12 chars of
  // tamilText. Must change whenever the verse changes so Text nodes remount.
  const keyPrefix = verseId != null ? String(verseId) : tamilText.slice(0, 12);

  return (
    <View style={containerStyle}>
      {lines.map((line, i) => {
        // Capture generation at render time. This value travels with the
        // closure; if genRef.current has advanced by the time the callback
        // fires, the callback is from an old render and must be ignored.
        const capturedGen = genRef.current;
        const capturedFontSize = fontSize;

        return (
          <Text
            key={`${keyPrefix}:${fontSize}:${i}`}
            style={[textStyle, { color: lineColors?.[i] ?? defaultColor, fontSize }]}
            allowFontScaling
            onTextLayout={(e: NativeSyntheticEvent<TextLayoutEventData>) => {
              // ── Stale-callback guard ──────────────────────────────────────
              if (capturedGen !== genRef.current) return;

              const visualRows = e.nativeEvent.lines.length;
              layoutsRef.current.set(i, visualRows);

              // Wait until every line has checked in for this cycle.
              if (layoutsRef.current.size < lineCount) return;

              // ── All lines reported — log and decide ───────────────────────
              if (__DEV__) {
                const detail = Array.from(layoutsRef.current.entries())
                  .sort(([a], [b]) => a - b)
                  .map(([idx, rows]) => `line${idx}=${rows}`)
                  .join(', ');
                console.log(
                  `[TamilVerseLines] id=${verseId ?? '?'} | ` +
                  `initial=${initialFontRef.current} | ` +
                  `current=${capturedFontSize} | ${detail}`
                );
              }

              const anyWrapped = Array.from(layoutsRef.current.values()).some(v => v > 1);

              if (anyWrapped && capturedFontSize > MIN_FONT_SIZE) {
                const next = Math.max(MIN_FONT_SIZE, capturedFontSize - 1);

                if (__DEV__) {
                  console.log(
                    `[TamilVerseLines] id=${verseId ?? '?'} wrapping → ` +
                    `reduce ${capturedFontSize} → ${next}`
                  );
                }

                // Advance generation BEFORE state update so any lingering
                // callbacks from the current render are discarded immediately.
                genRef.current += 1;
                layoutsRef.current = new Map();
                setFontSize(next);

              } else if (__DEV__ && !anyWrapped) {
                if (capturedFontSize !== initialFontRef.current) {
                  console.log(
                    `[TamilVerseLines] id=${verseId ?? '?'} SETTLED ` +
                    `${initialFontRef.current} → ${capturedFontSize}`
                  );
                }
              }
            }}
          >
            {line}
          </Text>
        );
      })}
    </View>
  );
}
