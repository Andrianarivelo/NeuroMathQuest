import React from 'react';
import { View, ViewStyle } from 'react-native';
import { TranslatedText as Text } from '../i18n/TranslatedText';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  count: number;
  style?: ViewStyle;
}

export function StreakChip({ count, style }: Props) {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: count > 0 ? '#FFF4DA' : theme.colors.bgMuted,
          borderRadius: theme.radius.pill,
          paddingHorizontal: 12,
          paddingVertical: 6,
          gap: 5,
        },
        style,
      ]}
    >
      <Svg width={18} height={18} viewBox="0 0 24 24">
        <Path
          d="M12 23c-4.97-5.22-8-9.16-8-13A8 8 0 0 1 16.5 3.36C14.1 5.68 15 9 17 11c2 2 3 4.34 3 6a8 8 0 0 1-8 6z"
          fill={count > 0 ? '#F2AE09' : theme.colors.textMuted}
        />
      </Svg>
      <Text style={{ fontWeight: '800', fontSize: 15, color: count > 0 ? '#8A5A00' : theme.colors.textMuted }}>
        {count}
      </Text>
    </View>
  );
}

interface XPProps {
  amount: number;
  style?: ViewStyle;
}

export function XPChip({ amount, style }: XPProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.primarySoft,
          borderRadius: theme.radius.pill,
          paddingHorizontal: 12,
          paddingVertical: 6,
          gap: 5,
        },
        style,
      ]}
    >
      <Svg width={16} height={16} viewBox="0 0 24 24">
        <Path
          d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"
          fill={theme.colors.primary}
        />
      </Svg>
      <Text style={{ fontWeight: '800', fontSize: 14, color: theme.colors.primaryInk }}>
        {amount} XP
      </Text>
    </View>
  );
}

interface CoinProps {
  amount: number;
  style?: ViewStyle;
}

export function CoinChip({ amount, style }: CoinProps) {
  const theme = useTheme();
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: theme.colors.goldSoft,
          borderRadius: theme.radius.pill,
          paddingHorizontal: 12,
          paddingVertical: 6,
          gap: 5,
        },
        style,
      ]}
    >
      <Svg width={16} height={16} viewBox="0 0 24 24">
        <Path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 15c-.55 0-1-.45-1-1h-1c0 1.1.9 2 2 2s2-.9 2-2h-1c0 .55-.45 1-1 1zm1-4h-2v-1h.5c.83 0 1.5-.67 1.5-1.5S12.33 9 11.5 9h-.5V8h2V7h-2V5h-1v2h-.5C8.67 7 8 7.67 8 8.5S8.67 10 9.5 10h.5v1H8v1h2v2h1v-2h.5c.83 0 1.5.67 1.5 1.5h1c0-.83-.67-1.5-1.5-1.5z"
          fill={theme.colors.gold}
        />
      </Svg>
      <Text style={{ fontWeight: '800', fontSize: 14, color: '#8A5A00' }}>
        {amount}
      </Text>
    </View>
  );
}
