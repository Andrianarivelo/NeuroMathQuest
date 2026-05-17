import React, { useMemo, useState } from 'react';
import { View, SafeAreaView, Pressable, Platform, ScrollView, useWindowDimensions } from 'react-native';
import { TranslatedText as Text } from '../../src/i18n/TranslatedText';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { FadeIn, SlideInRight } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../../src/theme/ThemeProvider';
import { getLesson } from '../../src/content/tracks';
import { ProgressBar, Button, AnswerOption, AnswerOptionState } from '../../src/components';
import { useProgress } from '../../src/hooks/useProgress';
import { useWallet } from '../../src/hooks/useWallet';
import { useLessonUnlocks } from '../../src/hooks/useLessonUnlocks';
import { randomEncouragement } from '../../src/content/encouragement';
import { selectQuizQuestions } from '../../src/services/quizService';
import { lessonAccess } from '../../src/services/unlockService';

const optionLabels = ['A', 'B', 'C', 'D'];

export default function QuizScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { progressMap } = useProgress();
  const { wallet } = useWallet();
  const { purchasedLessonIds } = useLessonUnlocks();

  const lesson = getLesson(id ?? '');
  const [seed] = useState(() => `${Date.now()}-${Math.random()}`);
  const questions = useMemo(() => (lesson ? selectQuizQuestions(lesson, seed) : []), [lesson?.id, seed]);
  const [qi, setQi] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [correctRun, setCorrectRun] = useState(0);
  const [missedIds, setMissedIds] = useState<string[]>([]);

  if (!lesson) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ ...theme.typography.body, color: theme.colors.textMuted }}>Quiz not found.</Text>
      </SafeAreaView>
    );
  }

  const access = lessonAccess(lesson, progressMap, purchasedLessonIds, wallet.coinsTotal);
  if (!access.isUnlocked) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'center', padding: 24 }}>
        <Text style={{ ...theme.typography.title, color: theme.colors.text, textAlign: 'center', marginBottom: 8 }}>
          Lesson locked
        </Text>
        <Text style={{ ...theme.typography.body, color: theme.colors.textMuted, textAlign: 'center', marginBottom: 20 }}>
          Unlock the lesson before starting its quiz.
        </Text>
        <Button label="Go to lesson" fullWidth onPress={() => router.replace(`/lesson/${lesson.id}`)} />
      </SafeAreaView>
    );
  }

  const q = questions[qi];
  const isCorrect = selectedIndex === q.answerIndex;
  const progress = (qi + (answered ? 1 : 0)) / questions.length;
  const mobileWebBottomPadding = Platform.OS === 'web' && width < 640 ? 84 : 16;

  const handleSelect = (optionIndex: number) => {
    if (answered) return;
    setSelectedIndex(optionIndex);
    setAnswered(true);
    const correct = optionIndex === q.answerIndex;
    if (correct) {
      setCorrectCount((c) => c + 1);
      setCorrectRun((run) => run + 1);
      if (Platform.OS !== 'web') {
        void Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
      }
    } else {
      setCorrectRun(0);
      setMissedIds((m) => [...m, q.id]);
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
      <View style={{ flex: 1 }}>
        {/* Top bar */}
        <View style={{ flexDirection: 'row', alignItems: 'center', paddingTop: 12, paddingHorizontal: 20, gap: 12 }}>
          <Pressable onPress={() => router.back()}>
            <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.textMuted }}>Close</Text>
          </Pressable>
          <ProgressBar value={progress} height={8} style={{ flex: 1 }} />
          <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
            {qi + 1}/{questions.length}
          </Text>
        </View>
        <View style={{ paddingHorizontal: 20, paddingTop: 8, flexDirection: 'row', gap: 8 }}>
          <View style={{ backgroundColor: theme.colors.primarySoft, borderRadius: theme.radius.pill, paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ ...theme.typography.tiny, color: theme.colors.primaryInk }}>
              {correctCount}/{qi + (answered ? 1 : 0)} correct
            </Text>
          </View>
          <View style={{ backgroundColor: theme.colors.goldSoft, borderRadius: theme.radius.pill, paddingHorizontal: 10, paddingVertical: 5 }}>
            <Text style={{ ...theme.typography.tiny, color: theme.colors.gold }}>
              streak {correctRun}
            </Text>
          </View>
        </View>

        {/* Question */}
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
          <Animated.View entering={SlideInRight.duration(250)} key={`q-${qi}`}>
            <Text style={{ ...theme.typography.h2, color: theme.colors.text, marginBottom: 18, lineHeight: 28 }}>
              {q.prompt}
            </Text>

            {q.options.map((opt, oi) => {
              let state: AnswerOptionState = 'idle';
              if (answered) {
                if (oi === q.answerIndex) {
                  state = 'correct';
                } else if (oi === selectedIndex && !isCorrect) {
                  state = 'incorrect';
                }
              } else if (oi === selectedIndex) {
                state = 'selected';
              }

              return (
                <AnswerOption
                  key={oi}
                  label={optionLabels[oi]}
                  text={opt}
                  state={state}
                  onPress={() => handleSelect(oi)}
                  disabled={answered}
                />
              );
            })}

            {/* Feedback */}
            {answered && (
              <Animated.View entering={FadeIn.duration(200)} style={{ marginTop: 8 }}>
                <View style={{
                  backgroundColor: isCorrect ? theme.colors.successSoft : theme.colors.warningSoft,
                  borderRadius: theme.radius.md,
                  padding: 14,
                }}>
                  <Text style={{ ...theme.typography.bodyStrong, color: isCorrect ? theme.colors.success : theme.colors.warning, marginBottom: 4 }}>
                    {isCorrect ? 'Correct' : 'Good learning moment'}
                  </Text>
                  <Text style={{ ...theme.typography.body, color: theme.colors.text, marginBottom: 8 }}>
                    {q.explanation}
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
              label={qi + 1 < questions.length ? 'Next' : 'See results'}
              fullWidth
              onPress={handleNext}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
