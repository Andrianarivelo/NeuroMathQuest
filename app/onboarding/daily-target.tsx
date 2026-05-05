import React, { useState } from 'react';
import { View, Text, SafeAreaView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../src/components';
import { useTheme } from '../../src/theme/ThemeProvider';
import { settingsRepository } from '../../src/repositories/settingsRepository';

const options = [
  { lessons: 1, label: '1 lesson', sub: 'Relaxed — 5 min/day' },
  { lessons: 2, label: '2 lessons', sub: 'Steady — 10 min/day' },
  { lessons: 3, label: '3 lessons', sub: 'Committed — 15 min/day' },
  { lessons: 5, label: '5 lessons', sub: 'Intense — 25 min/day' },
];

export default function DailyTarget() {
  const router = useRouter();
  const theme = useTheme();
  const [selected, setSelected] = useState(2);

  const handleNext = () => {
    settingsRepository.set('dailyGoalLessons', selected);
    router.push('/onboarding/preview');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 48 }}>
        <Text style={{ ...theme.typography.title, color: theme.colors.text, marginBottom: 8 }}>
          Set your daily goal
        </Text>
        <Text style={{ ...theme.typography.body, color: theme.colors.textMuted, marginBottom: 28 }}>
          Consistency beats intensity. You can always change this.
        </Text>

        {options.map((o) => (
          <Pressable
            key={o.lessons}
            onPress={() => setSelected(o.lessons)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: 16,
              marginBottom: 12,
              borderRadius: theme.radius.md,
              borderWidth: 2,
              borderColor: selected === o.lessons ? theme.colors.primary : theme.colors.border,
              backgroundColor: selected === o.lessons ? theme.colors.primarySoft : theme.colors.surface,
            }}
          >
            <View>
              <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>{o.label}</Text>
              <Text style={{ ...theme.typography.caption, color: theme.colors.textMuted, marginTop: 2 }}>{o.sub}</Text>
            </View>
            <View
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                borderWidth: 2,
                borderColor: selected === o.lessons ? theme.colors.primary : theme.colors.border,
                backgroundColor: selected === o.lessons ? theme.colors.primary : 'transparent',
              }}
            />
          </Pressable>
        ))}

        <View style={{ flex: 1 }} />
        <Button label="Next" size="lg" fullWidth onPress={handleNext} style={{ marginBottom: 24 }} />
      </View>
    </SafeAreaView>
  );
}
