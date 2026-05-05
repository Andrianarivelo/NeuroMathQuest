import React from 'react';
import { View, ViewStyle, ImageSourcePropType } from 'react-native';
import { Image } from 'expo-image';
import { Lesson } from '../content/types';
import { useTheme } from '../theme/ThemeProvider';

interface Props {
  lesson: Lesson;
  style?: ViewStyle;
}

const lessonArt: Partial<Record<string, ImageSourcePropType>> = {
  A01: require('../../assets/lesson-art/A01.png'),
  B10: require('../../assets/lesson-art/B10.png'),
  B21: require('../../assets/lesson-art/B21.png'),
  B22: require('../../assets/lesson-art/B22.png'),
  B23: require('../../assets/lesson-art/B23.png'),
  B24: require('../../assets/lesson-art/B24.png'),
  B25: require('../../assets/lesson-art/B25.png'),
  B26: require('../../assets/lesson-art/B26.png'),
  B27: require('../../assets/lesson-art/B27.png'),
  B28: require('../../assets/lesson-art/B28.png'),
  B29: require('../../assets/lesson-art/B29.png'),
  B30: require('../../assets/lesson-art/B30.png'),
  B31: require('../../assets/lesson-art/B31.png'),
  B32: require('../../assets/lesson-art/B32.png'),
  B33: require('../../assets/lesson-art/B33.png'),
  B34: require('../../assets/lesson-art/B34.png'),
  B35: require('../../assets/lesson-art/B35.png'),
  B36: require('../../assets/lesson-art/B36.png'),
  B37: require('../../assets/lesson-art/B37.png'),
  B38: require('../../assets/lesson-art/B38.png'),
  B39: require('../../assets/lesson-art/B39.png'),
  B40: require('../../assets/lesson-art/B40.png'),
  C30: require('../../assets/lesson-art/C30.png'),
  C31: require('../../assets/lesson-art/C31.png'),
  C32: require('../../assets/lesson-art/C32.png'),
  C33: require('../../assets/lesson-art/C33.png'),
  C34: require('../../assets/lesson-art/C34.png'),
  C35: require('../../assets/lesson-art/C35.png'),
  C36: require('../../assets/lesson-art/C36.png'),
  C37: require('../../assets/lesson-art/C37.png'),
  C38: require('../../assets/lesson-art/C38.png'),
  C39: require('../../assets/lesson-art/C39.png'),
  C40: require('../../assets/lesson-art/C40.png'),
  C41: require('../../assets/lesson-art/C41.png'),
  C42: require('../../assets/lesson-art/C42.png'),
  C43: require('../../assets/lesson-art/C43.png'),
  C44: require('../../assets/lesson-art/C44.png'),
  C45: require('../../assets/lesson-art/C45.png'),
  C46: require('../../assets/lesson-art/C46.png'),
  C47: require('../../assets/lesson-art/C47.png'),
  C48: require('../../assets/lesson-art/C48.png'),
  C49: require('../../assets/lesson-art/C49.png'),
  C50: require('../../assets/lesson-art/C50.png'),
  D01: require('../../assets/lesson-art/D01.png'),
  D02: require('../../assets/lesson-art/D02.png'),
  D03: require('../../assets/lesson-art/D03.png'),
  D04: require('../../assets/lesson-art/D04.png'),
  D05: require('../../assets/lesson-art/D05.png'),
  D06: require('../../assets/lesson-art/D06.png'),
  D07: require('../../assets/lesson-art/D07.png'),
  D08: require('../../assets/lesson-art/D08.png'),
  D09: require('../../assets/lesson-art/D09.png'),
  D10: require('../../assets/lesson-art/D10.png'),
  D11: require('../../assets/lesson-art/D11.png'),
  D12: require('../../assets/lesson-art/D12.png'),
  D13: require('../../assets/lesson-art/D13.png'),
  D14: require('../../assets/lesson-art/D14.png'),
  D15: require('../../assets/lesson-art/D15.png'),
  D16: require('../../assets/lesson-art/D16.png'),
  D17: require('../../assets/lesson-art/D17.png'),
  D18: require('../../assets/lesson-art/D18.png'),
  D19: require('../../assets/lesson-art/D19.png'),
  D20: require('../../assets/lesson-art/D20.png'),
  D21: require('../../assets/lesson-art/D21.png'),
  D22: require('../../assets/lesson-art/D22.png'),
  D23: require('../../assets/lesson-art/D23.png'),
  D24: require('../../assets/lesson-art/D24.png'),
  D25: require('../../assets/lesson-art/D25.png'),
  D26: require('../../assets/lesson-art/D26.png'),
  D27: require('../../assets/lesson-art/D27.png'),
  D28: require('../../assets/lesson-art/D28.png'),
  D29: require('../../assets/lesson-art/D29.png'),
  D30: require('../../assets/lesson-art/D30.png'),
  E01: require('../../assets/lesson-art/E01.png'),
  E02: require('../../assets/lesson-art/E02.png'),
  E03: require('../../assets/lesson-art/E03.png'),
  E04: require('../../assets/lesson-art/E04.png'),
  E05: require('../../assets/lesson-art/E05.png'),
  E06: require('../../assets/lesson-art/E06.png'),
  E07: require('../../assets/lesson-art/E07.png'),
  E08: require('../../assets/lesson-art/E08.png'),
  E09: require('../../assets/lesson-art/E09.png'),
  E10: require('../../assets/lesson-art/E10.png'),
  E11: require('../../assets/lesson-art/E11.png'),
  E12: require('../../assets/lesson-art/E12.png'),
  E13: require('../../assets/lesson-art/E13.png'),
  E14: require('../../assets/lesson-art/E14.png'),
  E15: require('../../assets/lesson-art/E15.png'),
  E16: require('../../assets/lesson-art/E16.png'),
  E17: require('../../assets/lesson-art/E17.png'),
  E18: require('../../assets/lesson-art/E18.png'),
  E19: require('../../assets/lesson-art/E19.png'),
  E20: require('../../assets/lesson-art/E20.png'),
  E21: require('../../assets/lesson-art/E21.png'),
  E22: require('../../assets/lesson-art/E22.png'),
  E23: require('../../assets/lesson-art/E23.png'),
  E24: require('../../assets/lesson-art/E24.png'),
  E25: require('../../assets/lesson-art/E25.png'),
  E26: require('../../assets/lesson-art/E26.png'),
  E27: require('../../assets/lesson-art/E27.png'),
  E28: require('../../assets/lesson-art/E28.png'),
  E29: require('../../assets/lesson-art/E29.png'),
  E30: require('../../assets/lesson-art/E30.png'),
};

export function LessonCartoon({ lesson, style }: Props) {
  const theme = useTheme();
  const source = lessonArt[lesson.id];

  if (!source) return null;

  return (
    <View
      accessible
      accessibilityLabel={`Illustration for ${lesson.title}`}
      style={[
        {
          aspectRatio: 16 / 9,
          borderRadius: theme.radius.lg,
          overflow: 'hidden',
          backgroundColor: theme.colors.bgMuted,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadows.sm,
        },
        style,
      ]}
    >
      <Image
        source={source}
        contentFit="cover"
        transition={180}
        style={{ width: '100%', height: '100%' }}
      />
    </View>
  );
}
