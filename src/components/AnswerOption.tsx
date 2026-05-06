import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

export type AnswerOptionState = 'idle' | 'selected' | 'correct' | 'incorrect';

interface Props {
  label: string;
  text: string;
  state?: AnswerOptionState;
  disabled?: boolean;
  onPress: () => void;
}

export function AnswerOption({ label, text, state = 'idle', disabled, onPress }: Props) {
  const theme = useTheme();
  const selected = state !== 'idle';
  const correct = state === 'correct';
  const incorrect = state === 'incorrect';

  const backgroundColor = correct
    ? theme.colors.successSoft
    : incorrect
    ? theme.colors.dangerSoft
    : state === 'selected'
    ? theme.colors.primarySoft
    : theme.colors.surface;

  const borderColor = correct
    ? theme.colors.success
    : incorrect
    ? theme.colors.danger
    : selected
    ? theme.colors.primary
    : theme.colors.border;

  const badgeColor = correct
    ? theme.colors.success
    : incorrect
    ? theme.colors.danger
    : selected
    ? theme.colors.primary
    : theme.colors.bgMuted;

  const badgeTextColor = selected ? theme.colors.textInverse : theme.colors.textMuted;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={{
        backgroundColor,
        borderWidth: 2,
        borderColor,
        borderRadius: theme.radius.md,
        padding: 14,
        marginBottom: 10,
        flexDirection: 'row',
        gap: 12,
        alignItems: 'flex-start',
      }}
    >
      <View
        style={{
          width: 28,
          height: 28,
          borderRadius: 14,
          backgroundColor: badgeColor,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: 1,
        }}
      >
        <Text style={{ ...theme.typography.caption, color: badgeTextColor }}>{label}</Text>
      </View>
      <Text style={{ ...theme.typography.body, color: theme.colors.text, flex: 1 }}>{text}</Text>
    </Pressable>
  );
}
