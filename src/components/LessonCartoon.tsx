import React from 'react';
import { View, ViewStyle } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Line,
  Path,
  Polygon,
  Polyline,
  Rect,
  Stop,
  Text as SvgText,
} from 'react-native-svg';
import { Lesson, TrackId } from '../content/types';
import { useTheme } from '../theme/ThemeProvider';

type CartoonKind =
  | 'neuron'
  | 'battery'
  | 'gates'
  | 'spike'
  | 'synapse'
  | 'balance'
  | 'chemistry'
  | 'receptor'
  | 'support'
  | 'field'
  | 'motor'
  | 'layers'
  | 'relay'
  | 'selector'
  | 'correction'
  | 'map'
  | 'emotion'
  | 'spotlight'
  | 'rhythm'
  | 'lab'
  | 'scalar'
  | 'vector'
  | 'components'
  | 'axes'
  | 'index'
  | 'time'
  | 'space'
  | 'matrix'
  | 'matrixProduct'
  | 'sum'
  | 'function'
  | 'slope'
  | 'dynamics'
  | 'probability'
  | 'spikeCounts'
  | 'model'
  | 'network'
  | 'tuning'
  | 'decode'
  | 'bayes'
  | 'scatter'
  | 'markov'
  | 'plasticity'
  | 'attractor'
  | 'fourier'
  | 'filter'
  | 'pca'
  | 'reward'
  | 'predictive'
  | 'efficient'
  | 'bci';

interface Props {
  lesson: Lesson;
  style?: ViewStyle;
}

interface CartoonColors {
  bgA: string;
  bgB: string;
  panel: string;
  panelAlt: string;
  ink: string;
  muted: string;
  line: string;
  accent: string;
  accentSoft: string;
  warm: string;
  cool: string;
  success: string;
  white: string;
}

const lessonKinds: Record<string, CartoonKind> = {
  A01: 'neuron',
  A02: 'battery',
  A03: 'gates',
  A04: 'spike',
  A05: 'synapse',
  A06: 'balance',
  A07: 'chemistry',
  A08: 'receptor',
  A09: 'support',
  A10: 'field',
  A11: 'motor',
  A12: 'layers',
  A13: 'relay',
  A14: 'selector',
  A15: 'correction',
  A16: 'map',
  A17: 'emotion',
  A18: 'spotlight',
  A19: 'rhythm',
  A20: 'lab',
  B01: 'scalar',
  B02: 'vector',
  B03: 'components',
  B04: 'axes',
  B05: 'index',
  B06: 'time',
  B07: 'space',
  B08: 'matrix',
  B09: 'matrix',
  B10: 'matrixProduct',
  B11: 'sum',
  B12: 'network',
  B13: 'function',
  B14: 'slope',
  B15: 'dynamics',
  B16: 'components',
  B17: 'space',
  B18: 'probability',
  B19: 'spike',
  B20: 'spikeCounts',
  C01: 'model',
  C02: 'battery',
  C03: 'spike',
  C04: 'time',
  C05: 'network',
  C06: 'balance',
  C07: 'tuning',
  C08: 'network',
  C09: 'decode',
  C10: 'bayes',
  C11: 'scatter',
  C12: 'rhythm',
  C13: 'markov',
  C14: 'spikeCounts',
  C15: 'plasticity',
  C16: 'plasticity',
  C17: 'correction',
  C18: 'attractor',
  C19: 'network',
  C20: 'attractor',
  C21: 'rhythm',
  C22: 'fourier',
  C23: 'filter',
  C24: 'function',
  C25: 'pca',
  C26: 'pca',
  C27: 'reward',
  C28: 'predictive',
  C29: 'efficient',
  C30: 'bci',
};

export function LessonCartoon({ lesson, style }: Props) {
  const theme = useTheme();
  const colors = colorsForTrack(lesson.trackId, theme.mode);
  const kind = lessonKinds[lesson.id] ?? fallbackKind(lesson.trackId);
  const gradientId = `lesson-cartoon-${lesson.id}`;
  const terms = lesson.keyTerms.slice(0, 2).map((term) => shorten(term, 18));

  return (
    <View
      accessible
      accessibilityLabel={`Cartoon illustration for ${lesson.title}`}
      style={[
        {
          height: 220,
          borderRadius: theme.radius.lg,
          overflow: 'hidden',
          backgroundColor: colors.bgA,
          borderWidth: 1,
          borderColor: theme.colors.border,
          ...theme.shadows.sm,
        },
        style,
      ]}
    >
      <Svg width="100%" height="100%" viewBox="0 0 360 220">
        <Defs>
          <LinearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.bgA} />
            <Stop offset="1" stopColor={colors.bgB} />
          </LinearGradient>
        </Defs>
        <Rect width="360" height="220" fill={`url(#${gradientId})`} />
        <Path
          d="M0 180 C52 156 92 190 145 170 C205 146 267 154 360 126 L360 220 L0 220 Z"
          fill={colors.panelAlt}
          opacity={0.62}
        />
        {renderScene(kind, colors, lesson.id)}
        {renderLessonBoard(lesson, terms, colors)}
        {renderGuide(colors)}
      </Svg>
    </View>
  );
}

function colorsForTrack(trackId: TrackId, mode: 'light' | 'dark'): CartoonColors {
  const dark = mode === 'dark';
  if (trackId === 'math') {
    return {
      bgA: dark ? '#10251F' : '#E8F8F0',
      bgB: dark ? '#1F3A34' : '#F5FBF7',
      panel: dark ? '#1B352E' : '#FFFFFF',
      panelAlt: dark ? '#173229' : '#D5F1E2',
      ink: dark ? '#F3F8F3' : '#10251F',
      muted: dark ? '#A8C8BB' : '#42645A',
      line: '#0A6B4E',
      accent: '#14B88A',
      accentSoft: '#9BE5C8',
      warm: '#F2AE09',
      cool: '#5741D9',
      success: '#0A6B4E',
      white: '#FFFFFF',
    };
  }
  if (trackId === 'compneuro') {
    return {
      bgA: dark ? '#2E250C' : '#FFF4D5',
      bgB: dark ? '#3C3216' : '#FFF9E8',
      panel: dark ? '#3A2C04' : '#FFFFFF',
      panelAlt: dark ? '#4A3A10' : '#FFE4A3',
      ink: dark ? '#FFF8E7' : '#352606',
      muted: dark ? '#D8BF82' : '#6F560E',
      line: '#8A5A00',
      accent: '#F2AE09',
      accentSoft: '#FAD46E',
      warm: '#F97316',
      cool: '#5741D9',
      success: '#0A6B4E',
      white: '#FFFFFF',
    };
  }
  return {
    bgA: dark ? '#17183C' : '#EFEDFF',
    bgB: dark ? '#25245A' : '#F9F7FF',
    panel: dark ? '#222052' : '#FFFFFF',
    panelAlt: dark ? '#2B2966' : '#DDD7FF',
    ink: dark ? '#F6F4FF' : '#191843',
    muted: dark ? '#C4BFE9' : '#5E588C',
    line: '#4530B8',
    accent: '#5741D9',
    accentSoft: '#B7ABFF',
    warm: '#F2AE09',
    cool: '#14B88A',
    success: '#0A6B4E',
    white: '#FFFFFF',
  };
}

