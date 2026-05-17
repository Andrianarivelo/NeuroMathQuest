import React, { useCallback, useEffect, useState } from 'react';
import { Alert, Pressable, SafeAreaView, ScrollView, Switch, Text, TextInput, View } from 'react-native';
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
import {
  CloudAdminStats,
  getCloudAdminStats,
  syncLocalProgressToCloud,
} from '../../src/services/backend/syncService';
import {
  claimCloudAdminWithCode,
  getCloudProfile,
  getCloudSession,
  signInWithEmail,
  signOutCloud,
  signUpWithEmail,
  upsertCloudProfile,
} from '../../src/services/backend/authService';
import {
  getBackendConfig,
  isBackendConfigured,
  resetSupabaseClient,
} from '../../src/services/backend/supabaseClient';
import type { BackendConfig } from '../../src/services/backend/supabaseClient';
import { useTheme } from '../../src/theme/ThemeProvider';

type AdminView = 'overview' | 'students' | 'lessons';

function normalizeSupabaseUrl(value: string): string {
  return value
    .trim()
    .replace(/\/rest\/v1\/?$/i, '')
    .replace(/\/+$/, '');
}

function isValidSupabaseKey(value: string): boolean {
  const key = value.trim();
  return (
    key.startsWith('sb_publishable_') ||
    key.startsWith('eyJ') ||
    key.length >= 40
  );
}

function backendSourceLabel(source: BackendConfig['source']): string {
  switch (source) {
    case 'env':
      return 'build environment';
    case 'global':
      return 'global app setup';
    case 'runtime':
      return 'admin override on this device';
    default:
      return 'not configured';
  }
}

