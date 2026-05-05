import React, { useCallback, useMemo } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useProgress } from '../../src/hooks/useProgress';
import { pickReviewSet, ReviewCandidate } from '../../src/services/reviewService';
import { getLesson } from '../../src/content/tracks';
import { Button, Card, EmptyState, StarRow, SectionTitle } from '../../src/components';

export default function ReviewScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { rows, refresh } = useProgress();

  useFocusEffect(useCallback(() => { refresh(); }, []));

  const candidates: ReviewCandidate[] = rows.map((r) => ({
    lessonId: r.lesson_id,
    mastery: r.mastery as any,
    lastReviewedAt: r.last_attempt_at,
    lastMissedAt: r.last_score < 0.8 ? r.last_attempt_at : null,
    bestScore: r.best_score,
  }));

  const reviewSet = useMemo(() => pickReviewSet(candidates, 6), [rows]);

  const weakConcepts = reviewSet.filter((c) => c.mastery === 'beginner' || c.mastery === 'practicing');
  const strengthening = reviewSet.filter((c) => c.mastery === 'strong' || c.mastery === 'mastered');

  if (reviewSet.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <EmptyState
          title="Nothing to review yet"
          message="Complete a few lessons and concepts will appear here for smart review."
          action={<Button label="Start learning" onPress={() => router.push('/(tabs)/learn')} />}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <SectionTitle title="Review" />
        <Text style={{ ...theme.typography.body, color: theme.colors.textMuted, paddingHorizontal: 16, marginBottom: 16 }}>
          Strengthen your memory through spaced practice.
        </Text>

        {weakConcepts.length > 0 && (
          <>
            <Text style={{ ...theme.typography.h3, color: theme.colors.text, paddingHorizontal: 16, marginBottom: 8 }}>
              Because you missed these recently
            </Text>
            {weakConcepts.map((c) => {
              const lesson = getLesson(c.lessonId);
              if (!lesson) return null;
              return (
                <Card
                  key={c.lessonId}
                  onPress={() => router.push(`/quiz/${c.lessonId}`)}
                  style={{ marginHorizontal: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}
                >
                  <View style={{ width: 40, height: 40, borderRadius: 20, backgroundColor: theme.colors.reviewSoft, alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ fontWeight: '800', color: theme.colors.review, fontSize: 16 }}>?</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{lesson.title}</Text>
                    <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>{lesson.subtitle}</Text>
                  </View>
                </Card>
              );
            })}
          </>
        )}

        {strengthening.length > 0 && (
          <>
            <Text style={{ ...theme.typography.h3, color: theme.colors.text, paddingHorizontal: 16, marginTop: 12, marginBottom: 8 }}>
              Warm-up drills
            </Text>
            {strengthening.map((c) => {
              const lesson = getLesson(c.lessonId);
              if (!lesson) return null;
              return (
                <Card
                  key={c.lessonId}
                  onPress={() => router.push(`/quiz/${c.lessonId}`)}
                  style={{ marginHorizontal: 16, marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}
                >
                  <StarRow filled={c.mastery === 'mastered' ? 3 : 2} size={16} />
                  <View style={{ flex: 1 }}>
                    <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{lesson.title}</Text>
                    <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>{lesson.subtitle}</Text>
                  </View>
                </Card>
              );
            })}
          </>
        )}

        <Button
          label="Start mixed review"
          variant="secondary"
          fullWidth
          onPress={() => {
            if (reviewSet[0]) router.push(`/quiz/${reviewSet[0].lessonId}`);
          }}
          style={{ marginHorizontal: 16, marginTop: 20 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