function fallbackKind(trackId: TrackId): CartoonKind {
  if (trackId === 'math') return 'matrix';
  if (trackId === 'compneuro') return 'network';
  return 'neuron';
}

function shorten(value: string, limit: number) {
  return value.length <= limit ? value : `${value.slice(0, limit - 1)}.`;
}

function renderLessonBoard(lesson: Lesson, terms: string[], c: CartoonColors) {
  return (
    <G transform="translate(205 24)">
      <Rect x="0" y="0" width="134" height="88" rx="18" fill={c.panel} opacity={0.96} />
      <Rect x="0.75" y="0.75" width="132.5" height="86.5" rx="17" fill="none" stroke={c.line} strokeWidth="1.5" opacity={0.34} />
      <SvgText x="16" y="25" fill={c.ink} fontSize="15" fontWeight="800">
        {lesson.id}
      </SvgText>
      <SvgText x="16" y="45" fill={c.muted} fontSize="11" fontWeight="700">
        {shorten(lesson.title, 20)}
      </SvgText>
      <Line x1="16" y1="56" x2="118" y2="56" stroke={c.line} strokeWidth="2" opacity={0.22} />
      <SvgText x="16" y="73" fill={c.ink} fontSize="10" fontWeight="700">
        {terms[0] ?? 'concept'}
      </SvgText>
      <SvgText x="78" y="73" fill={c.muted} fontSize="10" fontWeight="700">
        {terms[1] ?? 'quiz'}
      </SvgText>
    </G>
  );
}

function renderGuide(c: CartoonColors) {
  return (
    <G transform="translate(279 146)">
      <Path d="M-25 31 C-6 15 25 15 43 31 L43 64 L-25 64 Z" fill={c.panel} opacity={0.95} />
      <Circle cx="9" cy="17" r="17" fill={c.warm} />
      <Circle cx="3" cy="14" r="2.2" fill={c.ink} />
      <Circle cx="15" cy="14" r="2.2" fill={c.ink} />
      <Path d="M1 23 C6 28 14 28 19 23" fill="none" stroke={c.ink} strokeWidth="2" strokeLinecap="round" />
      <Line x1="-7" y1="39" x2="-33" y2="26" stroke={c.ink} strokeWidth="4" strokeLinecap="round" />
      <Line x1="24" y1="39" x2="43" y2="25" stroke={c.ink} strokeWidth="4" strokeLinecap="round" />
      <Rect x="-7" y="36" width="32" height="28" rx="10" fill={c.accent} />
    </G>
  );
}

function renderScene(kind: CartoonKind, c: CartoonColors, lessonId: string) {
  switch (kind) {
    case 'neuron':
      return renderNeuron(c);
    case 'battery':
      return renderBattery(c);
    case 'gates':
      return renderGates(c);
    case 'spike':
      return renderSpike(c);
    case 'synapse':
      return renderSynapse(c);
    case 'balance':
      return renderBalance(c);
    case 'chemistry':
      return renderChemistry(c);
    case 'receptor':
      return renderReceptor(c);
    case 'support':
      return renderSupport(c);
    case 'field':
      return renderField(c);
    case 'motor':
      return renderMotor(c);
    case 'layers':
      return renderLayers(c);
    case 'relay':
      return renderRelay(c);
    case 'selector':
      return renderSelector(c);
    case 'correction':
      return renderCorrection(c);
    case 'map':
      return renderMap(c);
    case 'emotion':
      return renderEmotion(c);
    case 'spotlight':
      return renderSpotlight(c);
    case 'rhythm':
      return renderRhythm(c);
    case 'lab':
      return renderLab(c);
    case 'scalar':
      return renderScalar(c);
    case 'vector':
      return renderVector(c);
    case 'components':
      return renderComponents(c);
    case 'axes':
      return renderAxes(c);
    case 'index':
      return renderIndex(c);
    case 'time':
      return renderTime(c);
    case 'space':
      return renderSpace(c);
    case 'matrix':
      return renderMatrix(c, lessonId);
    case 'matrixProduct':
      return renderMatrixProduct(c);
    case 'sum':
      return renderSum(c);
    case 'function':
      return renderFunction(c);
    case 'slope':
      return renderSlope(c);
    case 'dynamics':
      return renderDynamics(c);
    case 'probability':
      return renderProbability(c);
    case 'spikeCounts':
      return renderSpikeCounts(c);
    case 'model':
      return renderModel(c);
    case 'network':
      return renderNetwork(c);
    case 'tuning':
      return renderTuning(c);
    case 'decode':
      return renderDecode(c);
    case 'bayes':
      return renderBayes(c);
    case 'scatter':
      return renderScatter(c);
    case 'markov':
      return renderMarkov(c);
    case 'plasticity':
      return renderPlasticity(c);
    case 'attractor':
      return renderAttractor(c, lessonId);
    case 'fourier':
      return renderFourier(c);
    case 'filter':
      return renderFilter(c);
    case 'pca':
      return renderPca(c);
    case 'reward':
      return renderReward(c);
    case 'predictive':
      return renderPredictive(c);
    case 'efficient':
      return renderEfficient(c);
    case 'bci':
      return renderBci(c);
  }
}

