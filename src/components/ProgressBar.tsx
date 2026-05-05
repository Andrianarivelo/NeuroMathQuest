import React, { useEffect } from 'react';
import { View, ViewStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  /** 0–1 */
  value: number;
  height?: number;
  color?: string;
  trackColor?: string;
  style?: ViewStyle;
}

export function ProgressBar({ value, height = 10, color, trackColor, style }: Props) {
  const theme = useTheme();
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withTiming(Math.min(1, Math.max(0, value)), { duration: 400 });
  }, [value]);

  const animStyle = useAnimatedStyle(() => ({
    width: `${width.value * 100}%` as any,
  }));

  return (
    <View
      style={[
        {
          height,
          borderRadius: height / 2,
          backgroundColor: trackColor ?? theme.colors.bgMuted,
          overflow: 'hidden',
        },
        style,
      ]}
    >
      <Animated.View
        style={[
          animStyle,
          {
            height,
            borderRadius: height / 2,
            backgroundColor: color ?? theme.colors.primary,
          },
        ]}
      />
    </View>
  );
}
