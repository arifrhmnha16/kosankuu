import type { ComponentType } from 'react';
import { View, type ViewProps } from 'react-native';

export type LucideIcon = ComponentType<ViewProps & { color?: string; size?: number; strokeWidth?: number }>;

function MockIcon(props: ViewProps) {
  return <View accessibilityLabel="icon" {...props} />;
}

export const AlertCircle = MockIcon;
export const Inbox = MockIcon;
export const WifiOff = MockIcon;
export const BedDouble = MockIcon;
export const ArrowLeft = MockIcon;
export const ArrowRight = MockIcon;
export const ImagePlus = MockIcon;
export const Share2 = MockIcon;
export const Trash2 = MockIcon;