function renderNeuron(c: CartoonColors) {
  return (
    <G>
      <Circle cx="82" cy="92" r="24" fill={c.accentSoft} stroke={c.line} strokeWidth="4" />
      <Circle cx="82" cy="92" r="8" fill={c.panel} stroke={c.line} strokeWidth="2" />
      <Path d="M102 94 C132 94 145 77 172 70" fill="none" stroke={c.line} strokeWidth="7" strokeLinecap="round" />
      <Path d="M49 80 C28 62 20 43 12 26 M52 99 C28 110 20 132 10 150 M62 70 C48 42 49 28 45 12 M64 113 C52 140 52 154 44 178" fill="none" stroke={c.line} strokeWidth="5" strokeLinecap="round" />
      <Circle cx="170" cy="70" r="6" fill={c.warm} />
      <Circle cx="23" cy="132" r="5" fill={c.cool} />
      <Circle cx="18" cy="27" r="5" fill={c.warm} />
    </G>
  );
}

function renderBattery(c: CartoonColors) {
  return (
    <G>
      <Rect x="42" y="66" width="102" height="58" rx="18" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Rect x="144" y="84" width="13" height="22" rx="4" fill={c.line} />
      <SvgText x="62" y="101" fill={c.ink} fontSize="24" fontWeight="900">-</SvgText>
      <SvgText x="105" y="101" fill={c.ink} fontSize="21" fontWeight="900">+</SvgText>
      <Path d="M42 144 C69 126 116 162 158 138" fill="none" stroke={c.accent} strokeWidth="6" strokeLinecap="round" />
      <Circle cx="62" cy="44" r="8" fill={c.cool} />
      <Circle cx="124" cy="145" r="8" fill={c.warm} />
    </G>
  );
}

function renderGates(c: CartoonColors) {
  return (
    <G>
      <Path d="M30 82 C70 58 116 107 170 76" fill="none" stroke={c.line} strokeWidth="8" strokeLinecap="round" />
      {[50, 93, 136].map((x, index) => (
        <G key={x} transform={`translate(${x} ${index % 2 ? 82 : 66})`}>
          <Rect x="-11" y="-19" width="22" height="38" rx="8" fill={c.panel} stroke={c.line} strokeWidth="3" />
          <Line x1="-7" y1="0" x2="7" y2="0" stroke={c.accent} strokeWidth="3" strokeLinecap="round" />
        </G>
      ))}
      {[36, 70, 110, 154].map((x, index) => (
        <Circle key={x} cx={x} cy={132 + (index % 2) * 14} r="7" fill={index % 2 ? c.warm : c.cool} />
      ))}
    </G>
  );
}

function renderSpike(c: CartoonColors) {
  return (
    <G>
      <Line x1="35" y1="150" x2="172" y2="150" stroke={c.muted} strokeWidth="3" />
      <Line x1="35" y1="43" x2="35" y2="150" stroke={c.muted} strokeWidth="3" />
      <Line x1="36" y1="91" x2="172" y2="91" stroke={c.warm} strokeWidth="2" strokeDasharray="6 6" />
      <Path d="M38 135 C54 135 58 133 66 130 C74 126 78 43 86 43 C95 43 98 128 106 134 C119 145 141 136 171 136" fill="none" stroke={c.line} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
      <Circle cx="86" cy="43" r="7" fill={c.accent} />
      <SvgText x="122" y="82" fill={c.ink} fontSize="11" fontWeight="800">threshold</SvgText>
    </G>
  );
}

function renderSynapse(c: CartoonColors) {
  return (
    <G>
      <Path d="M22 70 C56 58 75 77 78 106 C82 143 47 153 20 137" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Path d="M175 69 C141 58 122 77 119 106 C115 143 150 153 177 137" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Line x1="80" y1="106" x2="116" y2="106" stroke={c.muted} strokeWidth="3" strokeDasharray="5 6" />
      {[90, 100, 109, 98, 88].map((x, index) => (
        <Circle key={`${x}-${index}`} cx={x} cy={88 + (index % 3) * 18} r="5" fill={index % 2 ? c.warm : c.accent} />
      ))}
    </G>
  );
}

function renderBalance(c: CartoonColors) {
  return (
    <G>
      <Line x1="97" y1="48" x2="97" y2="148" stroke={c.line} strokeWidth="5" strokeLinecap="round" />
      <Line x1="46" y1="72" x2="148" y2="72" stroke={c.line} strokeWidth="5" strokeLinecap="round" />
      <Path d="M47 75 L25 120 L70 120 Z" fill={c.accentSoft} stroke={c.line} strokeWidth="3" />
      <Path d="M148 75 L126 120 L171 120 Z" fill={c.panel} stroke={c.line} strokeWidth="3" />
      <SvgText x="41" y="111" fill={c.ink} fontSize="18" fontWeight="900">E</SvgText>
      <SvgText x="143" y="111" fill={c.ink} fontSize="18" fontWeight="900">I</SvgText>
      <Rect x="70" y="148" width="54" height="11" rx="5" fill={c.line} />
    </G>
  );
}

function renderChemistry(c: CartoonColors) {
  return (
    <G>
      <Path d="M48 44 L48 92 L28 143 C24 154 31 164 44 164 L94 164 C107 164 114 154 110 143 L90 92 L90 44" fill={c.panel} stroke={c.line} strokeWidth="4" strokeLinecap="round" />
      <Line x1="46" y1="94" x2="92" y2="94" stroke={c.accent} strokeWidth="5" />
      <Path d="M121 73 C143 58 169 70 174 95 C180 123 156 143 130 134 C107 126 101 87 121 73 Z" fill={c.accentSoft} stroke={c.line} strokeWidth="4" />
      {[53, 75, 92, 131, 148, 160].map((x, index) => (
        <Circle key={x} cx={x} cy={72 + (index % 3) * 25} r="6" fill={index % 2 ? c.warm : c.cool} />
      ))}
    </G>
  );
}

function renderReceptor(c: CartoonColors) {
  return (
    <G>
      <Rect x="34" y="83" width="132" height="34" rx="17" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Path d="M65 82 L65 51 C65 37 88 37 88 51 L88 82" fill="none" stroke={c.line} strokeWidth="5" strokeLinecap="round" />
      <Circle cx="77" cy="51" r="9" fill={c.warm} />
      <Circle cx="132" cy="100" r="17" fill={c.accentSoft} stroke={c.line} strokeWidth="4" />
      <Path d="M132 90 L132 100 L142 106" fill="none" stroke={c.ink} strokeWidth="3" strokeLinecap="round" />
    </G>
  );
}

