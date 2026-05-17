import React, { useCallback, useMemo } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { TranslatedText as Text } from '../../src/i18n/TranslatedText';
import { useFocusEffect, useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useProgress } from '../../src/hooks/useProgress';
import { pickReviewSet, ReviewCandidate } from '../../src/services/reviewService';
import { getLesson } from '../../src/content/tracks';
import { Button, Card, EmptyState, StarRow, SectionTitle } from '../../src/components';
import { localizeLesson, useI18n } from '../../src/i18n';

export default function ReviewScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { rows, refresh } = useProgress();
  const { language } = useI18n();

  useFocusEffect(useCallback(() => { refresh(); }, []));

  const candidates: ReviewCandidate[] = rows.map((r) => ({
    lessonId: r.lesson_id,
    mastery: r.mastery as any,
    lastReviewedAt: r.last_attempt_at,
    lastMissedAt: r.last_score < 0.8 ? r.last_attempt_at : null,
    bestScore: r.best_score,
  }));

  const reviewSet = useMemo(() => pickReviewSet(candidates, 6), [rows]);
  const examLessonIds = reviewSet.map((candidate) => candidate.lessonId).join(',');

  const weakConcepts = reviewSet.filter((c) => c.mastery === 'beginner' || c.mastery === 'practicing');
  const strengthening = reviewSet.filter((c) => c.mastery === 'strong' || c.mastery === 'mastered');

  if (reviewSet.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <EmptyState
          title="No exam ready yet"
          message="Complete a few lessons and concepts will appear here for a mixed exam."
          action={<Button label="Start learning" onPress={() => router.push('/(tabs)/learn')} />}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        <SectionTitle title="Exam" />
        <Text style={{ ...theme.typography.body, color: theme.colors.textMuted, paddingHorizontal: 16, marginBottom: 16 }}>
          Test a small mix of concepts from lessons you have already started.
        </Text>

        {weakConcepts.length > 0 && (
          <>
            <Text style={{ ...theme.typography.h3, color: theme.colors.text, paddingHorizontal: 16, marginBottom: 8 }}>
              Exam focus
            </Text>
            {weakConcepts.map((c) => {
              const baseLesson = getLesson(c.lessonId);
              if (!baseLesson) return null;
              const lesson = localizeLesson(baseLesson, language);
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
              Ready topics
            </Text>
            {strengthening.map((c) => {
              const baseLesson = getLesson(c.lessonId);
              if (!baseLesson) return null;
              const lesson = localizeLesson(baseLesson, language);
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
          label="Start exam"
          variant="secondary"
          fullWidth
          onPress={() => {
            if (examLessonIds) {
              router.push(`/exam?lessonIds=${encodeURIComponent(examLessonIds)}` as any);
            }
          }}
          style={{ marginHorizontal: 16, marginTop: 20 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
