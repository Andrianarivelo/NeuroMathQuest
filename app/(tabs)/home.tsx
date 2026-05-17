import React, { useCallback, useMemo, useState } from 'react';
import { View, ScrollView, SafeAreaView } from 'react-native';
import { TranslatedText as Text } from '../../src/i18n/TranslatedText';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Card, ProgressBar, ProgressRing, StreakChip, XPChip, CoinChip } from '../../src/components';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useProgress } from '../../src/hooks/useProgress';
import { useStreak } from '../../src/hooks/useStreak';
import { useWallet } from '../../src/hooks/useWallet';
import { useSettings } from '../../src/hooks/useSettings';
import { useLessonUnlocks } from '../../src/hooks/useLessonUnlocks';
import { lessonAccess, nextRecommendedLesson } from '../../src/services/unlockService';
import { allLessons } from '../../src/content/tracks';
import { questsForDay, QuestDefinition } from '../../src/services/questService';
import { questsRepository, DailyQuestRow } from '../../src/repositories/questsRepository';
import { randomEncouragement } from '../../src/content/encouragement';
import { isoDay } from '../../src/utils/date';
import { recordUsageEvent } from '../../src/services/backend/syncService';
import { pickReviewSet, ReviewCandidate } from '../../src/services/reviewService';
import { useI18n } from '../../src/i18n';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { t } = useI18n();
  const { rows, progressMap, completedCount, masteredCount, refresh: refreshProgress } = useProgress();
  const { currentStreak, todayLessons, refresh: refreshStreak } = useStreak();
  const { wallet, levelInfo, refresh: refreshWallet } = useWallet();
  const { settings, refresh: refreshSettings } = useSettings();
  const { purchasedLessonIds, refresh: refreshUnlocks } = useLessonUnlocks();
  const [quests, setQuests] = useState<Array<DailyQuestRow & { def: QuestDefinition }>>([]);
  const [sessionGreeting, setSessionGreeting] = useState(() => randomEncouragement('greeting'));

  useFocusEffect(
    useCallback(() => {
      refreshProgress();
      refreshStreak();
      refreshWallet();
      refreshSettings();
      refreshUnlocks();
      setSessionGreeting(randomEncouragement('greeting'));
      void recordUsageEvent('home_opened');
      // Load daily quests.
      const day = isoDay();
      const defs = questsForDay(day);
      questsRepository.seed(day, defs.map((d) => ({ id: d.id, target: d.target })));
      const rows = questsRepository.getForDay(day);
      setQuests(
        rows.map((r) => ({
          ...r,
          def: defs.find((d) => d.id === r.quest_id) ?? defs[0],
        }))
      );
    }, [refreshProgress, refreshStreak, refreshWallet, refreshSettings, refreshUnlocks])
  );

  const nextLesson = nextRecommendedLesson(progressMap, purchasedLessonIds);
  const nextPurchasableLesson = useMemo(() => {
    const purchasable = allLessons
      .map((lesson) => ({
        lesson,
        access: lessonAccess(lesson, progressMap, purchasedLessonIds, wallet.coinsTotal),
      }))
      .filter((item) => item.access.canPurchase);
    return (
      purchasable.find((item) => item.access.missingCoins === 0) ??
      purchasable[0] ??
      null
    );
  }, [progressMap, purchasedLessonIds, wallet.coinsTotal]);
  const examCandidates: ReviewCandidate[] = rows.map((row) => ({
    lessonId: row.lesson_id,
    mastery: row.mastery as any,
    lastReviewedAt: row.last_attempt_at,
    lastMissedAt: row.last_score < 0.8 ? row.last_attempt_at : null,
    bestScore: row.best_score,
  }));
  const examSet = useMemo(() => pickReviewSet(examCandidates, 6), [rows]);
  const examLessonIds = examSet.map((candidate) => candidate.lessonId).join(',');
  const dailyGoal = settings.dailyGoalLessons;
  const goalProgress = dailyGoal > 0 ? Math.min(1, todayLessons / dailyGoal) : 0;
  const completedQuestCount = quests.filter((quest) => quest.completed).length;

  const learnerName = settings.profileName?.trim() || 'NeuroMath Explorer';
  const heroMsg = `${t(sessionGreeting)}, ${learnerName}.`;
  const heroSubMsg =
    currentStreak > 0
      ? `Current streak: ${currentStreak} day${currentStreak > 1 ? 's' : ''}. Keep the rhythm gentle and steady.`
      : completedCount === 0
      ? 'Start with one short lesson. A few focused minutes are enough.'
      : 'Pick up with one small concept. Your progress is already saved.';

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={theme.gradients.hero} style={{ paddingHorizontal: 20, paddingTop: 48, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
          <Text style={{ ...theme.typography.title, color: '#FFF', marginBottom: 6 }}>
            {heroMsg}
          </Text>
          <Text style={{ ...theme.typography.body, color: '#FFF', opacity: 0.92 }}>
            {heroSubMsg}
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <StreakChip count={currentStreak} />
            <XPChip amount={wallet.xpTotal} />
            <CoinChip amount={wallet.coinsTotal} />
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
          {/* Mission card */}
          <Card style={{ marginBottom: 16, gap: 14 }}>
            <View>
              <Text style={{ ...theme.typography.h3, color: theme.colors.text, marginBottom: 4 }}>
                Today's mission
              </Text>
              <Text style={{ ...theme.typography.body, color: theme.colors.textMuted }}>
                {nextLesson
                  ? 'Learn one concept, then test yourself when you feel ready.'
                  : nextPurchasableLesson
                  ? 'Spend earned coins to open your next ready lesson.'
                  : examSet.length > 0
                  ? 'You are ready for a quick mixed exam.'
                  : 'Explore any unlocked lesson and build your first streak.'}
              </Text>
            </View>

            {nextLesson && (
              <Button
                label={`Continue: ${nextLesson.title}`}
                size="md"
                fullWidth
                onPress={() => router.push(`/lesson/${nextLesson.id}`)}
              />
            )}
            {!nextLesson && nextPurchasableLesson && (
              <Button
                label={
                  nextPurchasableLesson.access.missingCoins > 0
                    ? `Earn ${nextPurchasableLesson.access.missingCoins} coins`
                    : `Unlock: ${nextPurchasableLesson.lesson.title}`
                }
                size="md"
                fullWidth
                variant={nextPurchasableLesson.access.missingCoins > 0 ? 'outline' : 'primary'}
                onPress={() => router.push(`/lesson/${nextPurchasableLesson.lesson.id}`)}
              />
            )}
            {examSet.length > 1 && (
              <Button
                label="Quick exam"
                variant={nextLesson ? 'outline' : 'secondary'}
                fullWidth
                onPress={() => router.push(`/exam?lessonIds=${encodeURIComponent(examLessonIds)}` as any)}
              />
            )}

            <View style={{ flexDirection: 'row', gap: 8 }}>
              <View style={{ flex: 1, backgroundColor: theme.colors.bgMuted, borderRadius: theme.radius.md, padding: 10 }}>
                <Text style={{ ...theme.typography.tiny, color: theme.colors.textMuted }}>TODAY</Text>
                <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{todayLessons}/{dailyGoal}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: theme.colors.bgMuted, borderRadius: theme.radius.md, padding: 10 }}>
                <Text style={{ ...theme.typography.tiny, color: theme.colors.textMuted }}>QUESTS</Text>
                <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{completedQuestCount}/{quests.length || 3}</Text>
              </View>
              <View style={{ flex: 1, backgroundColor: theme.colors.bgMuted, borderRadius: theme.radius.md, padding: 10 }}>
                <Text style={{ ...theme.typography.tiny, color: theme.colors.textMuted }}>MASTERED</Text>
                <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{masteredCount}</Text>
              </View>
            </View>
          </Card>

          {/* Daily goal ring + continue */}
          <Card style={{ flexDirection: 'row', alignItems: 'center', gap: 16, marginBottom: 16 }}>
            <ProgressRing
              value={goalProgress}
              size={72}
              label={`${todayLessons}/${dailyGoal}`}
              sublabel="today"
            />
            <View style={{ flex: 1 }}>
              <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text, marginBottom: 4 }}>
                Daily goal
              </Text>
              <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                {goalProgress >= 1
                  ? 'You hit your target today!'
                  : `${dailyGoal - todayLessons} lesson${dailyGoal - todayLessons > 1 ? 's' : ''} to go.`}
              </Text>
            </View>
          </Card>

          {/* Quests */}
          <Text style={{ ...theme.typography.h3, color: theme.colors.text, marginBottom: 10, marginTop: 6 }}>
            Daily quests
          </Text>
          {quests.map((q) => (
            <Card key={q.quest_id} style={{ marginBottom: 10, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ width: 36, height: 36, borderRadius: 18, backgroundColor: q.completed ? theme.colors.primarySoft : theme.colors.bgMuted, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ fontSize: 16 }}>{q.completed ? '✓' : '○'}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{q.def.title}</Text>
                <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                  {q.progress}/{q.target} - {q.def.description}
                </Text>
                <ProgressBar
                  value={q.progress / Math.max(1, q.target)}
                  height={6}
                  style={{ marginTop: 6 }}
                />
              </View>
            </Card>
          ))}

          {/* Level card */}
          <Card style={{ marginTop: 10, marginBottom: 12 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ ...theme.typography.h3, color: theme.colors.text }}>Level {levelInfo.level}</Text>
              <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>
                {levelInfo.xpIntoLevel}/{levelInfo.xpForNext} XP
              </Text>
            </View>
            <View style={{ height: 8, borderRadius: 4, backgroundColor: theme.colors.bgMuted, marginTop: 10, overflow: 'hidden' }}>
              <View style={{ height: 8, borderRadius: 4, backgroundColor: theme.colors.primary, width: `${Math.min(100, (levelInfo.xpIntoLevel / Math.max(1, levelInfo.xpForNext)) * 100)}%` }} />
            </View>
          </Card>

          {/* Weekly highlight */}
          <Card style={{ marginBottom: 12 }}>
            <Text style={{ ...theme.typography.h3, color: theme.colors.text, marginBottom: 4 }}>This week</Text>
            <Text style={{ ...theme.typography.body, color: theme.colors.textMuted }}>
              {completedCount} lessons completed · {wallet.xpTotal} total XP
            </Text>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
