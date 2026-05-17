import React, { useCallback, useMemo, useState } from 'react';
import { View, ScrollView, SafeAreaView, Pressable, useWindowDimensions } from 'react-native';
import { TranslatedText as Text } from '../../src/i18n/TranslatedText';
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
import { localizeLesson, localizeTrack, useI18n } from '../../src/i18n';

export default function LearnScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { progressMap, refresh } = useProgress();
  const { wallet, refresh: refreshWallet } = useWallet();
  const { purchasedLessonIds, refresh: refreshUnlocks } = useLessonUnlocks();
  const { language } = useI18n();
  const [activeTrack, setActiveTrack] = useState<TrackId>('neuroscience');

  useFocusEffect(useCallback(() => {
    refresh();
    refreshWallet();
    refreshUnlocks();
  }, [refresh, refreshWallet, refreshUnlocks]));

  const currentTrack = localizeTrack(tracks.find((t) => t.id === activeTrack)!, language);
  const lessons = useMemo(() => getTrackLessons(activeTrack), [activeTrack]);
  const states = new Map<string, LessonState>(
    lessons.map((l) => [l.id, lessonState(l, progressMap, purchasedLessonIds)])
  );
  const completedInTrack = lessons.filter(
    (l) => states.get(l.id) === 'completed' || states.get(l.id) === 'mastered'
  ).length;
  const safeWidth = Math.max(320, width || 320);
  const categoryRailWidth = Math.min(safeWidth - 32, 1120);
  const categoryChipWidth = safeWidth < 520
    ? Math.min(Math.max(Math.floor(safeWidth * 0.42), 148), 184)
    : Math.floor((categoryRailWidth - 32) / 5);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView
        contentContainerStyle={{
          paddingBottom: 40,
          paddingHorizontal: 16,
          paddingTop: 16,
          alignItems: 'center',
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Track header */}
        <View style={{ width: '100%', maxWidth: 1120, paddingBottom: 12 }}>
          <Text
            numberOfLines={2}
            adjustsFontSizeToFit
            minimumFontScale={0.82}
            style={{ ...theme.typography.title, color: theme.colors.text }}
          >
            {currentTrack.title}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <Text
              numberOfLines={2}
              style={{ ...theme.typography.caption, color: theme.colors.textMuted, marginTop: 2, flex: 1, flexShrink: 1 }}
            >
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

        {/* Lesson category picker */}
        <View
          style={{
            width: '100%',
            maxWidth: 1120,
            marginBottom: 16,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              gap: 8,
              paddingVertical: 2,
              paddingRight: 2,
            }}
          >
            {tracks.map((t) => {
              const localizedTrack = localizeTrack(t, language);
              const tint = trackTints[t.id as keyof typeof trackTints];
              const active = t.id === activeTrack;
              const trackLessons = getTrackLessons(t.id);
              const completed = trackLessons.filter((lesson) => {
                const state = lessonState(lesson, progressMap, purchasedLessonIds);
                return state === 'completed' || state === 'mastered';
              }).length;
              return (
                <Pressable
                  key={t.id}
                  onPress={() => setActiveTrack(t.id)}
                  style={{
                    width: categoryChipWidth,
                    minHeight: 54,
                    paddingVertical: 7,
                    paddingHorizontal: 10,
                    borderRadius: theme.radius.sm,
                    backgroundColor: active ? tint.bg : theme.colors.surface,
                    borderWidth: 1.5,
                    borderColor: active ? tint.fg : theme.colors.border,
                    justifyContent: 'center',
                    ...theme.shadows.sm,
                  }}
                >
                  <Text
                    numberOfLines={2}
                    adjustsFontSizeToFit
                    minimumFontScale={0.72}
                    style={{
                      ...theme.typography.caption,
                      color: active ? tint.fg : theme.colors.text,
                      textAlign: 'center',
                      width: '100%',
                      lineHeight: 15,
                    }}
                  >
                    {localizedTrack.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    adjustsFontSizeToFit
                    minimumFontScale={0.76}
                    style={{
                      ...theme.typography.tiny,
                      color: active ? tint.fg : theme.colors.textMuted,
                      textAlign: 'center',
                      marginTop: 2,
                      width: '100%',
                      letterSpacing: 0,
                    }}
                  >
                    {completed}/{trackLessons.length}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* Lesson path */}
        {lessons.map((lesson, idx) => {
          const localizedLesson = localizeLesson(lesson, language);
          const state = states.get(lesson.id) ?? 'locked';
          const p = progressMap.get(lesson.id);
          const access = lessonAccess(lesson, progressMap, purchasedLessonIds, wallet.coinsTotal);
          return (
            <View key={lesson.id} style={{ alignItems: 'center', marginBottom: 8, width: '100%' }}>
              {idx > 0 && (
                <View style={{ width: 3, height: 24, backgroundColor: theme.colors.border, borderRadius: 2, marginBottom: 4 }} />
              )}
              <LessonNode
                title={localizedLesson.title}
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