function renderSupport(c: CartoonColors) {
  return (
    <G>
      {renderNeuron(c)}
      <G transform="translate(111 123)">
        <Path d="M0 0 C11 -19 37 -17 45 3 C54 27 27 42 9 28 C-3 20 -7 10 0 0 Z" fill={c.cool} opacity={0.9} />
        <Circle cx="19" cy="10" r="6" fill={c.panel} />
        <Line x1="36" y1="3" x2="55" y2="-10" stroke={c.cool} strokeWidth="5" strokeLinecap="round" />
      </G>
    </G>
  );
}

function renderField(c: CartoonColors) {
  return (
    <G>
      <Rect x="31" y="44" width="134" height="116" rx="18" fill={c.panel} stroke={c.line} strokeWidth="4" />
      {[0, 1, 2, 3].map((i) => (
        <Line key={`v-${i}`} x1={58 + i * 27} y1="44" x2={58 + i * 27} y2="160" stroke={c.muted} strokeWidth="1.4" opacity={0.35} />
      ))}
      {[0, 1, 2].map((i) => (
        <Line key={`h-${i}`} x1="31" y1={73 + i * 28} x2="165" y2={73 + i * 28} stroke={c.muted} strokeWidth="1.4" opacity={0.35} />
      ))}
      <Circle cx="98" cy="101" r="29" fill={c.accentSoft} stroke={c.line} strokeWidth="4" />
      <Circle cx="98" cy="101" r="9" fill={c.accent} />
    </G>
  );
}

function renderMotor(c: CartoonColors) {
  return (
    <G>
      <Path d="M47 68 C52 38 96 36 110 58 C126 40 159 57 156 86 C154 116 112 127 89 105 C67 121 39 104 47 68 Z" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Path d="M96 112 C106 129 124 140 151 145" fill="none" stroke={c.accent} strokeWidth="7" strokeLinecap="round" />
      <Path d="M151 145 L172 130 M151 145 L169 163" fill="none" stroke={c.accent} strokeWidth="6" strokeLinecap="round" />
      <Circle cx="84" cy="77" r="8" fill={c.warm} />
    </G>
  );
}

function renderLayers(c: CartoonColors) {
  return (
    <G>
      <Rect x="44" y="39" width="116" height="132" rx="18" fill={c.panel} stroke={c.line} strokeWidth="4" />
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <G key={i}>
          <Rect x="56" y={52 + i * 18} width="92" height="13" rx="6" fill={i % 2 ? c.accentSoft : c.panelAlt} />
          <SvgText x="63" y={62 + i * 18} fill={c.ink} fontSize="9" fontWeight="800">{i + 1}</SvgText>
        </G>
      ))}
      <Path d="M75 154 C90 132 113 139 127 112" fill="none" stroke={c.line} strokeWidth="3" strokeLinecap="round" />
    </G>
  );
}

function renderRelay(c: CartoonColors) {
  return (
    <G>
      <Circle cx="97" cy="102" r="31" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Circle cx="97" cy="102" r="13" fill={c.accent} />
      {[
        [32, 59, 70, 88],
        [165, 59, 124, 89],
        [30, 148, 71, 118],
        [166, 148, 123, 118],
      ].map(([x1, y1, x2, y2], index) => (
        <Line key={index} x1={x1} y1={y1} x2={x2} y2={y2} stroke={index % 2 ? c.warm : c.cool} strokeWidth="5" strokeLinecap="round" />
      ))}
    </G>
  );
}

function renderSelector(c: CartoonColors) {
  return (
    <G>
      <Circle cx="47" cy="101" r="15" fill={c.accent} />
      <Path d="M62 101 C92 74 118 62 162 56" fill="none" stroke={c.muted} strokeWidth="5" strokeLinecap="round" />
      <Path d="M62 101 C94 103 119 103 163 102" fill="none" stroke={c.accent} strokeWidth="7" strokeLinecap="round" />
      <Path d="M62 101 C92 129 119 143 163 150" fill="none" stroke={c.muted} strokeWidth="5" strokeLinecap="round" />
      {[162, 163, 163].map((x, index) => (
        <Circle key={index} cx={x} cy={[56, 102, 150][index]} r="12" fill={index === 1 ? c.warm : c.panel} stroke={c.line} strokeWidth="3" />
      ))}
    </G>
  );
}

function renderCorrection(c: CartoonColors) {
  return (
    <G>
      <Circle cx="100" cy="101" r="55" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Circle cx="100" cy="101" r="35" fill="none" stroke={c.accentSoft} strokeWidth="7" />
      <Circle cx="100" cy="101" r="12" fill={c.warm} />
      <Path d="M43 154 L76 125" stroke={c.cool} strokeWidth="6" strokeLinecap="round" />
      <Path d="M76 125 L70 145 M76 125 L55 129" stroke={c.cool} strokeWidth="5" strokeLinecap="round" />
    </G>
  );
}

function renderMap(c: CartoonColors) {
  return (
    <G>
      <Rect x="38" y="47" width="124" height="110" rx="20" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Path d="M60 132 C83 97 76 70 111 68 C139 66 130 112 151 124" fill="none" stroke={c.accent} strokeWidth="6" strokeLinecap="round" strokeDasharray="3 9" />
      <Circle cx="60" cy="132" r="9" fill={c.warm} />
      <Circle cx="111" cy="68" r="9" fill={c.cool} />
      <Circle cx="151" cy="124" r="9" fill={c.warm} />
    </G>
  );
}

function renderEmotion(c: CartoonColors) {
  return (
    <G>
      <Path d="M57 72 C71 43 113 44 127 73 C145 88 141 128 113 142 C84 157 48 134 47 100 C47 89 50 79 57 72 Z" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Path d="M91 72 L101 95 L126 95 L106 109 L114 133 L91 119 L68 133 L76 109 L56 95 L81 95 Z" fill={c.warm} />
      <Path d="M129 61 L169 39 L156 82 Z" fill={c.accent} stroke={c.line} strokeWidth="3" />
    </G>
  );
}

