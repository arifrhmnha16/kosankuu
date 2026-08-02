import type { ComponentType } from 'react';
import { View, type ViewProps } from 'react-native';

export type LucideIcon = ComponentType<ViewProps & { color?: string; size?: number; strokeWidth?: number }>;

function MockIcon(props: ViewProps) {
  return <View accessibilityLabel="icon" {...props} />;
}

export const AlertCircle = MockIcon;
export const Inbox = MockIcon;
export const WifiOff = MockIcon;
