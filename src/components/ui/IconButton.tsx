import { useState, type ReactNode } from 'react';
import { Pressable, StyleSheet, type PressableProps } from 'react-native';

import { colors } from '@/design/colors';
import { radii } from '@/design/radii';

export interface IconButtonProps extends Omit<PressableProps, 'children' | 'style'> { icon: ReactNode; accessibilityLabel: string; selected?: boolean; }

export function IconButton({ icon, selected = false, disabled = false, accessibilityLabel, onFocus, onBlur, ...props }: IconButtonProps) {
  const [focused, setFocused] = useState(false);
  const isDisabled = Boolean(disabled);
  return <Pressable accessibilityRole="button" accessibilityLabel={accessibilityLabel} accessibilityState={{ disabled: isDisabled, selected }} disabled={isDisabled} onFocus={(event) => { setFocused(true); onFocus?.(event); }} onBlur={(event) => { setFocused(false); onBlur?.(event); }} style={({ pressed, hovered }) => [styles.base, { backgroundColor: selected ? colors.brand[100] : pressed || hovered ? colors.brand[50] : colors.neutral[0], borderColor: focused ? colors.brand[500] : colors.neutral[200], opacity: isDisabled ? 0.5 : 1 }, focused && styles.focused]} {...props}>{icon}</Pressable>;
}

const styles = StyleSheet.create({ base: { width: 44, height: 44, borderRadius: radii.md, borderWidth: 1, alignItems: 'center', justifyContent: 'center' }, focused: { borderWidth: 2 } });
