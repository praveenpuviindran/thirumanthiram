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
  /** Optional per-line color overrides. Index corresponds to line number. */
  lineColors?: string[];
  containerStyle?: StyleProp<ViewStyle>;
}

/**
 * Renders Tamil verse lines with automatic font scaling.
 *
 * Each poetic line is rendered as a separate Text node. After native layout,
 * onTextLayout reports how many visual lines the node occupies. If any node
 * wraps (> 1 visual line), the shared font size is decremented by 1pt and the
 * component re-renders with fresh layout measurements. This repeats until every
 * line fits on exactly one visual line, or MIN_FONT_SIZE is reached.
 *
 * Because font size is shared across all lines, the verse always scales
 * uniformly — no individual line shrinks independently.
 */
export function TamilVerseLines({
  tamilText,
  baseFontSize,
  textStyle,
  defaultColor,
  lineColors,
  containerStyle,
}: Props) {
  const lines = useMemo(() => tamilText.split('\n'), [tamilText]);
  const [fontSize, setFontSize] = useState(baseFontSize);
  const adjustingRef = useRef(false);

  // Reset font size and adjustment state whenever the verse or base size changes.
  useEffect(() => {
    adjustingRef.current = false;
    setFontSize(baseFontSize);
  }, [baseFontSize, tamilText]);

  // Clear the adjustment lock after each font size step so the next
  // onTextLayout cycle can trigger a further decrement if still needed.
  useEffect(() => {
    adjustingRef.current = false;
  }, [fontSize]);

  // Cheap identity key: length + first char code. Changing verse always
  // changes at least one of these, causing Text nodes to remount and fire
  // fresh onTextLayout callbacks.
  const textKey = `${tamilText.length}:${tamilText.charCodeAt(0) || 0}`;

  return (
    <View style={containerStyle}>
      {lines.map((line, i) => (
        <Text
          key={`${textKey}:${fontSize}:${i}`}
          style={[textStyle, { color: lineColors?.[i] ?? defaultColor, fontSize }]}
          allowFontScaling
          onTextLayout={(e: NativeSyntheticEvent<TextLayoutEventData>) => {
            if (adjustingRef.current) return;
            if (e.nativeEvent.lines.length > 1 && fontSize > MIN_FONT_SIZE) {
              adjustingRef.current = true;
              setFontSize(prev => Math.max(MIN_FONT_SIZE, prev - 1));
            }
          }}
        >
          {line}
        </Text>
      ))}
    </View>
  );
}