function renderSpotlight(c: CartoonColors) {
  return (
    <G>
      <Path d="M49 37 L137 37 L170 163 L16 163 Z" fill={c.accentSoft} opacity={0.58} />
      <Rect x="50" y="28" width="86" height="20" rx="10" fill={c.line} />
      <Circle cx="94" cy="115" r="26" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Circle cx="44" cy="142" r="12" fill={c.muted} opacity={0.45} />
      <Circle cx="150" cy="139" r="12" fill={c.muted} opacity={0.45} />
    </G>
  );
}

function renderRhythm(c: CartoonColors) {
  return (
    <G>
      {[55, 83, 111].map((x, index) => (
        <Circle key={x} cx={x} cy="57" r="11" fill={index % 2 ? c.warm : c.accent} />
      ))}
      <Path d="M27 126 C45 74 68 74 86 126 S127 178 169 126" fill="none" stroke={c.line} strokeWidth="7" strokeLinecap="round" />
      <Path d="M27 150 C45 98 68 98 86 150 S127 202 169 150" fill="none" stroke={c.cool} strokeWidth="4" strokeLinecap="round" opacity={0.75} />
      <Line x1="27" y1="173" x2="169" y2="173" stroke={c.muted} strokeWidth="3" opacity={0.4} />
    </G>
  );
}

function renderLab(c: CartoonColors) {
  return (
    <G>
      <Rect x="58" y="42" width="58" height="72" rx="15" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Circle cx="87" cy="78" r="18" fill={c.accentSoft} stroke={c.line} strokeWidth="3" />
      <Line x1="107" y1="100" x2="142" y2="139" stroke={c.line} strokeWidth="8" strokeLinecap="round" />
      <Rect x="48" y="144" width="118" height="12" rx="6" fill={c.line} />
      <Path d="M128 51 C150 67 155 83 155 105" fill="none" stroke={c.warm} strokeWidth="5" strokeLinecap="round" />
      <Circle cx="155" cy="105" r="7" fill={c.warm} />
    </G>
  );
}

function renderScalar(c: CartoonColors) {
  return (
    <G>
      <Rect x="50" y="48" width="105" height="113" rx="22" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <SvgText x="79" y="111" fill={c.ink} fontSize="44" fontWeight="900">7</SvgText>
      <Line x1="65" y1="128" x2="140" y2="128" stroke={c.accent} strokeWidth="5" strokeLinecap="round" />
      <Circle cx="48" cy="49" r="9" fill={c.warm} />
      <Circle cx="157" cy="160" r="9" fill={c.cool} />
    </G>
  );
}

function renderVector(c: CartoonColors) {
  return (
    <G>
      <Line x1="42" y1="144" x2="150" y2="64" stroke={c.line} strokeWidth="8" strokeLinecap="round" />
      <Path d="M150 64 L140 91 L124 70 Z" fill={c.line} />
      <Rect x="29" y="48" width="44" height="82" rx="15" fill={c.panel} stroke={c.line} strokeWidth="3" />
      {[0, 1, 2].map((i) => (
        <Circle key={i} cx="51" cy={68 + i * 22} r="6" fill={i % 2 ? c.warm : c.accent} />
      ))}
    </G>
  );
}

function renderComponents(c: CartoonColors) {
  return (
    <G>
      <Rect x="49" y="46" width="105" height="118" rx="20" fill={c.panel} stroke={c.line} strokeWidth="4" />
      {['x1', 'x2', 'x3'].map((label, i) => (
        <G key={label} transform={`translate(67 ${69 + i * 30})`}>
          <Rect x="0" y="-14" width="68" height="22" rx="8" fill={i % 2 ? c.panelAlt : c.accentSoft} />
          <SvgText x="20" y="2" fill={c.ink} fontSize="13" fontWeight="800">{label}</SvgText>
        </G>
      ))}
    </G>
  );
}

function renderAxes(c: CartoonColors) {
  return (
    <G>
      <Line x1="45" y1="148" x2="151" y2="148" stroke={c.line} strokeWidth="5" strokeLinecap="round" />
      <Line x1="45" y1="148" x2="45" y2="47" stroke={c.line} strokeWidth="5" strokeLinecap="round" />
      <Line x1="45" y1="148" x2="105" y2="91" stroke={c.cool} strokeWidth="4" strokeLinecap="round" />
      <Path d="M151 148 L136 140 L136 156 Z" fill={c.line} />
      <Path d="M45 47 L37 63 L53 63 Z" fill={c.line} />
      <Circle cx="105" cy="91" r="10" fill={c.warm} />
      <Circle cx="133" cy="122" r="7" fill={c.accent} />
    </G>
  );
}

function renderIndex(c: CartoonColors) {
  return (
    <G>
      {[0, 1, 2].map((i) => (
        <Rect key={i} x={41 + i * 38} y={61 + i * 10} width="52" height="70" rx="15" fill={i === 1 ? c.accentSoft : c.panel} stroke={c.line} strokeWidth="3" />
      ))}
      <SvgText x="66" y="107" fill={c.ink} fontSize="28" fontWeight="900">x</SvgText>
      <SvgText x="94" y="118" fill={c.ink} fontSize="14" fontWeight="900">i</SvgText>
      <Path d="M124 147 C137 136 149 121 155 104" fill="none" stroke={c.warm} strokeWidth="5" strokeLinecap="round" />
    </G>
  );
}

function renderTime(c: CartoonColors) {
  return (
    <G>
      <Rect x="34" y="54" width="137" height="105" rx="18" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Line x1="52" y1="135" x2="151" y2="135" stroke={c.muted} strokeWidth="3" />
      <Line x1="52" y1="135" x2="52" y2="74" stroke={c.muted} strokeWidth="3" />
      <Path d="M55 125 C76 101 86 111 100 89 C116 62 132 84 151 65" fill="none" stroke={c.accent} strokeWidth="5" strokeLinecap="round" />
      <SvgText x="112" y="151" fill={c.ink} fontSize="12" fontWeight="800">time</SvgText>
    </G>
  );
}

