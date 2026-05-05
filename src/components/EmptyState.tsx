import React from 'react';
import { View, Text, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  title: string;
  message: string;
  action?: React.ReactNode;
  style?: ViewStyle;
}

export function EmptyState({ title, message, action, style }: Props) {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          alignItems: 'center',
          justifyContent: 'center',
          paddingVertical: 48,
          paddingHorizontal: 32,
        },
        style,
      ]}
    >
      <Text
        style={{
          ...theme.typography.h2,
          color: theme.colors.text,
          textAlign: 'center',
          marginBottom: 8,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          ...theme.typography.body,
          color: theme.colors.textMuted,
          textAlign: 'center',
          marginBottom: 20,
        }}
      >
        {message}
      </Text>
      {action}
    </View>
  );
}
