import React, { useCallback, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useProgress } from '../../src/hooks/useProgress';
import { useWallet } from '../../src/hooks/useWallet';
import { useLessonUnlocks } from '../../src/hooks/useLessonUnlocks';
import { tracks, getTrackLessons } from '../../src/content/tracks';
import { lessonAccess, lessonState, LessonState } from '../../src/services/unlockService';
import { LessonNode, Card, ProgressBar, CoinChip } from '../../src/components';
import { TrackId } from '../../src/content/types';
import { trackTints } from '../../src/theme';

const trackTabLabels: Record<TrackId, string> = {
  neuroscience: 'Neuroscience',
  math: 'Math Foundations',
  compneuro: 'Computational Neuro',
  aibasis: 'AI Basics',
  aineuro: 'NeuroAI',
};

const trackTabWidths: Record<TrackId, number> = {
  neuroscience: 136,
  math: 160,
  compneuro: 184,
  aibasis: 112,
  aineuro: 108,
};

export default function LearnScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { progressMap, refresh } = useProgress();
  const { wallet, refresh: refreshWallet } = useWallet();
  const { purchasedLessonIds, refresh: refreshUnlocks } = useLessonUnlocks();
  const [activeTrack, setActiveTrack] = useState<TrackId>('neuroscience');

  useFocusEffect(useCallback(() => {
    refresh();
    refreshWallet();
    refreshUnlocks();
  }, [refresh, refreshWallet, refreshUnlocks]));

  const currentTrack = tracks.find((t) => t.id === activeTrack)!;
  const lessons = getTrackLessons(activeTrack);
  const states = new Map<string, LessonState>(
    lessons.map((l) => [l.id, lessonState(l, progressMap, purchasedLessonIds)])
  );
  const completedInTrack = lessons.filter(
    (l) => states.get(l.id) === 'completed' || states.get(l.id) === 'mastered'
  ).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      {/* Track picker */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingTop: 16,
          paddingBottom: 2,
          gap: 8,
        }}
      >
        {tracks.map((t) => {
          const tint = trackTints[t.id as keyof typeof trackTints];
          const active = t.id === activeTrack;
          return (
            <Pressable
              key={t.id}
              onPress={() => setActiveTrack(t.id)}
              style={{
                width: trackTabWidths[t.id],
                minHeight: 44,
                paddingVertical: 10,
                paddingHorizontal: 12,
                borderRadius: theme.radius.md,
                backgroundColor: active ? tint.bg : theme.colors.surface,
                borderWidth: 2,
                borderColor: active ? tint.fg : 'transparent',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.86}
                style={{
                  ...theme.typography.caption,
                  color: active ? tint.fg : theme.colors.textMuted,
                  textAlign: 'center',
                  width: '100%',
                }}
              >
                {trackTabLabels[t.id]}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Track header */}
      <View style={{ paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 }}>
        <Text style={{ ...theme.typography.title, color: theme.colors.text }}>{currentTrack.title}</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
          <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, marginTop: 2, flex: 1 }}>
            {currentTrack.tagline}
          </Text>
          <CoinChip amount={wallet.coinsTotal} />
        </View>
        <ProgressBar
          value={lessons.length > 0 ? completedInTrack / lessons.length : 0}
          height={8}
          style={{ marginTop: 12 }}
        />
        <Text style={{ ...theme.typography.tiny, color: theme.colors.textMuted, marginTop: 4 }}>
          {completedInTrack}/{lessons.length} completed
        </Text>
      </View>

      {/* Lesson path */}
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 40,
          paddingHorizontal: 16,
          paddingTop: 12,
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        {lessons.map((lesson, idx) => {
          const state = states.get(lesson.id) ?? 'locked';
          const p = progressMap.get(lesson.id);
          const access = lessonAccess(lesson, progressMap, purchasedLessonIds, wallet.coinsTotal);
          return (
            <View key={lesson.id} style={{ alignItems: 'center', marginBottom: 8 }}>
              {idx > 0 && (
                <View style={{ width: 3, height: 24, backgroundColor: theme.colors.border, borderRadius: 2, marginBottom: 4 }} />
              )}
              <LessonNode
                title={lesson.title}
                state={state}
                stars={p ? (p.mastery === 'mastered' ? 3 : p.mastery === 'strong' ? 2 : p.mastery === 'practicing' ? 1 : 0) : 0}
                xp={lesson.xpReward}
                allowLockedPress
                lockedLabel={access.canPurchase ? `${access.cost} coins` : 'Locked'}
                onPress={() => router.push(`/lesson/${lesson.id}`)}
              />
              {/* Milestone markers every 5 */}
              {(idx + 1) % 5 === 0 && idx < lessons.length - 1 && (
                <Card style={{ marginTop: 12, marginBottom: 4, paddingVertical: 10, alignItems: 'center', width: '100%', maxWidth: 520 }}>
                  <Text style={{ ...theme.typography.caption, color: theme.colors.gold }}>
                    Milestone - {idx + 1} lessons
                  </Text>
                </Card>
              )}
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}
