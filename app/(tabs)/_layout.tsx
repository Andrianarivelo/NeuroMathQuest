import React from 'react';
import { Tabs } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useI18n } from '../../src/i18n';

function TabIcon({ name, color, size }: { name: string; color: string; size: number }) {
  switch (name) {
    case 'home':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M3 12l2-2 7-7 7 7 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M9 22V12h6v10" fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
        </Svg>
      );
    case 'learn':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
          <Path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
        </Svg>
      );
    case 'review':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" fill="none" stroke={color} strokeWidth={2} />
          <Circle cx={12} cy={12} r={3} fill="none" stroke={color} strokeWidth={2} />
        </Svg>
      );
    case 'progress':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M18 20V10M12 20V4M6 20v-6" fill="none" stroke={color} strokeWidth={2.5} strokeLinecap="round" />
        </Svg>
      );
    case 'profile':
      return (
        <Svg width={size} height={size} viewBox="0 0 24 24">
          <Path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" fill="none" stroke={color} strokeWidth={2} />
          <Circle cx={12} cy={7} r={4} fill="none" stroke={color} strokeWidth={2} />
        </Svg>
      );
    default:
      return null;
  }
}

export default function TabsLayout() {
  const theme = useTheme();
  const { t } = useI18n();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.colors.bgElevated,
          borderTopColor: theme.colors.border,
          height: 60,
          paddingBottom: 6,
        },
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textMuted,
        tabBarLabelStyle: { fontWeight: '700', fontSize: 11 },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: t('Home'),
          tabBarIcon: ({ color, size }) => <TabIcon name="home" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="learn"
        options={{
          title: t('Learn'),
          tabBarIcon: ({ color, size }) => <TabIcon name="learn" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="review"
        options={{
          title: t('Exam'),
          tabBarIcon: ({ color, size }) => <TabIcon name="review" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="progress"
        options={{
          title: t('Progress'),
          tabBarIcon: ({ color, size }) => <TabIcon name="progress" color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: t('Profile'),
          tabBarIcon: ({ color, size }) => <TabIcon name="profile" color={color} size={size} />,
        }}
      />
    </Tabs>
  );
}
