import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../src/theme/ThemeProvider';
import { getLesson } from '../src/content/tracks';
import { completeLessonAttempt, LessonAttemptResult } from '../src/services/lessonService';
import { Button, StarRow, XPChip, CoinChip, Confetti } from '../src/components';
import { randomEncouragement } from '../src/content/encouragement';

export default function QuizSummary() {
  const params = useLocalSearchParams<{
    lessonId: string;
    correct: string;
    total: string;
    missed: string;
  }>();
  const theme = useTheme();
  const router = useRouter();
  const [result, setResult] = useState<LessonAttemptResult | null>(null);

  const lesson = getLesson(params.lessonId ?? '');
  const correct = parseInt(params.correct ?? '0', 10);
  const total = parseInt(params.total ?? '3', 10);
  const missed = (params.missed ?? '').split(',').filter(Boolean);

  useEffect(() => {
    if (!lesson) return;
    const r = completeLessonAttempt({
      lesson,
      correct,
      total,
      missedQuestionIds: missed,
    });
    setResult(r);
    if (r.score >= 0.999) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  }, []);

  if (!result || !lesson) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ ...theme.typography.body, color: theme.colors.textMuted }}>Loading...</Text>
      </SafeAreaView>
    );
  }

  const perfect = result.score >= 0.999;
  const newMastery = result.masteryBefore !== result.masteryAfter;
  const showConfetti = perfect || newMastery;
  const encourageCtx = newMastery ? 'mastery' : correct === total ? 'lesson_complete' : 'lesson_complete';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      {showConfetti && <Confetti />}
      <View style={{ flex: 1, paddingHorizontal: 24, justifyContent: 'center', alignItems: 'center' }}>
        <Animated.View entering={ZoomIn.duration(400)} style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 48, marginBottom: 12 }}>{perfect ? '🌟' : correct >= 2 ? '✓' : '📚'}</Text>
          <Text style={{ ...theme.typography.display, color: theme.colors.text, textAlign: 'center', marginBottom: 4 }}>
            {perfect ? 'Perfect!' : correct >= 2 ? 'Well done' : 'Good effort'}
          </Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textMuted, textAlign: 'center', marginBottom: 24 }}>
            {randomEncouragement(encourageCtx)}
          </Text>
        </Animated.View>

        <Animated.View entering={FadeIn.delay(200)} style={{ alignItems: 'center', gap: 14, width: '100%' }}>
          {/* Score */}
          <View style={{ flexDirection: 'row', gap: 24, marginBottom: 8 }}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ ...theme.typography.display, color: theme.colors.primary }}>{correct}/{total}</Text>
              <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>correct</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
              <StarRow filled={result.stars} size={24} />
              <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, marginTop: 4 }}>mastery</Text>
            </View>
          </View>

          {/* Rewards */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <XPChip amount={result.reward.xp} />
            <CoinChip amount={result.reward.coins} />
          </View>

          {result.reward.perfectBonus && (
            <Text style={{ ...theme.typography.caption, color: theme.colors.gold }}>Perfect score bonus!</Text>
          )}
          {result.reward.masteryBonus && (
            <Text style={{ ...theme.typography.caption, color: theme.colors.gold }}>Mastery bonus unlocked!</Text>
          )}
          {result.reward.chestUnlocked && (
            <View style={{
              backgroundColor: theme.colors.goldSoft,
              borderRadius: theme.radius.md,
              padding: 14,
              alignItems: 'center',
              marginTop: 8,
              width: '100%',
            }}>
              <Text style={{ fontSize: 28, marginBottom: 4 }}>🎁</Text>
              <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.gold }}>Milestone chest unlocked!</Text>
            </View>
          )}

          {result.newAchievements.length > 0 && (
            <View style={{ marginTop: 8 }}>
              {result.newAchievements.map((a) => (
                <Text key={a} style={{ ...theme.typography.caption, color: theme.colors.secondary, textAlign: 'center' }}>
                  Achievement: {a}
                </Text>
              ))}
            </View>
          )}

          {/* Level */}
          <View style={{ width: '100%', marginTop: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={{ ...theme.typography.caption, color: theme.colors.text }}>Level {result.level}</Text>
              <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>{result.xpIntoLevel}/{result.xpForNext}</Text>
            </View>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: theme.colors.bgMuted, marginTop: 6, overflow: 'hidden' }}>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: theme.colors.primary, width: `${Math.min(100, (result.xpIntoLevel / Math.max(1, result.xpForNext)) * 100)}%` }} />
            </View>
          </View>

          {/* Actions */}
          <View style={{ width: '100%', gap: 10, marginTop: 24 }}>
            <Button label="Continue" size="lg" fullWidth onPress={() => router.replace('/(tabs)/home')} />
            <Button label="Try again" variant="outline" fullWidth onPress={() => router.replace(`/quiz/${lesson.id}`)} />
          </View>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
