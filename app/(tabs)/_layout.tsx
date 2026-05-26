import { Tabs } from 'expo-router';
import { useColorScheme, Text } from 'react-native';
import { Colors } from '../../constants/Colors';

function TabIcon({ label, active, color }: { label: string; active: boolean; color: string }) {
  const icons: Record<string, string> = {
    Home:       '⌂',
    Tantras:    '☰',
    Search:     '⌕',
    Dictionary: '◉',
    Favorites:  '★',
    Settings:   '⚙',
  };
  return (
    <Text style={{ fontSize: 20, color, opacity: active ? 1 : 0.6 }}>
      {icons[label] ?? '•'}
    </Text>
  );
}

export default function TabLayout() {
  const scheme = useColorScheme();
  const dark = scheme === 'dark';

  const tabBarStyle = {
    backgroundColor: dark ? Colors.bgMid : '#EDE4D8',
    borderTopColor:  dark ? Colors.border : Colors.borderLight,
    borderTopWidth:  1,
    paddingBottom:   4,
    height:          60,
  };

  return (
    <Tabs
      screenOptions={{
        headerShown:           false,
        tabBarStyle,
        tabBarActiveTintColor: Colors.saffron,
        tabBarInactiveTintColor: dark ? Colors.textMuted : '#8A6A50',
        tabBarLabelStyle: { fontSize: 11, marginTop: -2 },
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
    </Tabs>
  );
}
