import React, { useCallback, useEffect, useState } from 'react';
import { Alert, SafeAreaView, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { File, Paths } from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Button, Card } from '../../src/components';
import { allLessons, getTrackLessons, tracks } from '../../src/content/tracks';
import { resetDb } from '../../src/db/db';
import { useSettings } from '../../src/hooks/useSettings';
import { useWallet } from '../../src/hooks/useWallet';
import { progressRepository } from '../../src/repositories/progressRepository';
import { streakRepository } from '../../src/repositories/streakRepository';
import { useTheme } from '../../src/theme/ThemeProvider';

const SUPERUSER_CODE = 'NEUROMATH-ADMIN';

export default function ProfileScreen() {
  const theme = useTheme();
  const { settings, update, refresh } = useSettings();
  const { wallet, levelInfo, refresh: refreshWallet } = useWallet();
  const [nameInput, setNameInput] = useState(settings.profileName);
  const [superCode, setSuperCode] = useState('');
  const [notice, setNotice] = useState('');

  useFocusEffect(
    useCallback(() => {
      refresh();
      refreshWallet();
    }, [refresh, refreshWallet])
  );

  useEffect(() => {
    setNameInput(settings.profileName);
  }, [settings.profileName]);

  const progressRows = progressRepository.getAll();
  const attempts = progressRepository.getAttempts();
  const recentDays = streakRepository.recent(365);
  const completed = progressRows.filter((row) => row.mastery !== 'not_started').length;
  const mastered = progressRows.filter((row) => row.mastery === 'mastered').length;
  const averageScore =
    attempts.length > 0
      ? Math.round((attempts.reduce((sum, attempt) => sum + attempt.score, 0) / attempts.length) * 100)
      : 0;
  const activeDays = recentDays.filter((day) => day.lessonsCompleted > 0).length;
  const weakLessons = progressRows
    .filter((row) => row.mastery === 'beginner' || row.mastery === 'practicing')
    .sort((a, b) => a.best_score - b.best_score)
    .slice(0, 8);

  const handleSaveProfile = () => {
    const cleanName = nameInput.trim().slice(0, 32) || 'NeuroMath Explorer';
    update('profileName', cleanName);
    setNotice('Profile saved. Your progress stays attached to this device.');
  };

  const handleSuperUser = () => {
    if (superCode.trim().toUpperCase() !== SUPERUSER_CODE) {
      setNotice('Superuser code not recognized. Your learner profile is still safe.');
      return;
    }
    update('superUserEnabled', true);
    setSuperCode('');
    setNotice('Superuser dashboard unlocked for this device.');
  };

  const handleExport = async () => {
    const json = JSON.stringify(
      {
        profile: {
          name: settings.profileName,
          superUserEnabled: settings.superUserEnabled,
        },
        wallet,
        progress: progressRows,
        attempts,
        exportedAt: new Date().toISOString(),
      },
      null,
      2
    );
    const file = new File(Paths.document, 'neuromath_progress.json');
    file.write(json);
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(file.uri);
    }
  };

  const handleReset = () => {
    Alert.alert(
      'Reset all progress?',
      'This cannot be undone. Export a backup first if you want to keep a copy.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetDb();
            refresh();
            refreshWallet();
          },
        },
      ]
    );
  };

  const row = (label: string, right: React.ReactNode) => (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
      }}
    >
      <Text style={{ ...theme.typography.body, color: theme.colors.text }}>{label}</Text>
      {right}
    </View>
  );

  const inputStyle = {
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.md,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: theme.colors.text,
    backgroundColor: theme.colors.bg,
  };

  const statPanel = (value: string | number, label: string, color: string) => (
    <View
      style={{
        flex: 1,
        minWidth: 130,
        backgroundColor: theme.colors.bgMuted,
        borderRadius: theme.radius.md,
        borderWidth: 1,
        borderColor: theme.colors.border,
        padding: 12,
      }}
    >
      <Text style={{ ...theme.typography.h2, color }}>{value}</Text>
      <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>{label}</Text>
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <Card style={{ alignItems: 'center', marginBottom: 20, paddingVertical: 24 }}>
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: theme.colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 10,
              }}
            >
              <Text style={{ fontSize: 28, color: '#FFF', fontWeight: '800' }}>
                {(settings.profileName || 'N').trim().charAt(0).toUpperCase()}
              </Text>
            </View>
            <Text style={{ ...theme.typography.title, color: theme.colors.text }}>
              {settings.profileName}
            </Text>
            <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, marginTop: 2 }}>
              Level {levelInfo.level} - {wallet.xpTotal} XP
            </Text>
          </Card>

          <Text style={{ ...theme.typography.h3, color: theme.colors.text, marginBottom: 6 }}>
            Learner profile
          </Text>
          <Card style={{ marginBottom: 16, gap: 10 }}>
            <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
              Create a name for this device. NeuroMath Quest remembers it and keeps progress locally.
            </Text>
            <TextInput
              value={nameInput}
              onChangeText={setNameInput}
              placeholder="Your name"
              placeholderTextColor={theme.colors.textMuted}
              style={inputStyle}
            />
            <Button label="Save profile" fullWidth onPress={handleSaveProfile} />
            {notice.length > 0 && (
              <Text style={{ ...theme.typography.caption, color: theme.colors.primary }}>{notice}</Text>
            )}
          </Card>

          <Text style={{ ...theme.typography.h3, color: theme.colors.text, marginBottom: 6 }}>
            Settings
          </Text>
          <Card style={{ marginBottom: 16 }}>
            {row(
              'Haptics',
              <Switch
                value={settings.hapticsEnabled}
                onValueChange={(value) => update('hapticsEnabled', value)}
                trackColor={{ true: theme.colors.primary, false: theme.colors.bgMuted }}
              />
            )}
            {row(
              'Sound',
              <Switch
                value={settings.soundEnabled}
                onValueChange={(value) => update('soundEnabled', value)}
                trackColor={{ true: theme.colors.primary, false: theme.colors.bgMuted }}
              />
            )}
            {row(
              'Large text',
              <Switch
                value={settings.largeText}
                onValueChange={(value) => update('largeText', value)}
                trackColor={{ true: theme.colors.primary, false: theme.colors.bgMuted }}
              />
            )}
            {row(
              'Reduced motion',
              <Switch
                value={settings.reducedMotion}
                onValueChange={(value) => update('reducedMotion', value)}
                trackColor={{ true: theme.colors.primary, false: theme.colors.bgMuted }}
              />
            )}
            {row(
              'Daily goal',
              <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.primary }}>
                {settings.dailyGoalLessons} lessons
              </Text>
            )}
          </Card>

          <Text style={{ ...theme.typography.h3, color: theme.colors.text, marginBottom: 6 }}>
            Data
          </Text>
          <Card style={{ marginBottom: 16, gap: 12 }}>
            <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
              Progress is saved automatically on this device. Export a backup before changing browsers or devices.
            </Text>
            <Button label="Export progress (JSON)" variant="outline" fullWidth onPress={handleExport} />
            <Button
              label="Reset all progress"
              variant="ghost"
              fullWidth
              onPress={handleReset}
              labelStyle={{ color: theme.colors.danger }}
            />
          </Card>

          <Text style={{ ...theme.typography.h3, color: theme.colors.text, marginBottom: 6 }}>
            Superuser
          </Text>
          <Card style={{ marginBottom: 16, gap: 10 }}>
            <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
              Superuser stats are local to this device in the current offline web app.
            </Text>
            {!settings.superUserEnabled && (
              <>
                <TextInput
                  value={superCode}
                  onChangeText={setSuperCode}
                  placeholder="Enter superuser code"
                  placeholderTextColor={theme.colors.textMuted}
                  autoCapitalize="characters"
                  style={inputStyle}
                />
                <Button label="Register as superuser" variant="outline" fullWidth onPress={handleSuperUser} />
              </>
            )}
            {settings.superUserEnabled && (
              <View style={{ gap: 12 }}>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {statPanel(`${completed}/${allLessons.length}`, 'lessons completed', theme.colors.primary)}
                  {statPanel(attempts.length, 'quiz attempts', theme.colors.secondary)}
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  {statPanel(`${averageScore}%`, 'average score', theme.colors.gold)}
                  {statPanel(activeDays, 'active days', theme.colors.primary)}
                </View>

                <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>
                  Track progress
                </Text>
                {tracks.map((track) => {
                  const lessons = getTrackLessons(track.id);
                  const done = progressRows.filter(
                    (rowItem) => rowItem.track_id === track.id && rowItem.mastery !== 'not_started'
                  ).length;
                  return (
                    <View key={track.id} style={{ gap: 4 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ ...theme.typography.caption, color: theme.colors.text }}>
                          {track.title}
                        </Text>
                        <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                          {done}/{lessons.length}
                        </Text>
                      </View>
                      <View
                        style={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: theme.colors.bgMuted,
                          overflow: 'hidden',
                        }}
                      >
                        <View
                          style={{
                            height: 8,
                            width: `${lessons.length > 0 ? (done / lessons.length) * 100 : 0}%`,
                            backgroundColor: track.color,
                          }}
                        />
                      </View>
                    </View>
                  );
                })}

                <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>
                  Lessons to support next
                </Text>
                {weakLessons.length === 0 ? (
                  <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                    No weak lessons yet. Complete more quizzes to populate this view.
                  </Text>
                ) : (
                  weakLessons.map((lesson) => (
                    <Text key={lesson.lesson_id} style={{ ...theme.typography.caption, color: theme.colors.text }}>
                      {lesson.lesson_id}: best {Math.round(lesson.best_score * 100)}%, attempts {lesson.attempts}
                    </Text>
                  ))
                )}
                <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                  Mastered lessons: {mastered}
                </Text>
              </View>
            )}
          </Card>

          <Card style={{ marginBottom: 20, alignItems: 'center' }}>
            <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, textAlign: 'center' }}>
              NeuroMath Quest v1.0.0{'\n'}
              Built with Expo SDK 55{'\n'}
              190 lessons - 5 tracks - fully offline
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
