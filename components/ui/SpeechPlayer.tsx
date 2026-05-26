import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../../constants/Theme';
import { useSpeech } from '../../hooks/useSpeech';
import { Spacing, Radius, FontSize, Colors } from '../../constants/Colors';

interface Props {
  tamilText: string;
  englishText: string;
}

function SpeakBtn({
  label, sublabel, isActive, onPress, color,
}: {
  label: string; sublabel: string; isActive: boolean; onPress: () => void; color: string;
}) {
  const theme = useTheme();
  return (
    <TouchableOpacity
      style={[
        styles.btn,
        {
          borderColor: isActive ? color : theme.border,
          backgroundColor: isActive ? color + '1A' : theme.bg,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.75}
    >
      <View style={[styles.btnIcon, { backgroundColor: isActive ? color : theme.border + '88' }]}>
        <Text style={[styles.btnIconText, { color: isActive ? '#FFF' : theme.textMuted }]}>
          {isActive ? '■' : '▶'}
        </Text>
      </View>
      <View style={styles.btnTextCol}>
        <Text style={[styles.btnLabel, { color: isActive ? color : theme.text }]}>{label}</Text>
        <Text style={[styles.btnSub, { color: theme.textMuted }]}>{sublabel}</Text>
      </View>
    </TouchableOpacity>
  );
}

export function SpeechPlayer({ tamilText, englishText }: Props) {
  const theme = useTheme();
  const { activeLang, speak, stop } = useSpeech();

  return (
    <View style={[styles.container, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={[styles.dot, { backgroundColor: Colors.saffron }]} />
        <Text style={[styles.headerLabel, { color: theme.textMuted }]}>LISTEN</Text>
        <View style={[styles.headerLine, { backgroundColor: theme.border }]} />
      </View>

      <View style={styles.btnRow}>
        <SpeakBtn
          label="Tamil"
          sublabel="தமிழ் ஒலி"
          isActive={activeLang === 'tamil'}
          onPress={() => speak(tamilText, 'tamil')}
          color={Colors.saffron}
        />
        <SpeakBtn
          label="English"
          sublabel="Audio reading"
          isActive={activeLang === 'english'}
          onPress={() => speak(englishText, 'english')}
          color={Colors.saffron}
        />
      </View>

      {activeLang && (
        <LinearGradient
          colors={[Colors.saffron + '00', Colors.saffron + '18']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.playingBar}
        >
          <View style={styles.waveRow}>
            {[3, 6, 9, 7, 11, 5, 8, 4, 10, 6, 9, 5, 7, 3, 8].map((h, i) => (
              <View
                key={i}
                style={[
                  styles.waveLine,
                  {
                    height: h * 2,
                    backgroundColor: Colors.saffron,
                    opacity: 0.4 + (i % 3) * 0.2,
                  },
                ]}
              />
            ))}
          </View>
          <TouchableOpacity onPress={stop} style={[styles.stopChip, { borderColor: theme.border }]}>
            <Text style={[styles.stopText, { color: theme.textMuted }]}>■ Stop</Text>
          </TouchableOpacity>
        </LinearGradient>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.md,
    borderWidth: 1,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingTop: 12,
    paddingBottom: 10,
    gap: 6,
  },
  dot: { width: 5, height: 5, borderRadius: 99 },
  headerLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 2 },
  headerLine: { flex: 1, height: 1 },
  btnRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.md,
  },
  btn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: Radius.sm,
    borderWidth: 1,
    padding: 10,
  },
  btnIcon: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnIconText: { fontSize: 10, fontWeight: '800' },
  btnTextCol: { flex: 1 },
  btnLabel: { fontSize: FontSize.sm, fontWeight: '700' },
  btnSub: { fontSize: 10, marginTop: 1 },
  playingBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(212,112,10,0.15)',
  },
  waveRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    height: 22,
  },
  waveLine: { width: 2, borderRadius: 2 },
  stopChip: {
    borderWidth: 1,
    borderRadius: Radius.sm,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  stopText: { fontSize: FontSize.xs, fontWeight: '600' },
});
