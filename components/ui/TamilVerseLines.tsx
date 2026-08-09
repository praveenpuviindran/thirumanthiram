import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  Text,
  View,
  StyleSheet,
  StyleProp,
  TextStyle,
  ViewStyle,
  NativeSyntheticEvent,
  TextLayoutEventData,
  LayoutChangeEvent,
} from 'react-native';

const MIN_FONT_SIZE = 12;

interface Props {
  tamilText: string;
  baseFontSize: number;
  textStyle: StyleProp<TextStyle>;
  defaultColor: string;
  lineColors?: string[];
  containerStyle?: StyleProp<ViewStyle>;
  verseId?: number | string;
}

/**
 * Renders Tamil verse lines with automatic uniform font scaling.
 *
 * Measurement strategy (cross-platform):
 *  • onTextLayout  — reliable on React Native (native). Reports visual line count directly.
 *  • onLayout      — reliable on React Native Web. Height / fixedLineHeight gives visual rows.
 * Both callbacks call report(). Math.max ensures the most-wrapped reading wins.
 *
 * Algorithm:
 *  1. Render all lines at baseFontSize.
 *  2. Collect row counts from every line (via either callback).
 *  3. Once ALL lines have reported, check if any has rows > 1.
 *  4. If yes → decrement shared fontSize by 1pt and repeat.
 *  5. Stop when all lines fit on one visual row, or MIN_FONT_SIZE is reached.
 *
 * Stale-callback safety: genRef is ONLY incremented inside the onLayout/onTextLayout
 * callback, immediately before setFontSize(). Callbacks from a superseded render cycle
 * capture an old gen and are silently discarded.
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
  const genRef = useRef(0);
  const layoutsRef = useRef<Map<number, number>>(new Map());
  const initialFontRef = useRef(baseFontSize);

  // Extract the fixed lineHeight from textStyle so the onLayout height-comparison
  // works on web (RNW). If no lineHeight is in the style we fall back to fontSize×1.875
  // (empirical for NotoSerifTamil), computed per-render inside the map below.
  const fixedLineHeight = useMemo<number | null>(() => {
    try {
      const flat = StyleSheet.flatten(textStyle);
      if (flat && typeof flat.lineHeight === 'number') return flat.lineHeight;
    } catch {}
    return null;
  }, [textStyle]);

  // Reset when verse or user-selected base size changes.
  // Do NOT touch genRef here — the effect fires after commit but before
  // onTextLayout/onLayout. Incrementing genRef here discards every initial
  // callback as stale, preventing font reduction from ever triggering.
  useEffect(() => {
    initialFontRef.current = baseFontSize;
    layoutsRef.current = new Map();
    setFontSize(baseFontSize);
  }, [baseFontSize, tamilText]);

  const lineCount = lines.length;
  const keyPrefix = verseId != null ? String(verseId) : tamilText.slice(0, 12);

  return (
    <View style={containerStyle}>
      {lines.map((line, i) => {
        const capturedGen = genRef.current;
        const capturedFontSize = fontSize;
        // Single-line height: fixed from style (preferred) or font-size estimate.
        const capturedSLH = fixedLineHeight ?? capturedFontSize * 1.875;

        const report = (rows: number) => {
          if (capturedGen !== genRef.current) return;

          // Take the maximum row count seen for this line (either callback can win).
          const prev = layoutsRef.current.get(i) ?? 1;
          layoutsRef.current.set(i, Math.max(prev, rows));

          // Wait until every line has reported at least once for this cycle.
          if (layoutsRef.current.size < lineCount) return;

          if (__DEV__) {
            const detail = Array.from(layoutsRef.current.entries())
              .sort(([a], [b]) => a - b)
              .map(([idx, r]) => `line${idx}=${r}`)
              .join(', ');
            console.log(
              `[TamilVerseLines] id=${verseId ?? '?'} | ` +
              `initial=${initialFontRef.current} | ` +
              `current=${capturedFontSize} | singleLineH=${capturedSLH.toFixed(1)} | ${detail}`
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
            // Advance generation BEFORE state update so sibling callbacks from
            // this render (and any late arrivals) are discarded immediately.
            genRef.current += 1;
            layoutsRef.current = new Map();
            setFontSize(next);
          } else if (__DEV__ && !anyWrapped) {
            if (capturedFontSize !== initialFontRef.current) {
              console.log(
                `[TamilVerseLines] id=${verseId ?? '?'} SETTLED ` +
                `${initialFontRef.current} → ${capturedFontSize}`
              );
            } else {
              console.log(
                `[TamilVerseLines] id=${verseId ?? '?'} fits at base size ${capturedFontSize}`
              );
            }
          }
        };

        return (
          <Text
            key={`${keyPrefix}:${fontSize}:${i}`}
            style={[textStyle, { color: lineColors?.[i] ?? defaultColor, fontSize }]}
            allowFontScaling
            onTextLayout={(e: NativeSyntheticEvent<TextLayoutEventData>) => {
              // Primary for native: native text engine reports exact visual line count.
              report(e.nativeEvent.lines.length);
            }}
            onLayout={(e: LayoutChangeEvent) => {
              // Cross-platform fallback: actual rendered height vs expected single-line height.
              // This is the reliable path on React Native Web, where onTextLayout.lines.length
              // can under-count for Tamil Unicode (complex grapheme clusters).
              const h = e.nativeEvent.layout.height;
              const rows = h > capturedSLH * 1.5 ? 2 : 1;
              report(rows);
            }}
          >
            {line}
          </Text>
        );
      })}
    </View>
  );
}
