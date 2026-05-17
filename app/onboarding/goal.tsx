import React, { useState } from 'react';
import { View, SafeAreaView, Pressable } from 'react-native';
import { TranslatedText as Text } from '../../src/i18n/TranslatedText';
import { useRouter } from 'expo-router';
import { Button } from '../../src/components';
import { useTheme } from '../../src/theme/ThemeProvider';
import { settingsRepository } from '../../src/repositories/settingsRepository';

type Goal = 'neuroscience' | 'math' | 'both';

const goals: { id: Goal; emoji: string; label: string; sub: string }[] = [
  { id: 'neuroscience', emoji: '🧠', label: 'Learn neuroscience basics', sub: 'Start with how the brain works' },
  { id: 'math', emoji: '📐', label: 'Math for computational neuroscience', sub: 'Build the foundations step by step' },
  { id: 'both', emoji: '🔬', label: 'Do both', sub: 'Get the full picture' },
];

export default function GoalScreen() {
  const router = useRouter();
  const theme = useTheme();
  const [selected, setSelected] = useState<Goal>('both');

  const handleNext = () => {
    settingsRepository.set('primaryGoal', selected);
    router.push('/onboarding/daily-target');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 48 }}>
        <Text style={{ ...theme.typography.title, color: theme.colors.text, marginBottom: 8 }}>
          What brings you here?
        </Text>
        <Text style={{ ...theme.typography.body, color: theme.colors.textMuted, marginBottom: 28 }}>
          Pick your starting focus. You can always explore all tracks later.
        </Text>

        {goals.map((g) => (
          <Pressable
            key={g.id}
            onPress={() => setSelected(g.id)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              padding: 16,
              marginBottom: 12,
              borderRadius: theme.radius.md,
              borderWidth: 2,
              borderColor: selected === g.id ? theme.colors.primary : theme.colors.border,
              backgroundColor: selected === g.id ? theme.colors.primarySoft : theme.colors.surface,
            }}
          >
            <Text style={{ fontSize: 28, marginRight: 14 }}>{g.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{g.label}</Text>
              <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, marginTop: 2 }}>{g.sub}</Text>
            </View>
          </Pressable>
        ))}

        <View style={{ flex: 1 }} />
        <Button label="Next" size="lg" fullWidth onPress={handleNext} style={{ marginBottom: 24 }} />
      </View>
    </SafeAreaView>
  );
}
