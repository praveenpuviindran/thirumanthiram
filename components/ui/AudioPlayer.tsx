import React from 'react';
import {
  View, Text, TouchableOpacity, StyleSheet, ActivityIndicator,
} from 'react-native';
import { useTheme } from '../../constants/Theme';
import { AudioState } from '../../hooks/useAudio';
import { Radius, FontSize, Spacing } from '../../constants/Colors';

interface Props {
  state: AudioState;
  position: number;
  duration: number;
  onPlay: () => void;
  onPause: () => void;
  onSeek: (ms: number) => void;
  hasAudio: boolean;
}

function formatTime(ms: number): string {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  return `${m}:${String(s % 60).padStart(2, '0')}`;
}

export function AudioPlayer({ state, position, duration, onPlay, onPause, onSeek, hasAudio }: Props) {
  const theme = useTheme();

  if (!hasAudio) {
    return (
      <View style={[styles.container, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
        <Text style={[styles.noAudioText, { color: theme.textMuted }]}>
          🎵 Audio coming soon — recitation will be available in a future update
        </Text>
      </View>
    );
  }

  const progress = duration > 0 ? position / duration : 0;

  return (
    <View style={[styles.container, { backgroundColor: theme.bgCard, borderColor: theme.border }]}>
      <View style={styles.row}>
        {/* Play / Pause button */}
        <TouchableOpacity
          style={[styles.playBtn, { backgroundColor: theme.saffron }]}
          onPress={state === 'playing' ? onPause : onPlay}
          activeOpacity={0.8}
        >
          {state === 'loading' ? (
            <ActivityIndicator color="#FFF" size="small" />
          ) : (
            <Text style={styles.playIcon}>
              {state === 'playing' ? '⏸' : '▶'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.progressArea}>
          {/* Track */}
          <TouchableOpacity
            style={[styles.track, { backgroundColor: theme.border }]}
            onPress={(e) => {
              const { locationX, target } = e.nativeEvent;
              // Simple seek on tap
              onSeek(duration * Math.min(Math.max(locationX / 220, 0), 1));
            }}
            activeOpacity={1}
          >
            <View
              style={[
                styles.fill,
                { backgroundColor: theme.saffron, width: `${progress * 100}%` },
              ]}
            />
            <View
              style={[
                styles.thumb,
                {
                  backgroundColor: theme.saffronLight,
                  left: `${progress * 100}%` as any,
                },
              ]}
            />
          </TouchableOpacity>

          {/* Time */}
          <View style={styles.timeRow}>
            <Text style={[styles.timeText, { color: theme.textMuted }]}>
              {formatTime(position)}
            </Text>
            <Text style={[styles.timeText, { color: theme.textMuted }]}>
              {formatTime(duration)}
            </Text>
          </View>
        </View>
      </View>

      {state === 'error' && (
        <Text style={[styles.errorText, { color: '#C0392B' }]}>
          Could not load audio. Please try again.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: Radius.md,
    borderWidth: 1,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  playBtn: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playIcon: {
    fontSize: 18,
    color: '#FFF',
  },
  progressArea: {
    flex: 1,
    gap: 4,
  },
  track: {
    height: 4,
    borderRadius: 2,
    position: 'relative',
    overflow: 'visible',
  },
  fill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 2,
  },
  thumb: {
    position: 'absolute',
    top: -6,
    width: 16,
    height: 16,
    borderRadius: 8,
    marginLeft: -8,
  },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: FontSize.xs,
  },
  noAudioText: {
    fontSize: FontSize.sm,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    fontSize: FontSize.xs,
    marginTop: 6,
    textAlign: 'center',
  },
});
