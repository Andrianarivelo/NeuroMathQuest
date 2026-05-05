import React from 'react';
import { Pressable, PressableProps, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import { useTheme } from '../theme/ThemeProvider';

const APressable = Animated.createAnimatedComponent(Pressable);

interface Props extends Omit<PressableProps, 'style'> {
  label: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  haptic?: boolean;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  fullWidth,
  haptic = true,
  style,
  labelStyle,
  onPress,
  disabled,
  ...rest
}: Props) {
  const theme = useTheme();
  const scale = useSharedValue(1);

  const animStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => { scale.value = withSpring(0.95, { damping: 15 }); };
  const handlePressOut = () => { scale.value = withSpring(1, { damping: 15 }); };

  const handlePress = (e: any) => {
    if (haptic) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress?.(e);
  };

  const bg =
    variant === 'primary'
      ? theme.colors.primary
      : variant === 'secondary'
      ? theme.colors.secondary
      : 'transparent';

  const borderColor =
    variant === 'outline' ? theme.colors.border : 'transparent';

  const textColor =
    variant === 'primary' || variant === 'secondary'
      ? theme.colors.textInverse
      : variant === 'outline'
      ? theme.colors.text
      : theme.colors.primary;

  const height = size === 'sm' ? 40 : size === 'lg' ? 58 : 50;
  const px = size === 'sm' ? 16 : size === 'lg' ? 28 : 22;
  const fontSize = size === 'sm' ? 14 : size === 'lg' ? 18 : 16;

  return (
    <APressable
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={handlePress}
      disabled={disabled}
      style={[
        animStyle,
        {
          backgroundColor: bg,
          borderColor,
          borderWidth: variant === 'outline' ? 2 : 0,
          height,
          paddingHorizontal: px,
          borderRadius: theme.radius.md,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          alignSelf: fullWidth ? 'stretch' : 'center',
          ...theme.shadows.sm,
        },
        style,
      ]}
      {...rest}
    >
      <Text
        style={[
          {
            color: textColor,
            fontSize,
            fontWeight: '700',
            letterSpacing: 0.2,
          },
          labelStyle,
        ]}
      >
        {label}
      </Text>
    </APressable>
  );
}
