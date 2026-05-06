import React, { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider } from '../src/theme/ThemeProvider';
import { initDb } from '../src/db/db';
import { settingsRepository, AppSettings, defaultSettings } from '../src/repositories/settingsRepository';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [ready, setReady] = useState(false);
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);

  useEffect(() => {
    initDb();
    setSettings(settingsRepository.getAll());
    setReady(true);
  }, []);

  if (!ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAF9F7' }}>
        <ActivityIndicator size="large" color="#0E9E74" />
      </View>
    );
  }

  return (
    <ThemeProvider mode={settings.themeMode}>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="onboarding" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="lesson/[id]" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="quiz/[id]" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="exam" options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="quiz-summary" options={{ animation: 'fade' }} />
      </Stack>
    </ThemeProvider>
  );
}
