import React from 'react';
import { View, ViewStyle, Pressable, PressableProps } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../theme/ThemeProvider';

const AView = Animated.createAnimatedComponent(View);

interface Props {
  children: React.ReactNode;
  style?: ViewStyle;
  onPress?: PressableProps['onPress'];
  animate?: boolean;
}

export function Card({ children, style, onPress, animate = true }: Props) {
  const theme = useTheme();
  const scale = useSharedValue(1);
  const animStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const base: ViewStyle = {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.lg,
    padding: theme.spacing.lg,
    ...theme.shadows.sm,
  };

  if (onPress) {
    return (
      <Pressable
        onPressIn={() => { if (animate) scale.value = withSpring(0.97, { damping: 15 }); }}
        onPressOut={() => { if (animate) scale.value = withSpring(1, { damping: 15 }); }}
        onPress={onPress}
      >
        <AView style={[base, animate ? animStyle : undefined, style]}>{children}</AView>
      </Pressable>
    );
  }

  return <View style={[base, style]}>{children}</View>;
}
