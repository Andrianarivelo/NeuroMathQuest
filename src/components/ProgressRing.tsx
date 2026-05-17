import React from 'react';
import Svg, { Circle } from 'react-native-svg';
import { View, ViewStyle } from 'react-native';
import { TranslatedText as Text } from '../i18n/TranslatedText';
import Animated, { useAnimatedProps, withTiming, useSharedValue, runOnJS } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';
import { useEffect } from 'react';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

interface Props {
  /** 0–1 */
  value: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
  label?: string;
  sublabel?: string;
  style?: ViewStyle;
}

export function ProgressRing({
  value,
  size = 80,
  strokeWidth = 8,
  color,
  trackColor,
  label,
  sublabel,
  style,
}: Props) {
  const theme = useTheme();
  const r = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * r;
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(Math.min(1, Math.max(0, value)), { duration: 600 });
  }, [value]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: circumference * (1 - progress.value),
  }));

  const fill = color ?? theme.colors.primary;
  const track = trackColor ?? theme.colors.bgMuted;

  return (
    <View style={[{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }, style]}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={track}
          strokeWidth={strokeWidth}
          fill="none"
        />
        <AnimatedCircle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke={fill}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          strokeDasharray={`${circumference}`}
          animatedProps={animatedProps}
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      {label != null && (
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: theme.colors.text, fontWeight: '800', fontSize: size * 0.22 }}>
            {label}
          </Text>
          {sublabel != null && (
            <Text style={{ color: theme.colors.textMuted, fontSize: size * 0.13, fontWeight: '600', marginTop: 1 }}>
              {sublabel}
            </Text>
          )}
        </View>
      )}
    </View>
  );
}
