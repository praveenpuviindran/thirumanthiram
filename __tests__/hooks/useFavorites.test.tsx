import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFavorites } from '../../hooks/useFavorites';

const STORAGE_KEY = '@thirumanthiram_favorites';

/**
 * Renders one independent instance of useFavorites(), exposing its state as
 * text nodes and its actions as pressable buttons, so tests can drive and
 * observe the hook without needing to reach into React internals.
 */
function FavoritesConsumer({ testID, ids }: { testID: string; ids: number[] }) {
  const { favorites, isFavorite, toggleFavorite, loaded } = useFavorites();
  return (
    <View testID={testID}>
      <Text testID={`${testID}-loaded`}>{String(loaded)}</Text>
      <Text testID={`${testID}-favorites`}>{JSON.stringify(favorites)}</Text>
      {ids.map((id) => (
        <React.Fragment key={id}>
          <Text testID={`${testID}-isFav-${id}`}>{String(isFavorite(id))}</Text>
          <Pressable testID={`${testID}-toggle-${id}`} onPress={() => toggleFavorite(id)}>
            <Text>toggle {id}</Text>
          </Pressable>
        </React.Fragment>
      ))}
    </View>
  );
}

beforeEach(async () => {
  jest.clearAllMocks();
  await AsyncStorage.clear();
});

describe('useFavorites — baseline (should pass)', () => {
  it('starts empty and loaded flips true after the mount effect resolves', async () => {
    render(<FavoritesConsumer testID="a" ids={[]} />);

    // Immediately after render, the mount effect's AsyncStorage.getItem promise
    // has not resolved yet — favorites starts empty and loaded starts false.
    expect(screen.getByTestId('a-favorites').props.children).toBe('[]');

    await waitFor(() => {
      expect(screen.getByTestId('a-loaded').props.children).toBe('true');
    });
  });

  it('hydrates favorites from AsyncStorage key @thirumanthiram_favorites', async () => {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify([5, 9]));

    render(<FavoritesConsumer testID="a" ids={[5, 9]} />);

    await waitFor(() => {
      expect(screen.getByTestId('a-loaded').props.children).toBe('true');
    });
    expect(screen.getByTestId('a-favorites').props.children).toBe('[5,9]');
    expect(screen.getByTestId('a-isFav-5').props.children).toBe('true');
    expect(screen.getByTestId('a-isFav-9').props.children).toBe('true');
  });

  it('toggleFavorite adds then removes an id; isFavorite reflects it', async () => {
    render(<FavoritesConsumer testID="a" ids={[42]} />);
    await waitFor(() => {
      expect(screen.getByTestId('a-loaded').props.children).toBe('true');
    });

    expect(screen.getByTestId('a-isFav-42').props.children).toBe('false');

    fireEvent.press(screen.getByTestId('a-toggle-42'));
    await waitFor(() => {
      expect(screen.getByTestId('a-isFav-42').props.children).toBe('true');
    });

    fireEvent.press(screen.getByTestId('a-toggle-42'));
    await waitFor(() => {
      expect(screen.getByTestId('a-isFav-42').props.children).toBe('false');
    });
  });

  it('persists JSON to AsyncStorage under the favorites key on toggle', async () => {
    render(<FavoritesConsumer testID="a" ids={[42]} />);
    await waitFor(() => {
      expect(screen.getByTestId('a-loaded').props.children).toBe('true');
    });

    fireEvent.press(screen.getByTestId('a-toggle-42'));

    await waitFor(() => {
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(STORAGE_KEY, JSON.stringify([42]));
    });
  });
});

describe('useFavorites — C2 (expected to fail today)', () => {
  it('PINS C2 — no shared store; two consumers hold independent state. Expected to FAIL until a FavoritesProvider exists.', async () => {
    render(
      <View>
        <FavoritesConsumer testID="A" ids={[42]} />
        <FavoritesConsumer testID="B" ids={[42]} />
      </View>
    );

    await waitFor(() => {
      expect(screen.getByTestId('A-loaded').props.children).toBe('true');
      expect(screen.getByTestId('B-loaded').props.children).toBe('true');
    });

    fireEvent.press(screen.getByTestId('A-toggle-42'));
    await waitFor(() => {
      expect(screen.getByTestId('A-isFav-42').props.children).toBe('true');
    });

    // This models favorites.tsx and verse/[id].tsx both holding a live
    // useFavorites() instance simultaneously (Tabs.Screen href:null never
    // unmounts). Consumer B should observe A's toggle but each hook call is
    // an isolated useState, so B never updates.
    expect(screen.getByTestId('B-isFav-42').props.children).toBe('true');
  });

  it('PINS C2 — lost-update race: two consumers toggling different ids clobber each other in storage. Expected to FAIL until a FavoritesProvider exists.', async () => {
    render(
      <View>
        <FavoritesConsumer testID="A" ids={[1]} />
        <FavoritesConsumer testID="B" ids={[2]} />
      </View>
    );

    await waitFor(() => {
      expect(screen.getByTestId('A-loaded').props.children).toBe('true');
      expect(screen.getByTestId('B-loaded').props.children).toBe('true');
    });

    fireEvent.press(screen.getByTestId('A-toggle-1'));
    await waitFor(() => {
      expect(screen.getByTestId('A-isFav-1').props.children).toBe('true');
    });

    fireEvent.press(screen.getByTestId('B-toggle-2'));
    await waitFor(() => {
      expect(screen.getByTestId('B-isFav-2').props.children).toBe('true');
    });

    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    const stored = JSON.parse(raw ?? '[]') as number[];

    // Today B's persist() call closes over B's own stale `prev` ([]), so its
    // write ([2]) clobbers A's earlier write ([1]) — AsyncStorage ends up
    // holding only the LAST writer's id, not both.
    expect([...stored].sort()).toEqual([1, 2]);
  });
});