function renderSpace(c: CartoonColors) {
  return (
    <G>
      <Path d="M46 143 C69 89 123 72 166 111 C137 154 86 171 46 143 Z" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Line x1="74" y1="142" x2="143" y2="95" stroke={c.accent} strokeWidth="5" strokeLinecap="round" />
      <Line x1="89" y1="92" x2="130" y2="158" stroke={c.cool} strokeWidth="4" strokeLinecap="round" />
      {[70, 94, 124, 146].map((x, i) => (
        <Circle key={x} cx={x} cy={122 - (i % 2) * 18} r="6" fill={i % 2 ? c.warm : c.accent} />
      ))}
    </G>
  );
}

function renderMatrix(c: CartoonColors, lessonId: string) {
  const highlightRow = lessonId === 'B09';
  return (
    <G>
      <Rect x="48" y="48" width="118" height="118" rx="19" fill={c.panel} stroke={c.line} strokeWidth="4" />
      {[0, 1, 2, 3].map((i) => (
        <G key={i}>
          <Line x1={48 + i * 29.5} y1="48" x2={48 + i * 29.5} y2="166" stroke={c.line} strokeWidth="2" opacity={0.25} />
          <Line x1="48" y1={48 + i * 29.5} x2="166" y2={48 + i * 29.5} stroke={c.line} strokeWidth="2" opacity={0.25} />
        </G>
      ))}
      <Rect x={highlightRow ? 50 : 108} y={highlightRow ? 80 : 50} width={highlightRow ? 114 : 27} height={highlightRow ? 27 : 114} rx="8" fill={c.accentSoft} opacity={0.85} />
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <Circle key={i} cx={64 + (i % 3) * 30} cy={64 + Math.floor(i / 3) * 30} r="4" fill={i % 2 ? c.warm : c.line} />
      ))}
    </G>
  );
}

function renderMatrixProduct(c: CartoonColors) {
  return (
    <G>
      <G transform="translate(28 62) scale(0.72)">{renderMatrix(c, 'B08')}</G>
      <G transform="translate(122 68)">
        <Rect x="0" y="0" width="32" height="86" rx="14" fill={c.panel} stroke={c.line} strokeWidth="3" />
        {[0, 1, 2].map((i) => <Circle key={i} cx="16" cy={20 + i * 24} r="5" fill={c.accent} />)}
      </G>
      <Line x1="105" y1="109" x2="125" y2="109" stroke={c.warm} strokeWidth="5" strokeLinecap="round" />
      <Path d="M166 92 L185 109 L166 126 Z" fill={c.warm} />
    </G>
  );
}

function renderSum(c: CartoonColors) {
  return (
    <G>
      <Path d="M48 70 C81 49 116 49 149 70 L131 154 L66 154 Z" fill={c.panel} stroke={c.line} strokeWidth="4" />
      {[43, 69, 95, 121, 148].map((x, i) => (
        <Circle key={x} cx={x} cy={54 + (i % 2) * 16} r="9" fill={i % 2 ? c.warm : c.accent} />
      ))}
      <SvgText x="82" y="121" fill={c.ink} fontSize="32" fontWeight="900">sum</SvgText>
    </G>
  );
}

function renderFunction(c: CartoonColors) {
  return (
    <G>
      <Rect x="66" y="63" width="70" height="76" rx="20" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <SvgText x="89" y="109" fill={c.ink} fontSize="22" fontWeight="900">f</SvgText>
      <Line x1="29" y1="101" x2="64" y2="101" stroke={c.accent} strokeWidth="7" strokeLinecap="round" />
      <Line x1="138" y1="101" x2="176" y2="101" stroke={c.warm} strokeWidth="7" strokeLinecap="round" />
      <Path d="M176 101 L160 91 L160 111 Z" fill={c.warm} />
      <Circle cx="29" cy="101" r="10" fill={c.accent} />
    </G>
  );
}

function renderSlope(c: CartoonColors) {
  return (
    <G>
      <Line x1="38" y1="151" x2="167" y2="151" stroke={c.muted} strokeWidth="3" />
      <Line x1="38" y1="151" x2="38" y2="47" stroke={c.muted} strokeWidth="3" />
      <Path d="M41 136 C68 129 80 92 103 88 C128 83 142 61 162 54" fill="none" stroke={c.line} strokeWidth="5" strokeLinecap="round" />
      <Line x1="75" y1="120" x2="135" y2="72" stroke={c.warm} strokeWidth="6" strokeLinecap="round" />
      <Circle cx="104" cy="96" r="8" fill={c.accent} />
    </G>
  );
}

function renderDynamics(c: CartoonColors) {
  return (
    <G>
      <Circle cx="99" cy="105" r="48" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Path d="M80 69 C123 54 151 96 128 132 C101 173 41 145 57 96" fill="none" stroke={c.accent} strokeWidth="6" strokeLinecap="round" />
      <Path d="M128 132 L125 111 L146 119 Z" fill={c.accent} />
      <Circle cx="99" cy="105" r="11" fill={c.warm} />
    </G>
  );
}

function renderProbability(c: CartoonColors) {
  return (
    <G>
      <Rect x="36" y="52" width="132" height="112" rx="20" fill={c.panel} stroke={c.line} strokeWidth="4" />
      {[62, 87, 112, 137].map((x, i) => (
        <Rect key={x} x={x - 8} y={132 - i * 18} width="16" height={24 + i * 18} rx="6" fill={i % 2 ? c.warm : c.accent} />
      ))}
      <Path d="M55 61 L72 72 L64 91 L45 88 L41 69 Z" fill={c.accentSoft} stroke={c.line} strokeWidth="3" />
      <Circle cx="56" cy="74" r="2.5" fill={c.ink} />
      <Circle cx="64" cy="82" r="2.5" fill={c.ink} />
    </G>
  );
}

function renderSpikeCounts(c: CartoonColors) {
  return (
    <G>
      <Rect x="33" y="60" width="139" height="92" rx="18" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Line x1="50" y1="118" x2="154" y2="118" stroke={c.muted} strokeWidth="3" />
      {[59, 65, 89, 104, 131, 143].map((x, i) => (
        <Line key={x} x1={x} y1={118} x2={x} y2={81 + (i % 3) * 8} stroke={i % 2 ? c.warm : c.accent} strokeWidth="5" strokeLinecap="round" />
      ))}
      <Rect x="118" y="132" width="38" height="18" rx="7" fill={c.accentSoft} />
      <SvgText x="129" y="146" fill={c.ink} fontSize="12" fontWeight="900">6</SvgText>
    </G>
  );
}

