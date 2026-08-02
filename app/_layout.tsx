import { Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold } from '@expo-google-fonts/manrope';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { LoadingState } from '@/components/feedback';
import { colors } from '@/design/colors';
import { AppProviders } from '@/providers/AppProviders';
import { useAuth } from '@/hooks/useAuth';
import { getRouteAccess } from '@/features/auth/access';

void SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({ Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Manrope_600SemiBold, Manrope_700Bold, Manrope_800ExtraBold });
  useEffect(() => { if (fontsLoaded || fontError) void SplashScreen.hideAsync(); }, [fontsLoaded, fontError]);
  if (!fontsLoaded && !fontError) return <LoadingState label="Menyiapkan Manzsa Residence…" />;
  return <AppProviders><StatusBar style="dark" /><AppNavigator /></AppProviders>;
}

function AppNavigator() {
  const { authState, role, firebaseUser, isLoading } = useAuth();
  if (isLoading) return <LoadingState label="Memeriksa sesi akun…" />;
  const access = getRouteAccess(authState, role, Boolean(firebaseUser));
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.neutral[25] } }}>
      <Stack.Protected guard={access.tenant}><Stack.Screen name="(tenant)" /></Stack.Protected>
      <Stack.Protected guard={access.owner}><Stack.Screen name="(owner)" /></Stack.Protected>
      <Stack.Protected guard={access.accountStatus}><Stack.Screen name="account-status" /></Stack.Protected>
      <Stack.Protected guard={access.auth}><Stack.Screen name="(auth)" /></Stack.Protected>
      <Stack.Screen name="(public)" />
    </Stack>
  );
}
