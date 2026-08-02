import type { TextStyle } from 'react-native';

export const fontFamilies = { display: 'Manrope_700Bold', displaySemibold: 'Manrope_600SemiBold', displayExtraBold: 'Manrope_800ExtraBold', body: 'Inter_400Regular', bodyMedium: 'Inter_500Medium', bodySemibold: 'Inter_600SemiBold', bodyBold: 'Inter_700Bold' } as const;

export const typography = {
  displayLg: { fontFamily: fontFamilies.display, fontSize: 32, lineHeight: 40 },
  displaySm: { fontFamily: fontFamilies.display, fontSize: 28, lineHeight: 36 },
  titleXl: { fontFamily: fontFamilies.display, fontSize: 24, lineHeight: 32 },
  titleLg: { fontFamily: fontFamilies.display, fontSize: 20, lineHeight: 28 },
  titleMd: { fontFamily: fontFamilies.displaySemibold, fontSize: 18, lineHeight: 26 },
  titleSm: { fontFamily: fontFamilies.displaySemibold, fontSize: 16, lineHeight: 24 },
  bodyLg: { fontFamily: fontFamilies.body, fontSize: 16, lineHeight: 24 },
  bodyMd: { fontFamily: fontFamilies.body, fontSize: 14, lineHeight: 21 },
  bodySm: { fontFamily: fontFamilies.body, fontSize: 13, lineHeight: 19 },
  labelLg: { fontFamily: fontFamilies.bodySemibold, fontSize: 15, lineHeight: 20 },
  labelMd: { fontFamily: fontFamilies.bodySemibold, fontSize: 13, lineHeight: 18 },
  caption: { fontFamily: fontFamilies.bodyMedium, fontSize: 12, lineHeight: 17 },
  micro: { fontFamily: fontFamilies.bodySemibold, fontSize: 10, lineHeight: 14 },
  moneyLg: { fontFamily: fontFamilies.displayExtraBold, fontSize: 28, lineHeight: 34 },
  moneyMd: { fontFamily: fontFamilies.display, fontSize: 20, lineHeight: 26 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;
