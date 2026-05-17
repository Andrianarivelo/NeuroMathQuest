import React, { useMemo } from 'react';
import { Text as NativeText, TextProps } from 'react-native';
import { useI18n } from './I18nProvider';

function translateChild(child: React.ReactNode, t: (value: string) => string): React.ReactNode {
  if (typeof child === 'string') {
    return t(child);
  }

  if (Array.isArray(child)) {
    return child.map((item, index) => (
      <React.Fragment key={index}>{translateChild(item, t)}</React.Fragment>
    ));
  }

  return child;
}

export const TranslatedText = React.forwardRef<React.ComponentRef<typeof NativeText>, TextProps>(
  function TranslatedText({ children, style, ...rest }, ref) {
    const { t } = useI18n();
    const skipTranslation = useMemo(() => {
      const styles = Array.isArray(style) ? style : [style];
      return styles.some((item) => {
        if (!item || typeof item !== 'object') return false;
        return 'fontFamily' in item && String(item.fontFamily).toLowerCase().includes('mono');
      });
    }, [style]);
    const translatedChildren = useMemo(
      () => (skipTranslation ? children : translateChild(children, t)),
      [children, skipTranslation, t]
    );

    return (
      <NativeText ref={ref} style={style} {...rest}>
        {translatedChildren}
      </NativeText>
    );
  }
);
