import { zodResolver } from '@hookform/resolvers/zod';
import { Link, type Href } from 'expo-router';
import { Eye, EyeOff, LogIn } from 'lucide-react-native';
import { Controller, useForm } from 'react-hook-form';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native';

import { AuthErrorBanner } from '@/components/auth/AuthErrorBanner';
import { AppText, Button, Card, IconButton, Screen, TextField } from '@/components/ui';
import { colors } from '@/design/colors';
import { radii } from '@/design/radii';
import { spacing } from '@/design/spacing';
import { loginSchema, type LoginValues } from '@/features/auth/schemas';
import { useAuth } from '@/hooks/useAuth';

const forgotPasswordHref = '/forgot-password' as Href;

export default function Login() {
  const { signIn, authState, error: authError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const { control, handleSubmit, formState: { isSubmitting } } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });
  const submit = handleSubmit(async (values) => {
    try { await signIn(values.email, values.password); } catch { /* Provider exposes a localized error. */ }
  });
  const notConfigured = authState === 'configuration-error';

  return (
    <Screen>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.keyboard}>
        <View style={styles.header}>
          <View style={styles.mark}><LogIn color={colors.brand[600]} size={26} /></View>
          <AppText variant="titleXl">Masuk ke Manzsa Residence</AppText>
          <AppText tone="secondary">Gunakan akun yang dibuat oleh owner. Tidak tersedia registrasi publik.</AppText>
        </View>
        <Card style={styles.form}>
          {notConfigured ? <AuthErrorBanner message="Firebase belum dikonfigurasi. Isi environment project untuk mengaktifkan login." /> : null}
          {authError && !notConfigured ? <AuthErrorBanner message={authError} /> : null}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value }, fieldState }) => (
              <TextField label="Email" value={value} onChangeText={onChange} onBlur={onBlur} error={fieldState.error?.message} editable={!isSubmitting && !notConfigured} keyboardType="email-address" autoCapitalize="none" autoCorrect={false} autoComplete="email" textContentType="emailAddress" returnKeyType="next" />
            )}
          />
          <View style={styles.password}>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value }, fieldState }) => (
                <TextField label="Password" value={value} onChangeText={onChange} onBlur={onBlur} error={fieldState.error?.message} editable={!isSubmitting && !notConfigured} secureTextEntry={!showPassword} autoCapitalize="none" autoComplete="current-password" textContentType="password" returnKeyType="done" onSubmitEditing={() => void submit()} style={styles.passwordInput} />
              )}
            />
            <View style={styles.eye}>
              <IconButton accessibilityLabel={showPassword ? 'Sembunyikan password' : 'Tampilkan password'} icon={showPassword ? <EyeOff color={colors.neutral[700]} size={20} /> : <Eye color={colors.neutral[700]} size={20} />} onPress={() => setShowPassword((value) => !value)} disabled={isSubmitting} />
            </View>
          </View>
          <Button label="Masuk" loading={isSubmitting} disabled={notConfigured} fullWidth onPress={() => void submit()} />
          <Link href={forgotPasswordHref} accessibilityRole="link" style={styles.link}>Lupa password?</Link>
        </Card>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  keyboard: { width: '100%', maxWidth: 480, alignSelf: 'center', gap: spacing[6] },
  header: { gap: spacing[3] },
  mark: { width: 52, height: 52, borderRadius: radii.lg, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.brand[50] },
  form: { gap: spacing[4] },
  password: { position: 'relative' },
  passwordInput: { paddingRight: spacing[16] },
  eye: { position: 'absolute', right: spacing[1], top: 35 },
  link: { minHeight: 44, alignSelf: 'center', padding: spacing[3], color: colors.brand[700], fontWeight: '600' },
});
