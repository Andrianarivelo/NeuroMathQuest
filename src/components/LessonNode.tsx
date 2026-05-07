import React from 'react';
import { View, Text, ViewStyle, Pressable, useWindowDimensions } from 'react-native';
import Svg, { Circle } from 'react-native-svg';
import { useTheme } from '../theme/ThemeProvider';
import { LessonState } from '../services/unlockService';
import { StarRow } from './StarRow';

interface Props {
  title: string;
  state: LessonState;
  stars: number;
  xp: number;
  onPress?: () => void;
  allowLockedPress?: boolean;
  lockedLabel?: string;
  style?: ViewStyle;
}

const stateBg: Record<LessonState, string> = {
  locked: '#D2CDC4',
  unlocked: '#14B88A',
  in_progress: '#5741D9',
  completed: '#0A6B4E',
  mastered: '#F2AE09',
};

export function LessonNode({ title, state, stars, xp, onPress, allowLockedPress, lockedLabel, style }: Props) {
  const theme = useTheme();
  const { width } = useWindowDimensions();
  const isLocked = state === 'locked';
  const disabled = isLocked && !allowLockedPress;
  const size = 58;
  const safeWidth = Math.max(320, width || 320);
  const titleWidth = Math.min(safeWidth - 48, safeWidth < 520 ? 188 : 240);

  return (
    <Pressable
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[{ alignItems: 'center', opacity: isLocked ? 0.68 : 1, width: titleWidth }, style]}
    >
      <View
        style={{
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: stateBg[state],
          alignItems: 'center',
          justifyContent: 'center',
          ...theme.shadows.md,
        }}
      >
        {isLocked ? (
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Circle cx={12} cy={12} r={3} fill="#FFF" />
          </Svg>
        ) : state === 'mastered' ? (
          <Text style={{ fontSize: 22 }}>★</Text>
        ) : (
          <Svg width={24} height={24} viewBox="0 0 24 24">
            <Circle cx={12} cy={12} r={8} fill="none" stroke="#FFF" strokeWidth={2.5} />
            {state === 'completed' && <Circle cx={12} cy={12} r={4} fill="#FFF" />}
          </Svg>
        )}
      </View>
      <Text
        style={{
          ...theme.typography.caption,
          color: theme.colors.text,
          textAlign: 'center',
          marginTop: 6,
          width: titleWidth,
        }}
      >
        {title}
      </Text>
      {stars > 0 && <StarRow filled={stars} size={14} style={{ marginTop: 2 }} />}
      {isLocked && lockedLabel && (
        <View
          style={{
            marginTop: 4,
            backgroundColor: theme.colors.goldSoft,
            borderRadius: theme.radius.pill,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}
        >
          <Text style={{ ...theme.typography.tiny, color: theme.colors.gold }}>{lockedLabel}</Text>
        </View>
      )}
    </Pressable>
  );
}
