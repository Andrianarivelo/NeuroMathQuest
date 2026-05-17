import React from 'react';
import { View, ViewStyle } from 'react-native';
import { TranslatedText as Text } from '../i18n/TranslatedText';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  title: string;
  style?: ViewStyle;
}

export function SectionTitle({ title, style }: Props) {
  const theme = useTheme();
  return (
    <View style={[{ paddingHorizontal: theme.spacing.lg, paddingTop: theme.spacing.xl, paddingBottom: theme.spacing.sm }, style]}>
      <Text style={{ ...theme.typography.h2, color: theme.colors.text }}>{title}</Text>
    </View>
  );
}