export default function ProfileScreen() {
  const theme = useTheme();
  const { settings, update, refresh } = useSettings();
  const { wallet, levelInfo, refresh: refreshWallet } = useWallet();
  const [nameInput, setNameInput] = useState(settings.profileName);
  const [superCode, setSuperCode] = useState('');
  const [notice, setNotice] = useState('');
  const [supabaseUrlInput, setSupabaseUrlInput] = useState(settings.supabaseUrl);
  const [supabaseAnonKeyInput, setSupabaseAnonKeyInput] = useState(settings.supabaseAnonKey);
  const [cloudEmail, setCloudEmail] = useState<string | null>(null);
  const [cloudRole, setCloudRole] = useState<'student' | 'admin' | null>(null);
  const [cloudNotice, setCloudNotice] = useState('');
  const [cloudBusy, setCloudBusy] = useState(false);
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [cloudStats, setCloudStats] = useState<CloudAdminStats | null>(null);
  const [adminView, setAdminView] = useState<AdminView>('overview');
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(null);
  const backendConfig = getBackendConfig();
  const backendConfigured = isBackendConfigured();
  const canManageCloudSetup = cloudRole === 'admin' || settings.superUserEnabled;

  const loadCloudStatus = useCallback(() => {
    void (async () => {
      const session = await getCloudSession();
      setCloudEmail(session?.user.email ?? null);
      const profile = await getCloudProfile().catch(() => null);
      setCloudRole(profile?.role ?? null);
      if (profile?.role === 'admin') {
        setCloudStats(await getCloudAdminStats().catch(() => null));
      } else {
        setCloudStats(null);
      }
    })();
  }, []);

  useFocusEffect(
    useCallback(() => {
      refresh();
      refreshWallet();
      loadCloudStatus();
    }, [refresh, refreshWallet, loadCloudStatus])
  );

  useEffect(() => {
    setNameInput(settings.profileName);
  }, [settings.profileName]);

  useEffect(() => {
    if (!cloudStats?.studentsList.length) {
      setSelectedStudentId(null);
      return;
    }
    const stillExists = selectedStudentId
      ? cloudStats.studentsList.some((student) => student.userId === selectedStudentId)
      : false;
    if (!stillExists) {
      setSelectedStudentId(cloudStats.studentsList[0].userId);
    }
  }, [cloudStats, selectedStudentId]);

  useEffect(() => {
    const fallbackUrl =
      backendConfig.source === 'env' || backendConfig.source === 'global'
        ? backendConfig.supabaseUrl
        : '';
    const fallbackAnonKey =
      backendConfig.source === 'env' || backendConfig.source === 'global'
        ? backendConfig.supabaseAnonKey
        : '';
    setSupabaseUrlInput(settings.supabaseUrl || fallbackUrl);
    setSupabaseAnonKeyInput(settings.supabaseAnonKey || fallbackAnonKey);
  }, [
    backendConfig.source,
    backendConfig.supabaseAnonKey,
    backendConfig.supabaseUrl,
    settings.supabaseAnonKey,
    settings.supabaseUrl,
  ]);

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
  const selectedCloudStudent =
    cloudStats?.studentsList.find((student) => student.userId === selectedStudentId) ??
    cloudStats?.studentsList[0] ??
    null;
  const cloudWeakLessonRows =
    cloudStats?.lessonStats
      .filter((lesson) => lesson.weakLearners > 0 || lesson.averageBestScore < 0.7)
      .sort((a, b) => b.weakLearners - a.weakLearners || a.averageBestScore - b.averageBestScore)
      .slice(0, 10) ?? [];
  const cloudStrongLessonRows =
    cloudStats?.lessonStats
      .filter((lesson) => lesson.startedLearners > 0)
      .sort((a, b) => b.completionRate - a.completionRate || b.averageBestScore - a.averageBestScore)
      .slice(0, 10) ?? [];

  const handleSaveProfile = () => {
    const cleanName = nameInput.trim().slice(0, 32) || 'NeuroMath Explorer';
    update('profileName', cleanName);
    setNotice('Profile saved. Your progress stays attached to this device.');
    void upsertCloudProfile(cleanName).catch(() => undefined);
  };

  const handleCloudAuth = async (mode: 'signIn' | 'signUp') => {
    const email = authEmail.trim();
    if (!email || authPassword.length < 6) {
      setCloudNotice('Enter an email and a password with at least 6 characters.');
      return;
    }

    setCloudBusy(true);
    const result =
      mode === 'signUp'
        ? await signUpWithEmail(email, authPassword, settings.profileName)
        : await signInWithEmail(email, authPassword);

    if (!result.ok) {
      setCloudNotice(result.message);
      setCloudBusy(false);
      return;
    }

    const syncResult = await syncLocalProgressToCloud();
    setCloudNotice(`${result.message} ${syncResult.message}`);
    setAuthPassword('');
    refresh();
    refreshWallet();
    loadCloudStatus();
    setCloudBusy(false);
  };

  const handleSaveCloudSetup = () => {
    if (!canManageCloudSetup) {
      setCloudNotice('Cloud setup is only available to the signed-in superuser.');
      return;
    }

    const supabaseUrl = normalizeSupabaseUrl(supabaseUrlInput);
    const supabaseAnonKey = supabaseAnonKeyInput.trim();

    if (!/^https:\/\/.+\.supabase\.co$/i.test(supabaseUrl)) {
      setCloudNotice('Enter the Project URL or Data API URL from Supabase.');
      return;
    }

    if (!isValidSupabaseKey(supabaseAnonKey)) {
      setCloudNotice('Paste the publishable key from Supabase Project Settings > API Keys.');
      return;
    }

    update('supabaseUrl', supabaseUrl);
    update('supabaseAnonKey', supabaseAnonKey);
    resetSupabaseClient();
    setCloudNotice('Admin cloud override saved on this device.');
    loadCloudStatus();
  };

  const handleClearCloudSetup = () => {
    if (!canManageCloudSetup) {
      setCloudNotice('Cloud setup is only available to the signed-in superuser.');
      return;
    }

    update('supabaseUrl', '');
    update('supabaseAnonKey', '');
    resetSupabaseClient();
    setCloudEmail(null);
    setCloudRole(null);
    setCloudStats(null);
    setSupabaseUrlInput('');
    setSupabaseAnonKeyInput('');
    setCloudNotice('Admin cloud override removed. The app will use the global cloud setup.');
  };

  const handleCloudSync = async () => {
    setCloudBusy(true);
    const result = await syncLocalProgressToCloud();
    setCloudNotice(result.message);
    refresh();
    refreshWallet();
    loadCloudStatus();
    setCloudBusy(false);
  };

  const handleCloudSignOut = async () => {
    setCloudBusy(true);
    await signOutCloud();
    setCloudEmail(null);
    setCloudRole(null);
    setCloudStats(null);
    setCloudNotice('Signed out. Guest mode is still available on this device.');
    setCloudBusy(false);
  };

  const handleSuperUser = async () => {
    if (!backendConfigured) {
      setNotice('Cloud accounts are not ready yet. Guest mode still works.');
      return;
    }
    if (!cloudEmail) {
      setNotice('Sign in to your cloud account before claiming superuser.');
      return;
    }
    if (superCode.trim().length === 0) {
      setNotice('Enter the one-time superuser code.');
      return;
    }

    setCloudBusy(true);
    const result = await claimCloudAdminWithCode(superCode);
    setCloudBusy(false);
    setNotice(result.message);
    setCloudNotice(result.message);
    if (result.ok) {
      update('superUserEnabled', true);
      setSuperCode('');
      loadCloudStatus();
    }
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

  const pct = (value: number) => `${Math.round(value * 100)}%`;

  const shortDate = (value: string | number | null | undefined) => {
    if (!value) return 'Never';
    const date = typeof value === 'number' ? new Date(value) : new Date(value);
    if (Number.isNaN(date.getTime())) return 'Never';
    return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  const connectionColor = (status: string) => {
    if (status === 'active_today') return theme.colors.primary;
    if (status === 'active_7d') return theme.colors.gold;
    if (status === 'inactive') return theme.colors.textMuted;
    return theme.colors.warning;
  };

  const trackTitle = (trackId: string) =>
    tracks.find((track) => track.id === trackId)?.title ?? trackId;

  const adminTab = (label: string, view: AdminView) => {
    const active = adminView === view;
    return (
      <Pressable
        onPress={() => setAdminView(view)}
        style={{
          flex: 1,
          minWidth: 92,
          minHeight: 40,
          borderRadius: theme.radius.sm,
          borderWidth: 1,
          borderColor: active ? theme.colors.primary : theme.colors.border,
          backgroundColor: active ? theme.colors.primarySoft : theme.colors.surface,
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 10,
        }}
      >
        <Text
          numberOfLines={1}
          adjustsFontSizeToFit
          minimumFontScale={0.8}
          style={{
            ...theme.typography.caption,
            color: active ? theme.colors.primaryInk : theme.colors.textMuted,
            textAlign: 'center',
          }}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  const compactMetric = (label: string, value: string | number, color = theme.colors.text) => (
    <View
      style={{
        minWidth: 96,
        flex: 1,
        backgroundColor: theme.colors.bgMuted,
        borderRadius: theme.radius.sm,
        padding: 10,
      }}
    >
      <Text style={{ ...theme.typography.bodyStrong, color }}>{value}</Text>
      <Text style={{ ...theme.typography.tiny, color: theme.colors.textMuted, letterSpacing: 0 }}>
        {label}
      </Text>
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
            Cloud account
          </Text>
          <Card style={{ marginBottom: 16, gap: 10 }}>
            <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
              Registration is optional. You can keep learning as a guest; an account only adds cloud backup,
              cross-device sync, and real admin stats.
            </Text>
            <Text style={{ ...theme.typography.caption, color: backendConfigured ? theme.colors.primary : theme.colors.warning }}>
              {backendConfigured
                ? `Cloud accounts are ready from ${backendSourceLabel(backendConfig.source)}.`
                : 'Cloud accounts are not ready yet. Guest mode still works.'}
            </Text>
            {canManageCloudSetup && (
              <View style={{ gap: 10 }}>
                <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>
                  Advanced cloud setup
                </Text>
                <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                  Admin-only fallback. The published app already has one global Supabase setup, so students never need these fields.
                </Text>
                <TextInput
                  value={supabaseUrlInput}
                  onChangeText={setSupabaseUrlInput}
                  placeholder="https://your-project.supabase.co or /rest/v1 URL"
                  placeholderTextColor={theme.colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="url"
                  style={inputStyle}
                />
                <TextInput
                  value={supabaseAnonKeyInput}
                  onChangeText={setSupabaseAnonKeyInput}
                  placeholder="Supabase publishable key"
                  placeholderTextColor={theme.colors.textMuted}
                  autoCapitalize="none"
                  style={inputStyle}
                />
                <Button
                  label="Save admin cloud override"
                  fullWidth
                  disabled={cloudBusy}
                  onPress={handleSaveCloudSetup}
                />
                {backendConfig.source === 'runtime' && (
                  <Button
                    label="Remove admin cloud override"
                    variant="ghost"
                    fullWidth
                    disabled={cloudBusy}
                    onPress={handleClearCloudSetup}
                  />
                )}
              </View>
            )}
            {backendConfigured && !cloudEmail && (
              <>
                <TextInput
                  value={authEmail}
                  onChangeText={setAuthEmail}
                  placeholder="Email"
                  placeholderTextColor={theme.colors.textMuted}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  style={inputStyle}
                />
                <TextInput
                  value={authPassword}
                  onChangeText={setAuthPassword}
                  placeholder="Password"
                  placeholderTextColor={theme.colors.textMuted}
                  secureTextEntry
                  style={inputStyle}
                />
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                  <Button
                    label="Create account and sync"
                    fullWidth
                    disabled={cloudBusy}
                    onPress={() => void handleCloudAuth('signUp')}
                  />
                  <Button
                    label="Sign in and sync"
                    variant="outline"
                    fullWidth
                    disabled={cloudBusy}
                    onPress={() => void handleCloudAuth('signIn')}
                  />
                </View>
              </>
            )}
            {backendConfigured && cloudEmail && (
              <View style={{ gap: 10 }}>
                <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>
                  Signed in as {cloudEmail}
                </Text>
                <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                  Role: {cloudRole ?? 'student'}
                </Text>
                <Button
                  label="Sync now"
                  fullWidth
                  disabled={cloudBusy}
                  onPress={() => void handleCloudSync()}
                />
                <Button
                  label="Sign out"
                  variant="ghost"
                  fullWidth
                  disabled={cloudBusy}
                  onPress={() => void handleCloudSignOut()}
                />
              </View>
            )}
            {settings.cloudSyncLastAt > 0 && (
              <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                Last cloud sync: {new Date(settings.cloudSyncLastAt).toLocaleString()}
              </Text>
            )}
            {cloudNotice.length > 0 && (
              <Text style={{ ...theme.typography.caption, color: theme.colors.primary }}>{cloudNotice}</Text>
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
              Cloud superuser gives access to classroom stats across signed-in learners. Sign in, then enter the one-time owner code.
            </Text>
            {!settings.superUserEnabled && cloudRole !== 'admin' && (
              <>
                <TextInput
                  value={superCode}
                  onChangeText={setSuperCode}
                  placeholder="Enter superuser code"
                  placeholderTextColor={theme.colors.textMuted}
                  autoCapitalize="characters"
                  style={inputStyle}
                />
                <Button
                  label="Claim cloud superuser"
                  variant="outline"
                  fullWidth
                  disabled={!backendConfigured || !cloudEmail || cloudBusy}
                  onPress={() => void handleSuperUser()}
                />
              </>
            )}
            {(settings.superUserEnabled || cloudRole === 'admin') && (
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
            {cloudRole === 'admin' && cloudStats && (
              <View style={{ gap: 12, marginTop: 8 }}>
                <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>
                  Cloud classroom dashboard
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {adminTab('Overview', 'overview')}
                  {adminTab('Students', 'students')}
                  {adminTab('Lessons', 'lessons')}
                </View>

                {adminView === 'overview' && (
                  <View style={{ gap: 12 }}>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                      {statPanel(cloudStats.students, 'cloud students', theme.colors.primary)}
                      {statPanel(cloudStats.activeUsersToday, 'active today', theme.colors.primary)}
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                      {statPanel(cloudStats.activeUsers7d, 'active in 7 days', theme.colors.secondary)}
                      {statPanel(cloudStats.quizAttempts, 'quiz attempts', theme.colors.secondary)}
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                      {statPanel(pct(cloudStats.averageScore), 'average quiz score', theme.colors.gold)}
                      {statPanel(pct(cloudStats.averageCompletionRate), 'average completion', theme.colors.primary)}
                    </View>
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                      {statPanel(pct(cloudStats.averageMasteryRate), 'average mastery', theme.colors.gold)}
                      {statPanel(cloudStats.usageEvents, 'usage events', theme.colors.textMuted)}
                    </View>

                    <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>
                      Lessons needing support
                    </Text>
                    {cloudWeakLessonRows.length === 0 ? (
                      <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                        No cloud weak-lesson data yet.
                      </Text>
                    ) : (
                      cloudWeakLessonRows.map((lesson) => (
                        <View
                          key={lesson.lessonId}
                          style={{
                            borderBottomWidth: 1,
                            borderBottomColor: theme.colors.border,
                            paddingBottom: 8,
                            gap: 2,
                          }}
                        >
                          <Text style={{ ...theme.typography.caption, color: theme.colors.text }}>
                            {lesson.lessonId} · {lesson.title}
                          </Text>
                          <Text style={{ ...theme.typography.tiny, color: theme.colors.textMuted, letterSpacing: 0 }}>
                            {lesson.weakLearners} need support · avg best {pct(lesson.averageBestScore)} · success {pct(lesson.completionRate)}
                          </Text>
                        </View>
                      ))
                    )}
                  </View>
                )}

                {adminView === 'students' && (
                  <View style={{ gap: 12 }}>
                    {cloudStats.studentsList.length === 0 ? (
                      <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                        No signed-in student profiles have synced yet.
                      </Text>
                    ) : (
                      <>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                          {cloudStats.studentsList.map((student) => {
                            const active = selectedCloudStudent?.userId === student.userId;
                            return (
                              <Pressable
                                key={student.userId}
                                onPress={() => setSelectedStudentId(student.userId)}
                                style={{
                                  minWidth: 150,
                                  flexGrow: 1,
                                  flexBasis: 150,
                                  borderRadius: theme.radius.md,
                                  borderWidth: 1,
                                  borderColor: active ? theme.colors.primary : theme.colors.border,
                                  backgroundColor: active ? theme.colors.primarySoft : theme.colors.surface,
                                  padding: 10,
                                  gap: 4,
                                }}
                              >
                                <Text
                                  numberOfLines={1}
                                  style={{
                                    ...theme.typography.bodyStrong,
                                    color: active ? theme.colors.primaryInk : theme.colors.text,
                                  }}
                                >
                                  {student.displayName}
                                </Text>
                                <Text
                                  style={{
                                    ...theme.typography.tiny,
                                    color: connectionColor(student.connectionStatus),
                                    letterSpacing: 0,
                                  }}
                                >
                                  {student.connectionLabel}
                                </Text>
                                <Text style={{ ...theme.typography.tiny, color: theme.colors.textMuted, letterSpacing: 0 }}>
                                  {student.completedLessons}/{allLessons.length} · avg {pct(student.averageQuizScore)}
                                </Text>
                              </Pressable>
                            );
                          })}
                        </View>

                        {selectedCloudStudent && (
                          <View style={{ gap: 12 }}>
                            <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>
                              {selectedCloudStudent.displayName}
                            </Text>
                            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                              {compactMetric('completed', `${selectedCloudStudent.completedLessons}/${allLessons.length}`, theme.colors.primary)}
                              {compactMetric('mastered', selectedCloudStudent.masteredLessons, theme.colors.gold)}
                              {compactMetric('attempts', selectedCloudStudent.quizAttempts, theme.colors.secondary)}
                              {compactMetric('avg quiz', pct(selectedCloudStudent.averageQuizScore), theme.colors.gold)}
                              {compactMetric('active days', selectedCloudStudent.activeDays, theme.colors.primary)}
                              {compactMetric('level', selectedCloudStudent.level, theme.colors.secondary)}
                            </View>
                            <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                              Connection: {selectedCloudStudent.connectionLabel} · last seen {shortDate(selectedCloudStudent.lastSeenAt)} · last sync {shortDate(selectedCloudStudent.lastSyncAt)}
                            </Text>

                            <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>
                              Track progress
                            </Text>
                            {selectedCloudStudent.trackProgress.map((track) => (
                              <View key={track.trackId} style={{ gap: 4 }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 10 }}>
                                  <Text style={{ ...theme.typography.caption, color: theme.colors.text, flex: 1 }}>
                                    {track.title}
                                  </Text>
                                  <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                                    {track.completed}/{track.total}
                                  </Text>
                                </View>
                                <View
                                  style={{
                                    height: 7,
                                    borderRadius: 4,
                                    backgroundColor: theme.colors.bgMuted,
                                    overflow: 'hidden',
                                  }}
                                >
                                  <View
                                    style={{
                                      height: 7,
                                      width: `${track.total > 0 ? (track.completed / track.total) * 100 : 0}%`,
                                      backgroundColor: tracks.find((item) => item.id === track.trackId)?.color ?? theme.colors.primary,
                                    }}
                                  />
                                </View>
                              </View>
                            ))}

                            <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>
                              Student lessons needing support
                            </Text>
                            {selectedCloudStudent.weakLessons.length === 0 ? (
                              <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                                No weak lessons for this student yet.
                              </Text>
                            ) : (
                              selectedCloudStudent.weakLessons.map((lesson) => (
                                <Text key={lesson.lessonId} style={{ ...theme.typography.caption, color: theme.colors.text }}>
                                  {lesson.lessonId} · {lesson.title}: best {pct(lesson.bestScore)}, attempts {lesson.attempts}
                                </Text>
                              ))
                            )}

                            <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>
                              Recent attempts
                            </Text>
                            {selectedCloudStudent.recentAttempts.length === 0 ? (
                              <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                                No quiz attempts synced yet.
                              </Text>
                            ) : (
                              selectedCloudStudent.recentAttempts.map((attempt, index) => (
                                <Text
                                  key={`${attempt.lessonId}-${attempt.attemptedAt}-${index}`}
                                  style={{ ...theme.typography.caption, color: theme.colors.text }}
                                >
                                  {shortDate(attempt.attemptedAt)} · {attempt.lessonId} · {attempt.title}: {pct(attempt.score)} ({attempt.correct}/{attempt.total})
                                </Text>
                              ))
                            )}

                            <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>
                              Started lesson progress
                            </Text>
                            {selectedCloudStudent.lessonProgress.length === 0 ? (
                              <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                                This student has not synced lesson progress yet.
                              </Text>
                            ) : (
                              selectedCloudStudent.lessonProgress.map((lesson) => (
                                <View
                                  key={lesson.lessonId}
                                  style={{
                                    borderBottomWidth: 1,
                                    borderBottomColor: theme.colors.border,
                                    paddingBottom: 6,
                                    gap: 2,
                                  }}
                                >
                                  <Text style={{ ...theme.typography.caption, color: theme.colors.text }}>
                                    {lesson.lessonId} · {lesson.title}
                                  </Text>
                                  <Text style={{ ...theme.typography.tiny, color: theme.colors.textMuted, letterSpacing: 0 }}>
                                    {trackTitle(lesson.trackId)} · {lesson.mastery} · best {pct(lesson.bestScore)} · attempts {lesson.attempts}
                                  </Text>
                                </View>
                              ))
                            )}
                          </View>
                        )}
                      </>
                    )}
                  </View>
                )}

                {adminView === 'lessons' && (
                  <View style={{ gap: 12 }}>
                    <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>
                      Overall student success by lesson
                    </Text>
                    <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                      Success means a student reached practicing, strong, or mastered on that lesson.
                    </Text>

                    <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>
                      Strongest lessons
                    </Text>
                    {cloudStrongLessonRows.length === 0 ? (
                      <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                        No lesson attempts have synced yet.
                      </Text>
                    ) : (
                      cloudStrongLessonRows.map((lesson) => (
                        <Text key={`strong-${lesson.lessonId}`} style={{ ...theme.typography.caption, color: theme.colors.text }}>
                          {lesson.lessonId} · {lesson.title}: success {pct(lesson.completionRate)}, avg best {pct(lesson.averageBestScore)}
                        </Text>
                      ))
                    )}

                    <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>
                      Hardest lessons
                    </Text>
                    {cloudWeakLessonRows.length === 0 ? (
                      <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                        No weak-lesson data yet.
                      </Text>
                    ) : (
                      cloudWeakLessonRows.map((lesson) => (
                        <Text key={`weak-${lesson.lessonId}`} style={{ ...theme.typography.caption, color: theme.colors.text }}>
                          {lesson.lessonId} · {lesson.title}: {lesson.weakLearners} need support, avg best {pct(lesson.averageBestScore)}
                        </Text>
                      ))
                    )}

                    <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>
                      All lessons
                    </Text>
                    {cloudStats.lessonStats.map((lesson) => (
                      <View
                        key={lesson.lessonId}
                        style={{
                          borderBottomWidth: 1,
                          borderBottomColor: theme.colors.border,
                          paddingBottom: 8,
                          gap: 2,
                        }}
                      >
                        <Text style={{ ...theme.typography.caption, color: theme.colors.text }}>
                          {lesson.lessonId} · {lesson.title}
                        </Text>
                        <Text style={{ ...theme.typography.tiny, color: theme.colors.textMuted, letterSpacing: 0 }}>
                          {trackTitle(lesson.trackId)} · success {pct(lesson.completionRate)} · completed {lesson.completedLearners}/{cloudStats.students} · mastered {lesson.masteredLearners} · attempts {lesson.quizAttempts} · avg best {pct(lesson.averageBestScore)}
                        </Text>
                      </View>
                    ))}
                  </View>
                )}
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
