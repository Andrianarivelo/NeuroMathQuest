import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { TranslatedText as Text } from '../../src/i18n/TranslatedText';
import { useRouter } from 'expo-router';
import { Button, ProgressRing, StarRow, StreakChip, XPChip } from '../../src/components';
import { useTheme } from '../../src/theme/ThemeProvider';
import { settingsRepository } from '../../src/repositories/settingsRepository';

export default function Preview() {
  const router = useRouter();
  const theme = useTheme();

  const start = () => {
    settingsRepository.set('onboardingCompleted', true);
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 24, paddingTop: 48 }}>
        <Text style={{ ...theme.typography.title, color: theme.colors.text, marginBottom: 8 }}>
          Here is what your journey looks like
        </Text>
        <Text style={{ ...theme.typography.body, color: theme.colors.textMuted, marginBottom: 28 }}>
          Bite-sized lessons, real progress, and rewards along the way.
        </Text>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginBottom: 28 }}>
          <View style={{ alignItems: 'center' }}>
            <ProgressRing value={0.5} size={72} label="50%" sublabel="daily goal" />
          </View>
          <View style={{ alignItems: 'center', gap: 8 }}>
            <StreakChip count={3} />
            <XPChip amount={120} />
            <StarRow filled={2} size={18} />
          </View>
        </View>

        <View style={{ backgroundColor: theme.colors.surface, borderRadius: theme.radius.lg, padding: 18, gap: 10, marginBottom: 28, ...theme.shadows.sm }}>
          <Text style={{ ...theme.typography.bodyStrong, color: theme.colors.text }}>
            Every lesson includes
          </Text>
          {['One clear concept', 'A brain science example', 'A quick quiz (3 questions)', 'XP, coins, and stars'].map((t) => (
            <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.colors.primary }} />
              <Text style={{ ...theme.typography.body, color: theme.colors.textMuted }}>{t}</Text>
            </View>
          ))}
        </View>

        <View style={{ flex: 1 }} />
        <Button label="Start learning" size="lg" fullWidth onPress={start} style={{ marginBottom: 24 }} />
      </View>
    </SafeAreaView>
  );
}
