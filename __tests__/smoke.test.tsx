import React from 'react';
import { Text, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

describe('harness smoke test', () => {
  it('runs plain JS assertions', () => {
    expect(1 + 1).toBe(2);
  });

  it('renders a React Native tree via @testing-library/react-native', () => {
    render(
      <View>
        <Text>harness ok</Text>
      </View>
    );
    expect(screen.getByText('harness ok')).toBeTruthy();
  });

  it('has AsyncStorage mocked', async () => {
    const AsyncStorage = require('@react-native-async-storage/async-storage').default;
    await AsyncStorage.setItem('k', 'v');
    await expect(AsyncStorage.getItem('k')).resolves.toBe('v');
  });
});
