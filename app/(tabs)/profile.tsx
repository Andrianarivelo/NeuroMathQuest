import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView, Switch, Alert } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useSettings } from '../../src/hooks/useSettings';
import { useWallet } from '../../src/hooks/useWallet';
import { Card, Button } from '../../src/components';
import { resetDb } from '../../src/db/db';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { progressRepository } from '../../src/repositories/progressRepository';

export default function ProfileScreen() {
  const theme = useTheme();
  const { settings, update, refresh } = useSettings();
  const { wallet, levelInfo, refresh: rw } = useWallet();

  useFocusEffect(useCallback(() => { refresh(); rw(); }, []));

  const handleExport = async () => {
    const rows = progressRepository.getAll();
    const json = JSON.stringify({ wallet, progress: rows }, null, 2);
    const file = new File(Paths.document, 'neuromath_progress.json');
    file.write(json);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset all progress?',
      'This cannot be undone. All XP, streaks, and mastery will be lost.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetDb();
            refresh();
            rw();
          },
        },
      ]
    );
  };

  const row = (label: string, right: React.ReactNode) => (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: theme.colors.border }}>
      <Text style={{ ...theme.typography.body, color: theme.colors.text }}>{label}</Text>
      {right}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          {/* Profile card */}
          <Card style={{ alignItems: 'center', marginBottom: 20, paddingVertical: 24 }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: theme.colors.primary, alignItems: 'center', justifyContent: 'center', marginBottom: 10 }}>
              <Text style={{ fontSize: 28, color: '#FFF', fontWeight: '800' }}>N</Text>
            </View>
            <Text style={{ ...theme.typography.title, color: theme.colors.text }}>NeuroMath Explorer</Text>
            <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, marginTop: 2 }}>
              Level {levelInfo.level} · {wallet.xpTotal} XP
            </Text>
          </Card>

          {/* Settings */}
          <Text style={{ ...theme.typography.h3, color: theme.colors.text, marginBottom: 6 }}>Settings</Text>
          <Card style={{ marginBottom: 16 }}>
            {row('Haptics', <Switch value={settings.hapticsEnabled} onValueChange={(v) => update('hapticsEnabled', v)} trackColor={{ true: theme.colors.primary, false: theme.colors.bgMuted }} />)}
            {row('Sound (placeholder)', <Switch value={settings.soundEnabled} onValueChange={(v) => update('soundEnabled', v)} trackColor={{ true: theme.colors.primary, false: theme.colors.bgMuted }} />)}
            {row('Large text', <Switch value={settings.largeText} onValueChange={(v) => update('largeText', v)} trackColor={{ true: theme.colors.primary, false: theme.colors.bgMuted }} />)}
            {row('Reduced motion', <Switch value={settings.reducedMotion} onValueChange={(v) => update('reducedMotion', v)} trackColor={{ true: theme.colors.primary, false: theme.colors.bgMuted }} />)}
            {row('Daily goal', <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.primary }}>{settings.dailyGoalLessons} lessons</Text>)}
          </Card>

          {/* Data */}
          <Text style={{ ...theme.typography.h3, color: theme.colors.text, marginBottom: 6 }}>Data</Text>
          <Card style={{ marginBottom: 16, gap: 12 }}>
            <Button label="Export progress (JSON)" variant="outline" fullWidth onPress={handleExport} />
            <Button label="Reset all progress" variant="ghost" fullWidth onPress={handleReset} labelStyle={{ color: theme.colors.danger }} />
          </Card>

          {/* About */}
          <Card style={{ marginBottom: 20, alignItems: 'center' }}>
            <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, textAlign: 'center' }}>
              NeuroMath Quest v1.0.0{'\n'}
              Built with Expo SDK 55{'\n'}
              70 lessons · 3 tracks · Fully offline
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
