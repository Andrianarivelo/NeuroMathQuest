import React from 'react';
import Svg, { Path } from 'react-native-svg';
import { View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  filled: number;
  total?: number;
  size?: number;
  style?: ViewStyle;
}

function StarIcon({ fill, size = 22 }: { fill: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M12 2l2.9 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l7.1-1.01L12 2z"
        fill={fill}
        stroke={fill}
        strokeWidth={1.2}
        strokeLinejoin="round"
      />
    </Svg>
  );
}

export function StarRow({ filled, total = 3, size = 22, style }: Props) {
  const theme = useTheme();
  return (
    <View style={[{ flexDirection: 'row', gap: 3 }, style]}>
      {Array.from({ length: total }).map((_, i) => (
        <StarIcon
          key={i}
          size={size}
          fill={i < filled ? theme.colors.gold : theme.colors.bgMuted}
        />
      ))}
    </View>
  );
}
