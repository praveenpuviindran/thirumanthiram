import { Tabs } from 'expo-router';
import { useColorScheme, Text, useWindowDimensions, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors } from '../../constants/Colors';

// Tab bar chrome (icons + labels) is compact, fixed-frame UI, not reading
// content — Dynamic Type is capped here rather than left unbounded, so the
// bar grows predictably instead of needing to track the full accessibility
// range. `maxFontSizeMultiplier` still lets the OS scale it up to this cap.
const TAB_BAR_MAX_FONT_SCALE = 1.3;

// Height at fontScale 1 (56, tuned by design), split into the fixed bottom
// breathing room (3, already accounts for this bar's safe-area treatment —
// left untouched) and the remaining icon+label content zone (53), which is
// the part that actually needs more room as text scales.
const TAB_BAR_BASE_HEIGHT = 56;
const TAB_BAR_BOTTOM_PADDING = 3;
const TAB_BAR_CONTENT_HEIGHT = TAB_BAR_BASE_HEIGHT - TAB_BAR_BOTTOM_PADDING;

function TabIcon({ label, active, color }: { label: string; active: boolean; color: string }) {
  const icons: Record<string, string> = {
    Home:        '⌂',
    Tantras:     '☰',
    Search:      '⌕',
    Dictionary:  'அ',
    Favorites:   '★',
    Settings:    '⚙',
  };
  return (
    <Text
      style={{ fontSize: 19, color, opacity: active ? 1 : 0.6 }}
      maxFontSizeMultiplier={TAB_BAR_MAX_FONT_SCALE}
    >
      {icons[label] ?? '•'}
    </Text>
  );
}

// react-navigation's built-in tabBarLabelStyle has no maxFontSizeMultiplier
// knob, so the label is rendered here directly to get the same capped growth
// as the icon above (color/focused come from react-navigation's own render
// prop, keeping the existing active/inactive tint behavior unchanged).
function TabLabel({ children, color }: { children: string; color: string }) {
  return (
    <Text
      style={{ fontSize: 10, marginTop: -2, color }}
      maxFontSizeMultiplier={TAB_BAR_MAX_FONT_SCALE}
      numberOfLines={1}
    >
      {children}
    </Text>
  );
}

export default function TabLayout() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';
  const { fontScale } = useWindowDimensions();
  const insets = useSafeAreaInsets();

  // Android with edge-to-edge (app.json: edgeToEdgeEnabled) lets content draw
  // behind the system navigation bar (gesture pill or 3-button bar) unless
  // something explicitly reserves that space. The bar's real height varies by
  // device/OS version, so it has to come from the live inset, not a constant.
  // iOS is untouched: insets.bottom there is 0 for this bar (its home
  // indicator area is already handled elsewhere), so this is a no-op on iOS.
  const androidNavInset = Platform.OS === 'android' ? insets.bottom : 0;

  const cappedScale = Math.min(fontScale, TAB_BAR_MAX_FONT_SCALE);
  // >= 1 always, so this is a no-op (exactly 56) at the default "large" size.
  const tabBarHeight = Math.round(TAB_BAR_CONTENT_HEIGHT * Math.max(cappedScale, 1)) + TAB_BAR_BOTTOM_PADDING + androidNavInset;

  const tabBarStyle = {
    backgroundColor: dark ? Colors.bgMid : '#EDE4D8',
    borderTopColor:  dark ? Colors.border : Colors.borderLight,
    borderTopWidth:  1,
    paddingBottom:   TAB_BAR_BOTTOM_PADDING + androidNavInset,
    height:          tabBarHeight,
  };

  return (
    <Tabs
      backBehavior="history"
      screenOptions={{
        headerShown:             false,
        tabBarStyle,
        tabBarActiveTintColor:   Colors.saffron,
        tabBarInactiveTintColor: dark ? Colors.textMuted : Colors.textMutedOnLight,
        tabBarLabel:             ({ children, color }) => (
          <TabLabel color={color}>{children}</TabLabel>
        ),
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon label="Home" active={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="tantras"
        options={{
          title: 'Tantras',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon label="Tantras" active={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon label="Search" active={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="dictionary"
        options={{
          title: 'Dictionary',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon label="Dictionary" active={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon label="Favorites" active={focused} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon label="Settings" active={focused} color={color} />
          ),
        }}
      />
      {/* Tantra and verse detail screens — hidden from tab bar */}
      <Tabs.Screen
        name="tantra/[id]"
        options={{ href: null }}
      />
      <Tabs.Screen
        name="verse/[id]"
        options={{ href: null }}
      />
    </Tabs>
  );
}
