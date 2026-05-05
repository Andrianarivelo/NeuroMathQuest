import React, { useState } from 'react';
import { View, Text, SafeAreaView, Pressable, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, FadeOut, SlideInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/theme/ThemeProvider';
import { getLesson } from '../../src/content/tracks';
import { ProgressBar, Button } from '../../src/components';
import { randomEncouragement } from '../../src/content/encouragement';

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const router = useRouter();

  const lesson = getLesson(id ?? '');
  if (!lesson) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ ...theme.typography.body, color: theme.colors.textMuted }}>Quiz not found.</Text>
      </SafeAreaView>
    );
  }

  const questions = lesson.questions;
  const [qi, setQi] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [missedIds, setMissedIds] = useState<string[]>([]);

  const q = questions[qi];
  const isCorrect = selectedIndex === q.answerIndex;
  const progress = (qi + (answered ? 1 : 0)) / questions.length;

  const handleSelect = (optionIndex: number) => {
    if (answered) return;
    setSelectedIndex(optionIndex);
    setAnswered(true);
    const correct = optionIndex === q.answerIndex;
    if (correct) {
      setCorrectCount((c) => c + 1);
      if (Platform.OS !== 'web') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      }
    } else {
      setMissedIds((m) => [...m, `${lesson.id}_q${qi}`]);
      if (Platform.OS !== 'web') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning).catch(() => undefined);
      }
    }
  };

  const handleNext = () => {
    if (qi + 1 < questions.length) {
      setQi(qi + 1);
      setSelectedIndex(null);
      setAnswered(false);
    } else {
      // Navigate to summary with params.
      router.replace({
        pathname: '/quiz-summary',
        params: {
          lessonId: lesson.id,
          correct: String(correctCount),
          total: String(questions.length),
          missed: missedIds.join(','),
        },
      });
    }
  };

  const encourageMsg = answered
    ? isCorrect
      ? randomEncouragement('correct')
      : randomEncouragement('incorrect')
    : '';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 20 }}>
        {/* Top bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 12, gap: 12 }}>
          <Pressable onPress={() => router.back()}>
            <Text style={{ fontSize: 28, color: theme.colors.textMuted }}>×</Text>
          </Pressable>
          <ProgressBar value={progress} height={8} style={{ flex: 1 }} />
          <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
            {qi + 1}/{questions.length}
          </Text>
        </View>

        {/* Question */}
        <Animated.View entering={SlideInRight.duration(250)} key={`q-${qi}`} style={{ flex: 1, justifyContent: 'center' }}>
          <Text style={{ ...theme.typography.h2, color: theme.colors.text, marginBottom: 24, lineHeight: 28 }}>
            {q.prompt}
          </Text>

          {q.options.map((opt, oi) => {
            let bg = theme.colors.surface;
            let borderCol = theme.colors.border;
            if (answered) {
              if (oi === q.answerIndex) {
                bg = theme.colors.successSoft;
                borderCol = theme.colors.success;
              } else if (oi === selectedIndex && !isCorrect) {
                bg = theme.colors.dangerSoft;
                borderCol = theme.colors.danger;
              }
            } else if (oi === selectedIndex) {
              borderCol = theme.colors.primary;
            }

            return (
              <Pressable
                key={oi}
                onPress={() => handleSelect(oi)}
                disabled={answered}
                style={{
                  backgroundColor: bg,
                  borderWidth: 2,
                  borderColor: borderCol,
                  borderRadius: theme.radius.md,
                  padding: 16,
                  marginBottom: 10,
                }}
              >
                <Text style={{ ...theme.typography.body, color: theme.colors.text }}>{opt}</Text>
              </Pressable>
            );
          })}

          {/* Feedback */}
          {answered && (
            <Animated.View entering={FadeIn.duration(200)} style={{ marginTop: 10 }}>
              <View style={{
                backgroundColor: isCorrect ? theme.colors.successSoft : theme.colors.warningSoft,
                borderRadius: theme.radius.md,
                padding: 14,
                marginBottom: 10,
              }}>
                <Text style={{ ...theme.typography.bodyStrong, color: isCorrect ? theme.colors.success : theme.colors.warning, marginBottom: 4 }}>
                  {isCorrect ? 'Correct' : 'Not quite'}
                </Text>
                <Text style={{ ...theme.typography.body, color: theme.colors.text, marginBottom: 8 }}>
                  {q.explanation}
                </Text>
                <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, fontStyle: 'italic' }}>
                  {encourageMsg}
                </Text>
              </View>
              <Button
                label={qi + 1 < questions.length ? 'Next' : 'See results'}
                fullWidth
                onPress={handleNext}
              />
            </Animated.View>
          )}
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
