import React from 'react';
import { View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withSequence, withTiming, withDelay } from 'react-native-reanimated';
import { useEffect } from 'react';

const COLORS = ['#FFD866', '#14B88A', '#5741D9', '#F2AE09', '#8F80F4', '#58CCA7'];

interface Props {
  count?: number;
  duration?: number;
}

export function Confetti({ count = 28, duration = 2000 }: Props) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: 'hidden',
      }}
    >
      {Array.from({ length: count }).map((_, i) => (
        <ConfettiPiece key={i} index={i} duration={duration} />
      ))}
    </View>
  );
}

function ConfettiPiece({ index, duration }: { index: number; duration: number }) {
  const startX = (index / 28) * 100; // spread across width %
  const color = COLORS[index % COLORS.length];
  const size = 6 + (index % 4) * 3;
  const delay = (index % 7) * 80;
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-20);
  const rotate = useSharedValue(0);

  useEffect(() => {
    opacity.value = withDelay(delay, withSequence(
      withTiming(1, { duration: 200 }),
      withTiming(1, { duration: duration - 500 }),
      withTiming(0, { duration: 300 }),
    ));
    translateY.value = withDelay(delay, withTiming(500 + index * 8, { duration }));
    rotate.value = withDelay(delay, withTiming(360 + index * 45, { duration }));
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
    ],
  }));

  return (
    <Animated.View
      style={[
        style,
        {
          position: 'absolute',
          left: `${startX}%`,
          top: -10,
          width: size,
          height: size * 0.6,
          backgroundColor: color,
          borderRadius: 2,
        },
      ]}
    />
  );
}
