import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, SafeAreaView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useTheme } from '../../src/theme/ThemeProvider';
import { getLesson } from '../../src/content/tracks';
import { getNotationTerms } from '../../src/content/notationTerms';
import { Button, Card, StarRow, LessonCartoon } from '../../src/components';
import { useProgress } from '../../src/hooks/useProgress';
import { isLessonUnlocked } from '../../src/services/unlockService';
import { buildCourseDetails } from '../../src/services/lessonContentService';

export default function LessonScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const theme = useTheme();
  const router = useRouter();
  const { progressMap } = useProgress();
  const [courseDetailIndex, setCourseDetailIndex] = useState(0);
  const [memoryHookOpen, setMemoryHookOpen] = useState(false);

  const lesson = getLesson(id ?? '');
  useEffect(() => {
    setCourseDetailIndex(0);
    setMemoryHookOpen(false);
  }, [lesson?.id]);

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
  const notationTerms = getNotationTerms(lesson);
  const courseDetails = buildCourseDetails(lesson);
  const selectedCourseDetail = courseDetails[courseDetailIndex] ?? courseDetails[0];
  const goToPreviousDetail = () => {
    setCourseDetailIndex((current) => Math.max(0, current - 1));
  };
  const goToNextDetail = () => {
    setCourseDetailIndex((current) => Math.min(courseDetails.length - 1, current + 1));
  };

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
          <LessonCartoon lesson={lesson} />

          {/* Concept card */}
          <Card>
            <Text style={{ ...theme.typography.h3, color: theme.colors.primary, marginBottom: 6 }}>Concept</Text>
            <Text style={{ ...theme.typography.body, color: theme.colors.text, lineHeight: 24 }}>{lesson.explanation}</Text>
            {courseDetails.length > 0 && (
              <View
                style={{
                  marginTop: 16,
                  backgroundColor: theme.colors.primarySoft,
                  borderRadius: theme.radius.md,
                  padding: 14,
                  gap: 12,
                }}
              >
                <Text style={{ ...theme.typography.body, color: theme.colors.text, lineHeight: 24 }}>
                  {selectedCourseDetail}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                  <Pressable
                    onPress={goToPreviousDetail}
                    disabled={courseDetailIndex === 0}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 10,
                      opacity: courseDetailIndex === 0 ? 0.4 : 1,
                    }}
                  >
                    <Text style={{ ...theme.typography.caption, color: theme.colors.primaryInk }}>Previous</Text>
                  </Pressable>
                  <Text style={{ ...theme.typography.caption, color: theme.colors.primaryInk }}>
                    {courseDetailIndex + 1}/{courseDetails.length}
                  </Text>
                  <Pressable
                    onPress={goToNextDetail}
                    disabled={courseDetailIndex + 1 >= courseDetails.length}
                    style={{
                      paddingVertical: 8,
                      paddingHorizontal: 10,
                      opacity: courseDetailIndex + 1 >= courseDetails.length ? 0.4 : 1,
                    }}
                  >
                    <Text style={{ ...theme.typography.caption, color: theme.colors.primaryInk }}>Next</Text>
                  </Pressable>
                </View>
              </View>
            )}
          </Card>

          {/* Active recall */}
          <Card style={{ backgroundColor: theme.colors.secondarySoft }}>
            <Text style={{ ...theme.typography.h3, color: theme.colors.secondary, marginBottom: 6 }}>
              Recall check
            </Text>
            <Text style={{ ...theme.typography.body, color: theme.colors.text, lineHeight: 24, marginBottom: 12 }}>
              Pause for ten seconds and say the idea in your own words.
            </Text>
            {memoryHookOpen ? (
              <View style={{ gap: 12 }}>
                <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text, lineHeight: 24 }}>
                  {lesson.intuition}
                </Text>
                <Button
                  label="Hide memory hook"
                  variant="outline"
                  fullWidth
                  onPress={() => setMemoryHookOpen(false)}
                />
              </View>
            ) : (
              <Button
                label="Reveal memory hook"
                variant="secondary"
                fullWidth
                onPress={() => setMemoryHookOpen(true)}
              />
            )}
          </Card>

          {/* Notation */}
          {lesson.notation && (
            <Card style={{ backgroundColor: theme.colors.bgMuted }}>
              <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, marginBottom: 4 }}>Notation</Text>
              <Text style={{ fontFamily: 'monospace', fontSize: 16, color: theme.colors.text }}>{lesson.notation}</Text>
              {notationTerms.length > 0 && (
                <View style={{ marginTop: 12, gap: 8 }}>
                  <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted }}>Terms in this notation</Text>
                  {notationTerms.map((term) => (
                    <View
                      key={`${lesson.id}-${term.symbol}`}
                      style={{
                        flexDirection: 'row',
                        gap: 8,
                        alignItems: 'flex-start',
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: 'monospace',
                          fontSize: 14,
                          color: theme.colors.primary,
                          minWidth: 64,
                        }}
                      >
                        {term.symbol}
                      </Text>
                      <Text style={{ ...theme.typography.caption, color: theme.colors.text, flex: 1 }}>
                        {term.meaning}
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>
          )}

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
