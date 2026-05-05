import React from 'react';
import { View, Text, ScrollView, SafeAreaView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';
import { getLesson } from '../../src/content/tracks';
import { Button, Card, StarRow, ProgressBar } from '../../src/components';
import { useProgress } from '../../src/hooks/useProgress';
import { lessonState, isLessonUnlocked } from '../../src/services/unlockService';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const router = useRouter();
  const { progressMap } = useProgress();

  const lesson = getLesson(id ?? '');
  if (!lesson) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ ...theme.typography.body, color: theme.colors.textMuted }}>Lesson not found.</Text>
      </SafeAreaView>
    );
  }

  const locked = !isLessonUnlocked(lesson, progressMap);
  const p = progressMap.get(lesson.id);
  const stars = p ? (p.mastery === 'mastered' ? 3 : p.mastery === 'strong' ? 2 : p.mastery === 'practicing' ? 1 : 0) : 0;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 48 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 6 }}>
          <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>{lesson.trackId.toUpperCase()} · {lesson.estimatedMinutes} min</Text>
          <Text style={{ ...theme.typography.title, color: theme.colors.text, marginTop: 4 }}>{lesson.title}</Text>
          <Text style={{ ...theme.typography.body, color: theme.colors.textMuted, marginTop: 2 }}>{lesson.subtitle}</Text>
          {stars > 0 && <StarRow filled={stars} size={18} style={{ marginTop: 8 }} />}
        </View>

        <View style={{ paddingHorizontal: 16, gap: 14, marginTop: 14 }}>
          {/* Concept card */}
          <Card>
            <Text style={{ ...theme.typography.h3, color: theme.colors.primary, marginBottom: 6 }}>Concept</Text>
            <Text style={{ ...theme.typography.body, color: theme.colors.text, lineHeight: 24 }}>{lesson.explanation}</Text>
          </Card>

          {/* Notation */}
          {lesson.notation && (
            <Card style={{ backgroundColor: theme.colors.bgMuted }}>
              <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, marginBottom: 4 }}>Notation</Text>
              <Text style={{ fontFamily: 'monospace', fontSize: 16, color: theme.colors.text }}>{lesson.notation}</Text>
            </Card>
          )}

          {/* Intuition */}
          <Card>
            <Text style={{ ...theme.typography.h3, color: theme.colors.secondary, marginBottom: 6 }}>Quick intuition</Text>
            <Text style={{ ...theme.typography.body, color: theme.colors.text }}>{lesson.intuition}</Text>
          </Card>

          {/* Example */}
          <Card style={{ borderLeftWidth: 4, borderLeftColor: theme.colors.primary }}>
            <Text style={{ ...theme.typography.h3, color: theme.colors.text, marginBottom: 6 }}>Neuroscience example</Text>
            <Text style={{ ...theme.typography.body, color: theme.colors.text, lineHeight: 24 }}>{lesson.example}</Text>
          </Card>

          {/* Why it matters */}
          <Card>
            <Text style={{ ...theme.typography.h3, color: theme.colors.gold, marginBottom: 6 }}>Why this matters</Text>
            <Text style={{ ...theme.typography.body, color: theme.colors.text }}>{lesson.whyItMatters}</Text>
          </Card>

          {/* Key terms */}
          <Card>
            <Text style={{ ...theme.typography.h3, color: theme.colors.text, marginBottom: 8 }}>Key terms</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {lesson.keyTerms.map((t) => (
                <View key={t} style={{ backgroundColor: theme.colors.primarySoft, borderRadius: theme.radius.pill, paddingHorizontal: 12, paddingVertical: 5 }}>
                  <Text style={{ ...theme.typography.caption, color: theme.colors.primaryInk }}>{t}</Text>
                </View>
              ))}
            </View>
          </Card>

          {/* Quiz CTA */}
          <Button
            label={locked ? 'Locked' : 'Start quiz'}
            size="lg"
            fullWidth
            disabled={locked}
            onPress={() => router.push(`/quiz/${lesson.id}`)}
            style={{ marginTop: 8 }}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
