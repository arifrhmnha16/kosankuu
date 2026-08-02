import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'expo-router';
import { CheckCircle2, KeyRound } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';

import { AuthErrorBanner } from '@/components/auth/AuthErrorBanner';
import { AppText, Button, Card, Screen, TextField } from '@/components/ui';
import { colors } from '@/design/colors';
import { radii } from '@/design/radii';
import { spacing } from '@/design/spacing';
import { forgotPasswordSchema, type ForgotPasswordValues } from '@/features/auth/schemas';
import { useAuth } from '@/hooks/useAuth';

export default function ForgotPassword() {
  const { sendPasswordReset, authState, error } = useAuth();
  const [sent, setSent] = useState(false);
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<ForgotPasswordValues>({ resolver: zodResolver(forgotPasswordSchema), defaultValues: { email: '' } });
  const submit = handleSubmit(async ({ email }) => { try { await sendPasswordReset(email); setSent(true); } catch { /* Localized provider error is rendered below. */ } });
  const notConfigured = authState === 'configuration-error';
  return <Screen><View style={styles.container}><View style={styles.header}><View style={styles.mark}>{sent ? <CheckCircle2 color={colors.semantic.success.foreground} size={26} /> : <KeyRound color={colors.brand[600]} size={26} />}</View><AppText variant="titleXl">Atur ulang password</AppText><AppText tone="secondary">Masukkan email akun Anda untuk menerima petunjuk pengaturan ulang.</AppText></View><Card style={styles.form}>{sent ? <View accessibilityRole="summary" style={styles.success}><AppText variant="titleSm">Periksa email Anda</AppText><AppText tone="secondary">Jika email terdaftar, petunjuk pengaturan ulang password akan dikirim.</AppText></View> : <>{notConfigured ? <AuthErrorBanner message="Firebase belum dikonfigurasi untuk lingkungan ini." /> : null}{error && !notConfigured ? <AuthErrorBanner message={error} /> : null}<Controller control={control} name="email" render={({ field: { onChange, onBlur, value }, fieldState }) => <TextField label="Email" value={value} onChangeText={onChange} onBlur={onBlur} error={fieldState.error?.message} editable={!isSubmitting && !notConfigured} keyboardType="email-address" autoCapitalize="none" autoComplete="email" textContentType="emailAddress" returnKeyType="send" onSubmitEditing={() => void submit()} />} /><Button label="Kirim petunjuk reset" loading={isSubmitting} disabled={notConfigured} fullWidth onPress={() => void submit()} /></>}<Link href="/(auth)/login" accessibilityRole="link" style={styles.link}>Kembali ke login</Link></Card></View></Screen>;
}
const styles = StyleSheet.create({ container: { width: '100%', maxWidth: 480, alignSelf: 'center', gap: spacing[6] }, header: { gap: spacing[3] }, mark: { width: 52, height: 52, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.brand[50] }, form: { gap: spacing[4] }, success: { gap: spacing[2], padding: spacing[4], borderRadius: radii.md, backgroundColor: colors.semantic.success.background, borderWidth: 1, borderColor: colors.semantic.success.border }, link: { minHeight: 44, alignSelf: 'center', padding: spacing[3], color: colors.brand[700], fontWeight: '600' } });
