import { Platform, type ViewStyle } from 'react-native';

const nativeShadow = (opacity: number, radius: number, height: number, elevation: number): ViewStyle => ({ shadowColor: '#102B47', shadowOpacity: opacity, shadowRadius: radius, shadowOffset: { width: 0, height }, elevation });

export const shadows = {
  none: {} as ViewStyle,
  card: Platform.select({ web: { boxShadow: '0 8px 16px rgba(16,43,71,0.07)' } as ViewStyle, default: nativeShadow(0.07, 16, 8, 2) }),
  floating: Platform.select({ web: { boxShadow: '0 12px 24px rgba(16,43,71,0.12)' } as ViewStyle, default: nativeShadow(0.12, 24, 12, 8) }),
  modal: Platform.select({ web: { boxShadow: '0 16px 32px rgba(15,31,51,0.18)' } as ViewStyle, default: nativeShadow(0.18, 32, 16, 12) }),
} as const;