function renderModel(c: CartoonColors) {
  return (
    <G>
      <Path d="M66 53 L136 53 L126 150 C124 164 78 164 76 150 Z" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Path d="M76 120 C95 107 111 132 130 117 L126 150 C124 164 78 164 76 150 Z" fill={c.accentSoft} />
      <Path d="M52 92 C33 111 45 133 68 130" fill="none" stroke={c.cool} strokeWidth="5" strokeLinecap="round" />
      <Path d="M136 96 C155 112 145 133 124 131" fill="none" stroke={c.warm} strokeWidth="5" strokeLinecap="round" />
      <Line x1="93" y1="42" x2="93" y2="28" stroke={c.line} strokeWidth="5" strokeLinecap="round" />
    </G>
  );
}

function renderNetwork(c: CartoonColors) {
  const nodes = [
    [54, 72],
    [98, 52],
    [145, 78],
    [70, 129],
    [126, 135],
  ];
  return (
    <G>
      {nodes.map(([x1, y1], i) =>
        nodes.slice(i + 1).map(([x2, y2], j) => (
          <Line key={`${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke={c.line} strokeWidth={i + j === 2 ? '5' : '3'} opacity={i + j === 2 ? 0.85 : 0.35} />
        ))
      )}
      {nodes.map(([x, y], i) => (
        <Circle key={`${x}-${y}`} cx={x} cy={y} r={i === 2 ? 16 : 13} fill={i % 2 ? c.accentSoft : c.panel} stroke={c.line} strokeWidth="4" />
      ))}
    </G>
  );
}

function renderTuning(c: CartoonColors) {
  return (
    <G>
      <Line x1="38" y1="150" x2="170" y2="150" stroke={c.muted} strokeWidth="3" />
      <Line x1="38" y1="150" x2="38" y2="52" stroke={c.muted} strokeWidth="3" />
      <Path d="M44 145 C66 142 74 106 93 82 C112 58 133 139 166 144" fill="none" stroke={c.line} strokeWidth="6" strokeLinecap="round" />
      <Circle cx="94" cy="82" r="9" fill={c.warm} />
      <Path d="M94 51 L106 70 L82 70 Z" fill={c.accent} />
    </G>
  );
}

function renderDecode(c: CartoonColors) {
  return (
    <G>
      <G transform="translate(27 50) scale(0.75)">{renderSpikeCounts(c)}</G>
      <Line x1="116" y1="105" x2="144" y2="105" stroke={c.warm} strokeWidth="5" strokeLinecap="round" />
      <Path d="M144 105 L132 97 L132 113 Z" fill={c.warm} />
      <Rect x="145" y="70" width="36" height="70" rx="12" fill={c.panel} stroke={c.line} strokeWidth="3" />
      <Path d="M154 111 L161 122 L175 91" fill="none" stroke={c.accent} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
    </G>
  );
}

function renderBayes(c: CartoonColors) {
  return (
    <G>
      <Circle cx="62" cy="94" r="31" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Circle cx="134" cy="94" r="31" fill={c.accentSoft} stroke={c.line} strokeWidth="4" />
      <Path d="M88 94 L108 94" stroke={c.warm} strokeWidth="6" strokeLinecap="round" />
      <Path d="M108 94 L99 86 L99 102 Z" fill={c.warm} />
      <Rect x="77" y="131" width="43" height="22" rx="9" fill={c.warm} />
      <SvgText x="89" y="147" fill={c.ink} fontSize="12" fontWeight="900">new</SvgText>
    </G>
  );
}

function renderScatter(c: CartoonColors) {
  const points = [
    [59, 128],
    [77, 112],
    [86, 101],
    [104, 87],
    [123, 72],
    [145, 63],
    [117, 115],
    [71, 83],
  ];
  return (
    <G>
      <Line x1="43" y1="151" x2="165" y2="151" stroke={c.muted} strokeWidth="3" />
      <Line x1="43" y1="151" x2="43" y2="47" stroke={c.muted} strokeWidth="3" />
      <Ellipse cx="101" cy="96" rx="64" ry="25" fill="none" stroke={c.accentSoft} strokeWidth="7" transform="rotate(-34 101 96)" />
      {points.map(([x, y], i) => <Circle key={i} cx={x} cy={y} r="5" fill={i % 2 ? c.warm : c.line} />)}
    </G>
  );
}

function renderMarkov(c: CartoonColors) {
  const states = [
    [57, 72, 'A'],
    [135, 72, 'B'],
    [97, 140, 'C'],
  ] as const;
  return (
    <G>
      <Path d="M72 74 C94 48 115 48 132 72 M128 88 C130 112 119 127 103 137 M89 138 C70 125 61 105 59 88" fill="none" stroke={c.line} strokeWidth="5" strokeLinecap="round" />
      {states.map(([x, y, label], i) => (
        <G key={label}>
          <Circle cx={x} cy={y} r="20" fill={i === 1 ? c.accentSoft : c.panel} stroke={c.line} strokeWidth="4" />
          <SvgText x={x - 5} y={y + 5} fill={c.ink} fontSize="14" fontWeight="900">{label}</SvgText>
        </G>
      ))}
    </G>
  );
}

function renderPlasticity(c: CartoonColors) {
  return (
    <G>
      <Circle cx="56" cy="96" r="24" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Circle cx="145" cy="96" r="24" fill={c.accentSoft} stroke={c.line} strokeWidth="4" />
      <Line x1="80" y1="96" x2="121" y2="96" stroke={c.warm} strokeWidth="11" strokeLinecap="round" />
      <Path d="M121 96 L104 83 L104 109 Z" fill={c.warm} />
      <Path d="M48 139 C75 160 128 160 153 139" fill="none" stroke={c.accent} strokeWidth="5" strokeLinecap="round" />
    </G>
  );
}

function renderAttractor(c: CartoonColors, lessonId: string) {
  if (lessonId === 'C20') {
    return (
      <G>
        <Circle cx="100" cy="105" r="54" fill="none" stroke={c.line} strokeWidth="8" />
        {[0, 1, 2, 3, 4].map((i) => {
          const angle = (i / 5) * Math.PI * 2;
          const x = 100 + Math.cos(angle) * 54;
          const y = 105 + Math.sin(angle) * 54;
          return <Circle key={i} cx={x} cy={y} r={i === 1 ? 11 : 7} fill={i === 1 ? c.warm : c.accentSoft} />;
        })}
      </G>
    );
  }
  return (
    <G>
      <Path d="M37 73 C57 156 139 156 164 73" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Path d="M56 83 C72 130 126 130 144 83" fill="none" stroke={c.accentSoft} strokeWidth="8" strokeLinecap="round" />
      <Circle cx="101" cy="126" r="13" fill={c.warm} stroke={c.line} strokeWidth="3" />
      <Path d="M62 48 C85 67 118 67 142 48" fill="none" stroke={c.cool} strokeWidth="4" strokeLinecap="round" />
    </G>
  );
}

function renderFourier(c: CartoonColors) {
  return (
    <G>
      <Path d="M27 87 C45 44 63 129 81 87 S117 45 135 87 S154 130 173 88" fill="none" stroke={c.line} strokeWidth="6" strokeLinecap="round" />
      <Line x1="101" y1="112" x2="101" y2="156" stroke={c.warm} strokeWidth="5" strokeLinecap="round" />
      <Path d="M33 154 C48 124 62 184 77 154 S106 124 121 154" fill="none" stroke={c.accent} strokeWidth="4" strokeLinecap="round" />
      <Path d="M124 154 C132 137 141 171 149 154 S166 137 174 154" fill="none" stroke={c.cool} strokeWidth="4" strokeLinecap="round" />
    </G>
  );
}

function renderFilter(c: CartoonColors) {
  return (
    <G>
      <Path d="M28 89 C43 69 58 109 72 89 S101 69 116 89" fill="none" stroke={c.muted} strokeWidth="4" strokeLinecap="round" />
      <Rect x="119" y="60" width="49" height="60" rx="15" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Line x1="134" y1="78" x2="153" y2="78" stroke={c.accent} strokeWidth="4" strokeLinecap="round" />
      <Line x1="134" y1="101" x2="153" y2="91" stroke={c.warm} strokeWidth="4" strokeLinecap="round" />
      <Path d="M31 145 C62 124 93 166 124 145 S155 124 177 145" fill="none" stroke={c.line} strokeWidth="6" strokeLinecap="round" />
    </G>
  );
}

function renderPca(c: CartoonColors) {
  return (
    <G>
      <Path d="M47 146 L156 64" stroke={c.warm} strokeWidth="6" strokeLinecap="round" />
      <Path d="M71 65 L137 151" stroke={c.cool} strokeWidth="4" strokeLinecap="round" opacity={0.68} />
      {[55, 72, 84, 98, 115, 129, 146, 111, 88].map((x, i) => (
        <Circle key={i} cx={x} cy={130 - (x - 55) * 0.55 + (i % 3) * 11} r="5" fill={i % 2 ? c.accent : c.line} />
      ))}
      <Path d="M56 150 L148 150 L148 158 L56 158 Z" fill={c.panel} opacity={0.7} />
    </G>
  );
}

function renderReward(c: CartoonColors) {
  return (
    <G>
      <Circle cx="82" cy="93" r="34" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Path d="M82 60 A33 33 0 0 1 115 93" fill="none" stroke={c.accent} strokeWidth="8" strokeLinecap="round" />
      <Line x1="82" y1="93" x2="107" y2="77" stroke={c.warm} strokeWidth="5" strokeLinecap="round" />
      <Rect x="118" y="118" width="46" height="36" rx="12" fill={c.warm} stroke={c.line} strokeWidth="3" />
      <Path d="M141 118 L141 154 M118 136 L164 136" stroke={c.ink} strokeWidth="2.5" opacity={0.65} />
    </G>
  );
}

function renderPredictive(c: CartoonColors) {
  return (
    <G>
      {[0, 1, 2].map((i) => (
        <Rect key={i} x={49 + i * 34} y={56 + i * 28} width="72" height="35" rx="13" fill={i % 2 ? c.accentSoft : c.panel} stroke={c.line} strokeWidth="3" />
      ))}
      <Path d="M71 150 C84 126 98 108 119 91" fill="none" stroke={c.warm} strokeWidth="5" strokeLinecap="round" />
      <Path d="M119 91 L99 95 L111 111 Z" fill={c.warm} />
      <Path d="M151 67 C142 89 128 104 110 121" fill="none" stroke={c.cool} strokeWidth="4" strokeLinecap="round" strokeDasharray="5 6" />
    </G>
  );
}

function renderEfficient(c: CartoonColors) {
  return (
    <G>
      <Path d="M46 55 L158 55 L116 120 L116 155 L88 155 L88 120 Z" fill={c.panel} stroke={c.line} strokeWidth="4" />
      {[56, 74, 93, 111, 130, 148].map((x, i) => (
        <Line key={x} x1={x} y1="36" x2={x} y2={55} stroke={i % 2 ? c.warm : c.accent} strokeWidth="4" strokeLinecap="round" />
      ))}
      <Line x1="102" y1="155" x2="102" y2="177" stroke={c.line} strokeWidth="5" strokeLinecap="round" />
      <SvgText x="82" y="103" fill={c.ink} fontSize="13" fontWeight="900">code</SvgText>
    </G>
  );
}

function renderBci(c: CartoonColors) {
  return (
    <G>
      <Path d="M46 73 C51 43 96 40 111 62 C125 46 158 62 155 91 C151 128 101 127 91 106 C73 125 39 107 46 73 Z" fill={c.panel} stroke={c.line} strokeWidth="4" />
      <Line x1="123" y1="108" x2="169" y2="139" stroke={c.accent} strokeWidth="6" strokeLinecap="round" />
      <Rect x="153" y="126" width="32" height="32" rx="7" fill={c.warm} stroke={c.line} strokeWidth="3" />
      <Path d="M74 82 C91 65 116 84 100 103" fill="none" stroke={c.accent} strokeWidth="4" strokeLinecap="round" />
      <Circle cx="98" cy="103" r="5" fill={c.accent} />
    </G>
  );
}
