import React, { useMemo, useState } from 'react';
import { View, Text, SafeAreaView, Pressable, Platform, ScrollView, useWindowDimensions } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInRight, ZoomIn } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../src/theme/ThemeProvider';
import { AnswerOption, AnswerOptionState, Button, CoinChip, ProgressBar, XPChip } from '../src/components';
import { randomEncouragement } from '../src/content/encouragement';
import { buildExamQuestions, completeExamAttempt, ExamAttemptResult } from '../src/services/examService';

const optionLabels = ['A', 'B', 'C', 'D'];

export default function ExamScreen() {
  const params = useLocalSearchParams<{ lessonIds?: string }>();
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [seed] = useState(() => `${Date.now()}-${Math.random()}`);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [selectedByQuestionId, setSelectedByQuestionId] = useState<Record<string, number>>({});
  const [result, setResult] = useState<ExamAttemptResult | null>(null);

  const rawLessonIds = Array.isArray(params.lessonIds)
    ? params.lessonIds.join(',')
    : params.lessonIds ?? '';
  const lessonIds = useMemo(
    () => rawLessonIds.split(',').map((item) => item.trim()).filter(Boolean),
    [rawLessonIds]
  );
  const questions = useMemo(() => buildExamQuestions(lessonIds, seed, 8), [lessonIds.join(','), seed]);
  const mobileWebBottomPadding = Platform.OS === 'web' && width < 640 ? 84 : 16;

  if (result) {
    const percent = Math.round(result.score * 100);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingVertical: 40, paddingBottom: mobileWebBottomPadding }}>
          <Animated.View entering={ZoomIn.duration(350)} style={{ alignItems: 'center', marginBottom: 24 }}>
            <Text style={{ ...theme.typography.display, color: theme.colors.text, textAlign: 'center' }}>
              Exam complete
            </Text>
            <Text style={{ ...theme.typography.body, color: theme.colors.textMuted, textAlign: 'center', marginTop: 8 }}>
              {percent >= 80 ? randomEncouragement('review_win') : randomEncouragement('incorrect')}
            </Text>
          </Animated.View>

          <View style={{ alignItems: 'center', gap: 14, width: '100%' }}>
            <View style={{ flexDirection: 'row', gap: 24, marginBottom: 4 }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ ...theme.typography.display, color: theme.colors.primary }}>
                  {result.correct}/{result.total}
                </Text>
                <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>correct</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ ...theme.typography.display, color: theme.colors.secondary }}>
                  {percent}%
                </Text>
                <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>score</Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', gap: 12, marginBottom: 10 }}>
              <XPChip amount={result.xp} />
              <CoinChip amount={result.coins} />
            </View>

            <View style={{ width: '100%', gap: 10, marginTop: 6 }}>
              {result.lessonResults.map((item) => (
                <View
                  key={item.lessonId}
                  style={{
                    backgroundColor: theme.colors.surface,
                    borderRadius: theme.radius.md,
                    padding: 14,
                    borderWidth: 1,
                    borderColor: theme.colors.border,
                  }}
                >
                  <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{item.lessonTitle}</Text>
                  <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, marginTop: 2 }}>
                    {item.correct}/{item.total} correct
                  </Text>
                </View>
              ))}
            </View>

            {result.newAchievements.length > 0 && (
              <Text style={{ ...theme.typography.caption, color: theme.colors.secondary, textAlign: 'center', marginTop: 8 }}>
                New achievement unlocked
              </Text>
            )}

            <View style={{ width: '100%', gap: 10, marginTop: 20 }}>
              <Button label="Continue" size="lg" fullWidth onPress={() => router.replace('/(tabs)/home')} />
              <Button label="Back to exams" variant="outline" fullWidth onPress={() => router.replace('/(tabs)/review')} />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (questions.length === 0) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
        <View style={{ flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ ...theme.typography.title, color: theme.colors.text, textAlign: 'center' }}>No exam ready yet</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textMuted, textAlign: 'center', marginTop: 8, marginBottom: 20 }}>
            Complete a few lessons first, then come back for a mixed exam.
          </Text>
          <Button label="Start learning" onPress={() => router.replace('/(tabs)/learn')} />
        </View>
      </SafeAreaView>
    );
  }

  const question = questions[questionIndex];
  const selectedIndex = selectedByQuestionId[question.examQuestionId];
  const answered = selectedIndex !== undefined;
  const isCorrect = selectedIndex === question.answerIndex;
  const progress = (questionIndex + (answered ? 1 : 0)) / questions.length;
  const answeredCount = Object.keys(selectedByQuestionId).length;
  const encourageMsg = answered
    ? isCorrect
      ? randomEncouragement('correct')
      : randomEncouragement('incorrect')
    : '';

  const handleSelect = (optionIndex: number) => {
    if (answered) return;
    setSelectedByQuestionId((current) => ({
      ...current,
      [question.examQuestionId]: optionIndex,
    }));
    if (Platform.OS !== 'web') {
      void Haptics.notificationAsync(
        optionIndex === question.answerIndex
          ? Haptics.NotificationFeedbackType.Success
          : Haptics.NotificationFeedbackType.Warning
      ).catch(() => undefined);
    }
  };

  const handleNext = () => {
    if (!answered) return;
    if (questionIndex + 1 < questions.length) {
      setQuestionIndex((current) => current + 1);
      return;
    }
    setResult(completeExamAttempt(questions, selectedByQuestionId));
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 12, paddingHorizontal: 20, gap: 12 }}>
          <Pressable onPress={() => router.back()}>
            <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.textMuted }}>Close</Text>
          </Pressable>
          <ProgressBar value={progress} height={8} style={{ flex: 1 }} />
          <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
            {questionIndex + 1}/{questions.length}
          </Text>
        </View>
        <View style={{ paddingHorizontal: 20, paddingTop: 8, flexDirection: 'row', gap: 8 }}>
          <View style={{ backgroundColor: theme.colors.reviewSoft, borderRadius: theme.radius.pill, paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ ...theme.typography.tiny, color: theme.colors.review }}>
              {answeredCount}/{questions.length} answered
            </Text>
          </View>
          <View style={{ backgroundColor: theme.colors.secondarySoft, borderRadius: theme.radius.pill, paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ ...theme.typography.tiny, color: theme.colors.secondaryInk }}>
              {lessonIds.length} topics
            </Text>
          </View>
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 20,
            paddingTop: 20,
            paddingBottom: answered ? 20 : mobileWebBottomPadding,
          }}
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={SlideInRight.duration(250)} key={`exam-${question.examQuestionId}`}>
            <Text style={{ ...theme.typography.caption, color: theme.colors.secondary, marginBottom: 6 }}>
              {question.lessonTitle}
            </Text>
            <Text style={{ ...theme.typography.h2, color: theme.colors.text, marginBottom: 18, lineHeight: 28 }}>
              {question.prompt}
            </Text>

            {question.options.map((option, optionIndex) => {
              let state: AnswerOptionState = 'idle';
              if (answered) {
                if (optionIndex === question.answerIndex) {
                  state = 'correct';
                } else if (optionIndex === selectedIndex && !isCorrect) {
                  state = 'incorrect';
                }
              }

              return (
                <AnswerOption
                  key={optionIndex}
                  label={optionLabels[optionIndex]}
                  text={option}
                  state={state}
                  onPress={() => handleSelect(optionIndex)}
                  disabled={answered}
                />
              );
            })}

            {answered && (
              <Animated.View entering={FadeIn.duration(200)} style={{ marginTop: 8 }}>
                <View
                  style={{
                    backgroundColor: isCorrect ? theme.colors.successSoft : theme.colors.warningSoft,
                    borderRadius: theme.radius.md,
                    padding: 14,
                  }}
                >
                  <Text style={{ ...theme.typography.bodyStrong, color: isCorrect ? theme.colors.success : theme.colors.warning, marginBottom: 4 }}>
                    {isCorrect ? 'Correct' : 'Good learning moment'}
                  </Text>
                  <Text style={{ ...theme.typography.body, color: theme.colors.text, marginBottom: 8 }}>
                    {question.explanation}
                  </Text>
                  <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, fontStyle: 'italic' }}>
                    {encourageMsg}
                  </Text>
                </View>
              </Animated.View>
            )}
          </Animated.View>
        </ScrollView>

        {answered && (
          <View
            style={{
              paddingHorizontal: 20,
              paddingTop: 10,
              paddingBottom: mobileWebBottomPadding,
              backgroundColor: theme.colors.bg,
              borderTopWidth: 1,
              borderTopColor: theme.colors.border,
            }}
          >
            <Button
              label={questionIndex + 1 < questions.length ? 'Next' : 'Finish exam'}
              fullWidth
              onPress={handleNext}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
