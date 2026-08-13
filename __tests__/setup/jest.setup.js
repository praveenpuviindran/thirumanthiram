/* eslint-env jest */
// Global mocks for native / Expo modules that have no JS implementation under Jest.
// Individual test files may override these with jest.mock(...) locally.

// --- AsyncStorage -----------------------------------------------------------
// The upstream mock is a CJS object; app code imports it as a default export,
// so expose it under both shapes.
jest.mock('@react-native-async-storage/async-storage', () => {
  const mock = require('@react-native-async-storage/async-storage/jest/async-storage-mock');
  return { __esModule: true, ...mock, default: mock };
});

// --- expo-font --------------------------------------------------------------
jest.mock('expo-font', () => ({
  useFonts: () => [true, null],
  loadAsync: jest.fn(() => Promise.resolve()),
  isLoaded: jest.fn(() => true),
}));

// --- expo-splash-screen -----------------------------------------------------
jest.mock('expo-splash-screen', () => ({
  preventAutoHideAsync: jest.fn(() => Promise.resolve()),
  hideAsync: jest.fn(() => Promise.resolve()),
}));

// --- expo-haptics -----------------------------------------------------------
jest.mock('expo-haptics', () => ({
  impactAsync: jest.fn(() => Promise.resolve()),
  notificationAsync: jest.fn(() => Promise.resolve()),
  selectionAsync: jest.fn(() => Promise.resolve()),
  ImpactFeedbackStyle: { Light: 'light', Medium: 'medium', Heavy: 'heavy' },
  NotificationFeedbackType: { Success: 'success', Warning: 'warning', Error: 'error' },
}));

// --- expo-speech ------------------------------------------------------------
jest.mock('expo-speech', () => ({
  speak: jest.fn(),
  stop: jest.fn(() => Promise.resolve()),
  pause: jest.fn(() => Promise.resolve()),
  resume: jest.fn(() => Promise.resolve()),
  isSpeakingAsync: jest.fn(() => Promise.resolve(false)),
  getAvailableVoicesAsync: jest.fn(() => Promise.resolve([])),
}));

// --- expo-av ----------------------------------------------------------------
jest.mock('expo-av', () => {
  const sound = {
    playAsync: jest.fn(() => Promise.resolve()),
    pauseAsync: jest.fn(() => Promise.resolve()),
    stopAsync: jest.fn(() => Promise.resolve()),
    unloadAsync: jest.fn(() => Promise.resolve()),
    setPositionAsync: jest.fn(() => Promise.resolve()),
    setOnPlaybackStatusUpdate: jest.fn(),
    getStatusAsync: jest.fn(() => Promise.resolve({ isLoaded: true, isPlaying: false })),
  };
  return {
    Audio: {
      Sound: {
        createAsync: jest.fn(() =>
          Promise.resolve({ sound, status: { isLoaded: true, isPlaying: false } })
        ),
      },
      setAudioModeAsync: jest.fn(() => Promise.resolve()),
      INTERRUPTION_MODE_IOS_DO_NOT_MIX: 1,
      INTERRUPTION_MODE_ANDROID_DO_NOT_MIX: 1,
    },
    ResizeMode: { CONTAIN: 'contain' },
    __sound: sound,
  };
});

// --- expo-blur / expo-linear-gradient ---------------------------------------
jest.mock('expo-blur', () => {
  const React = require('react');
  const { View } = require('react-native');
  return { BlurView: (props) => React.createElement(View, props, props.children) };
});

jest.mock('expo-linear-gradient', () => {
  const React = require('react');
  const { View } = require('react-native');
  return { LinearGradient: (props) => React.createElement(View, props, props.children) };
});

// --- expo-router ------------------------------------------------------------
// Mutable holder so tests can set the route params seen by useLocalSearchParams.
// Must live on globalThis: babel-plugin-jest-hoist forbids factories from closing
// over module-scope bindings.
globalThis.mockRouteParams = {};
globalThis.mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
  navigate: jest.fn(),
  canGoBack: jest.fn(() => true),
  setParams: jest.fn(),
};

jest.mock('expo-router', () => {
  const React = require('react');
  const { View, Pressable } = require('react-native');
  const routerMock = globalThis.mockRouter;
  return {
    router: routerMock,
    useRouter: () => routerMock,
    useLocalSearchParams: () => globalThis.mockRouteParams,
    useSearchParams: () => globalThis.mockRouteParams,
    useSegments: () => [],
    usePathname: () => '/',
    useNavigation: () => ({
      setOptions: jest.fn(),
      addListener: jest.fn(() => jest.fn()),
      navigate: jest.fn(),
      goBack: jest.fn(),
    }),
    useFocusEffect: jest.fn(),
    Link: ({ children, ...rest }) => React.createElement(Pressable, rest, children),
    Stack: Object.assign(
      ({ children }) => React.createElement(View, null, children),
      { Screen: () => null }
    ),
    Tabs: Object.assign(
      ({ children }) => React.createElement(View, null, children),
      { Screen: () => null }
    ),
    SplashScreen: {
      preventAutoHideAsync: jest.fn(),
      hideAsync: jest.fn(),
    },
    __routerMock: routerMock,
  };
});

// --- react-native-safe-area-context -----------------------------------------
jest.mock('react-native-safe-area-context', () => {
  const React = require('react');
  const { View } = require('react-native');
  const inset = { top: 0, right: 0, bottom: 0, left: 0 };
  return {
    SafeAreaProvider: ({ children }) => React.createElement(View, null, children),
    SafeAreaView: ({ children, ...rest }) => React.createElement(View, rest, children),
    useSafeAreaInsets: () => inset,
    useSafeAreaFrame: () => ({ x: 0, y: 0, width: 390, height: 844 }),
    initialWindowMetrics: { insets: inset, frame: { x: 0, y: 0, width: 390, height: 844 } },
  };
});

// Silence the RN Animated "useNativeDriver is not supported" noise.
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper', () => ({
  __esModule: true,
  default: { API: {}, assertNativeAnimatedModule: jest.fn(), shouldUseNativeDriver: () => false },
  API: {},
  assertNativeAnimatedModule: jest.fn(),
  shouldUseNativeDriver: () => false,
}), { virtual: true });
