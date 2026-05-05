import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Button } from '../../src/components';
import { gradients, typography, spacing } from '../../src/theme';

export default function Welcome() {
  const router = useRouter();

  return (
    <LinearGradient colors={gradients.hero} style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
        <Text style={{ fontSize: 52, fontWeight: '800', color: '#FFF', marginBottom: 8, letterSpacing: -1 }}>
          NeuroMath{'\n'}Quest
        </Text>
        <Text style={{ ...typography.body, color: 'rgba(255,255,255,0.85)', textAlign: 'center', marginBottom: 48, lineHeight: 24 }}>
          Master the science of the brain, one lesson at a time.{'\n'}
          Math, neuroscience, and computation — made delightful.
        </Text>
        <Button
          label="Let's begin"
          variant="outline"
          size="lg"
          fullWidth
          onPress={() => router.push('/onboarding/goal')}
          style={{ borderColor: '#FFF' }}
          labelStyle={{ color: '#FFF' }}
        />
      </SafeAreaView>
    </LinearGradient>
  );
}
