import React, { useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useProgress } from '../../src/hooks/useProgress';
import { useStreak } from '../../src/hooks/useStreak';
import { useWallet } from '../../src/hooks/useWallet';
import { Card, ProgressRing, StreakChip, StarRow } from '../../src/components';
import { tracks, getTrackLessons } from '../../src/content/tracks';
import { rewardsRepository } from '../../src/repositories/rewardsRepository';
import { achievements } from '../../src/content/achievements';
import { MasteryLevel } from '../../src/services/masteryService';

export default function ProgressScreen() {
  const theme = useTheme();
  const { rows, completedCount, masteredCount, refresh: rp } = useProgress();
  const { currentStreak, recent, refresh: rs } = useStreak();
  const { wallet, levelInfo, refresh: rw } = useWallet();

  useFocusEffect(useCallback(() => { rp(); rs(); rw(); }, []));

  const unlocked = rewardsRepository.listUnlockedAchievements();

  const weakLessons = rows
    .filter((r) => r.mastery === 'beginner' || r.mastery === 'practicing')
    .sort((a, b) => a.best_score - b.best_score)
    .slice(0, 5);

  const recentlyImproved = rows
    .filter((r) => r.mastery === 'strong' || r.mastery === 'mastered')
    .sort((a, b) => (b.last_attempt_at ?? 0) - (a.last_attempt_at ?? 0))
    .slice(0, 5);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, paddingTop: 24 }}>
          <Text style={{ ...theme.typography.title, color: theme.colors.text, marginBottom: 16 }}>Progress</Text>

          {/* XP + Level */}
          <Card style={{ marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
              <ProgressRing value={levelInfo.xpForNext > 0 ? levelInfo.xpIntoLevel / levelInfo.xpForNext : 0} size={64} label={`${levelInfo.level}`} sublabel="level" />
              <View style={{ flex: 1 }}>
                <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>{wallet.xpTotal} XP total</Text>
                <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                  {levelInfo.xpForNext - levelInfo.xpIntoLevel} XP to level {levelInfo.level + 1}
                </Text>
              </View>
            </View>
          </Card>

          {/* Streak + coins */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 14 }}>
            <Card style={{ flex: 1, alignItems: 'center' }}>
              <StreakChip count={currentStreak} />
              <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, marginTop: 6 }}>day streak</Text>
            </Card>
            <Card style={{ flex: 1, alignItems: 'center' }}>
              <Text style={{ ...theme.typography.h2, color: theme.colors.gold }}>{wallet.coinsTotal}</Text>
              <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, marginTop: 2 }}>coins</Text>
            </Card>
          </View>

          {/* Mastery by track */}
          <Text style={{ ...theme.typography.h3, color: theme.colors.text, marginBottom: 8 }}>Mastery by track</Text>
          {tracks.map((t) => {
            const lessons = getTrackLessons(t.id);
            const done = rows.filter((r) => r.track_id === t.id && r.mastery !== 'not_started').length;
            return (
              <Card key={t.id} style={{ marginBottom: 10 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
                  <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{t.title}</Text>
                  <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>{done}/{lessons.length}</Text>
                </View>
                <View style={{ height: 8, borderRadius: 4, backgroundColor: theme.colors.bgMuted, overflow: 'hidden' }}>
                  <View style={{ height: 8, borderRadius: 4, backgroundColor: t.color, width: `${lessons.length > 0 ? (done / lessons.length) * 100 : 0}%` }} />
                </View>
              </Card>
            );
          })}

          {/* Calendar-like consistency view */}
          <Text style={{ ...theme.typography.h3, color: theme.colors.text, marginTop: 12, marginBottom: 8 }}>Last 30 days</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 4, marginBottom: 14 }}>
            {Array.from({ length: 30 }).map((_, i) => {
              const d = new Date();
              d.setDate(d.getDate() - (29 - i));
              const iso = d.toISOString().slice(0, 10);
              const entry = recent.find((r) => r.day === iso);
              const intensity = entry ? Math.min(1, entry.lessonsCompleted / 3) : 0;
              return (
                <View
                  key={iso}
                  style={{
                    width: 18, height: 18, borderRadius: 4,
                    backgroundColor: intensity > 0
                      ? `rgba(14,158,116,${0.25 + intensity * 0.75})`
                      : theme.colors.bgMuted,
                  }}
                />
              );
            })}
          </View>

          {/* Achievements */}
          <Text style={{ ...theme.typography.h3, color: theme.colors.text, marginBottom: 8 }}>Achievements</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 14 }}>
            {achievements.slice(0, 12).map((a) => {
              const got = unlocked.includes(a.id);
              return (
                <View key={a.id} style={{ width: 90, alignItems: 'center', opacity: got ? 1 : 0.35, marginBottom: 8 }}>
                  <View style={{ width: 42, height: 42, borderRadius: 21, backgroundColor: got ? theme.colors.goldSoft : theme.colors.bgMuted, alignItems: 'center', justifyContent: 'center', marginBottom: 4 }}>
                    <Text style={{ fontSize: 18 }}>{got ? '★' : '?'}</Text>
                  </View>
                  <Text style={{ ...theme.typography.tiny, color: theme.colors.text, textAlign: 'center' }} numberOfLines={2}>{a.title}</Text>
                </View>
              );
            })}
          </View>

          {/* Weak + recently improved */}
          {weakLessons.length > 0 && (
            <>
              <Text style={{ ...theme.typography.h3, color: theme.colors.text, marginBottom: 8 }}>Needs work</Text>
              {weakLessons.map((w) => (
                <Card key={w.lesson_id} style={{ marginBottom: 8 }}>
                  <Text style={{ ...theme.typography.body, color: theme.colors.text }}>{w.lesson_id} - best {Math.round(w.best_score * 100)}%</Text>
                </Card>
              ))}
            </>
          )}

          {recentlyImproved.length > 0 && (
            <>
              <Text style={{ ...theme.typography.h3, color: theme.colors.text, marginTop: 12, marginBottom: 8 }}>Recently improved</Text>
              {recentlyImproved.map((r) => (
                <Card key={r.lesson_id} style={{ marginBottom: 8, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <StarRow filled={r.stars} size={14} />
                  <Text style={{ ...theme.typography.body, color: theme.colors.text }}>{r.lesson_id}</Text>
                </Card>
              ))}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
