import { forwardRef, useId, useState } from 'react';
import { StyleSheet, TextInput, View, type TextInputProps } from 'react-native';

import { colors } from '@/design/colors';
import { radii } from '@/design/radii';
import { spacing } from '@/design/spacing';
import { fontFamilies } from '@/design/typography';

import { AppText } from './AppText';

export interface TextFieldProps extends TextInputProps { label: string; error?: string; helperText?: string; }

export const TextField = forwardRef<TextInput, TextFieldProps>(function TextField({ label, error, helperText, editable = true, style, onFocus, onBlur, ...props }, ref) {
  const [focused, setFocused] = useState(false);
  const inputId = useId();
  const message = error ?? helperText;
  return (
    <View style={styles.wrapper}>
      <AppText nativeID={`${inputId}-label`} variant="labelMd" tone="secondary">{label}</AppText>
      <TextInput
        ref={ref}
        accessibilityLabel={label}
        accessibilityLabelledBy={`${inputId}-label`}
        accessibilityState={{ disabled: !editable }}
        aria-invalid={Boolean(error)}
        editable={editable}
        placeholderTextColor={colors.neutral[400]}
        style={[styles.input, { borderColor: error ? colors.semantic.danger.foreground : focused ? colors.brand[500] : colors.neutral[200], backgroundColor: editable ? colors.neutral[0] : colors.neutral[50], color: editable ? colors.neutral[900] : colors.neutral[500] }, style]}
        onFocus={(event) => { setFocused(true); onFocus?.(event); }}
        onBlur={(event) => { setFocused(false); onBlur?.(event); }}
        {...props}
      />
      {message ? <AppText variant="caption" tone={error ? 'danger' : 'muted'}>{message}</AppText> : null}
    </View>
  );
});

const styles = StyleSheet.create({ wrapper: { gap: spacing[2] }, input: { minHeight: 52, borderRadius: radii.sm, borderWidth: 1.5, paddingHorizontal: spacing[4], fontFamily: fontFamilies.body, fontSize: 14 } });
