import React, { useCallback } from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button, Card, ProgressRing, StreakChip, XPChip, CoinChip } from '../../src/components';
import { useTheme } from '../../src/theme/ThemeProvider';
import { useProgress } from '../../src/hooks/useProgress';
import { useStreak } from '../../src/hooks/useStreak';
import { useWallet } from '../../src/hooks/useWallet';
import { useSettings } from '../../src/hooks/useSettings';
import { nextRecommendedLesson } from '../../src/services/unlockService';
import { questsForDay, QuestDefinition } from '../../src/services/questService';
import { questsRepository, DailyQuestRow } from '../../src/repositories/questsRepository';
import { randomEncouragement } from '../../src/content/encouragement';
import { isoDay } from '../../src/utils/date';
import { useState } from 'react';

export default function HomeScreen() {
  const theme = useTheme();
  const router = useRouter();
  const { progressMap, completedCount, refresh: refreshProgress } = useProgress();
  const { currentStreak, todayLessons, todayXp, refresh: refreshStreak } = useStreak();
  const { wallet, levelInfo, refresh: refreshWallet } = useWallet();
  const { settings } = useSettings();
  const [quests, setQuests] = useState<Array<DailyQuestRow & { def: QuestDefinition }>>([]);

  useFocusEffect(
    useCallback(() => {
      refreshProgress();
      refreshStreak();
      refreshWallet();
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
    }, [])
  );

  const nextLesson = nextRecommendedLesson(progressMap);
  const dailyGoal = settings.dailyGoalLessons;
  const goalProgress = dailyGoal > 0 ? Math.min(1, todayLessons / dailyGoal) : 0;

  const heroMsg =
    currentStreak > 0
      ? randomEncouragement('streak_saved')
      : completedCount === 0
      ? 'Welcome to NeuroMath Quest.'
      : randomEncouragement('comeback');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Hero */}
        <LinearGradient colors={theme.gradients.hero} style={{ paddingHorizontal: 20, paddingTop: 48, paddingBottom: 28, borderBottomLeftRadius: 28, borderBottomRightRadius: 28 }}>
          <Text style={{ ...theme.typography.title, color: '#FFF', marginBottom: 6 }}>
            {heroMsg}
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
            <StreakChip count={currentStreak} />
            <XPChip amount={wallet.xpTotal} />
            <CoinChip amount={wallet.coinsTotal} />
          </View>
        </LinearGradient>

        <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
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

          {/* Continue button */}
          {nextLesson && (
            <Button
              label={`Continue: ${nextLesson.title}`}
              size="lg"
              fullWidth
              onPress={() => router.push(`/lesson/${nextLesson.id}`)}
              style={{ marginBottom: 16 }}
            />
          )}

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
                  {q.progress}/{q.target} — {q.def.description}
                </Text>
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
