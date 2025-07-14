import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { Dimensions } from 'react-native';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import * as SplashScreen from 'expo-splash-screen';
import { CycleProvider } from '@/contexts/CycleContext';
import { FastingPhaseProvider } from '@/contexts/FastingPhaseContext';
import { FastingRecordProvider } from '@/contexts/FastingRecordContext';
import { AuthProvider } from '@/contexts/AuthContext';

SplashScreen.preventAutoHideAsync();

// Set consistent Android phone dimensions for web preview
if (typeof window !== 'undefined') {
  const phoneWidth = 360;
  const phoneHeight = 640;
  
  // Apply phone-like dimensions to the viewport
  document.documentElement.style.setProperty('--phone-width', `${phoneWidth}px`);
  document.documentElement.style.setProperty('--phone-height', `${phoneHeight}px`);
}

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <>
      <AuthProvider>
        <CycleProvider>
          <FastingPhaseProvider>
            <FastingRecordProvider>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="login" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="+not-found" />
              </Stack>
              <StatusBar style="light" />
            </FastingRecordProvider>
          </FastingPhaseProvider>
        </CycleProvider>
      </AuthProvider>
    </>
  );
}