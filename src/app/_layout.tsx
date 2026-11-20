import { useCallback, useState, useEffect } from 'react';
import { Slot, ThemeProvider } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as ExpoSplashScreen from 'expo-splash-screen';
import { theme } from '@/theme/colors';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import SplashScreenView from '@/screens/SplashScreen';

// Keep the native splash visible until the custom splash is ready.
void ExpoSplashScreen.preventAutoHideAsync().catch(console.warn);


export default function RootLayout() {
  const [showSplash, setShowSplash] = useState(true);

  const handleSplashReady = useCallback(() => {
    ExpoSplashScreen.hide();
  }, []);

  const handleSplashFinish = useCallback(() => {
    setShowSplash(false);
  }, []);

  const [fontsLoaded, fontError] = useFonts([
    {
      fontFamily: 'Montserrat',
      fontDefinitions: [
        {
          path: require('@/assets/fonts/Montserrat-VariableFont_wght.ttf'),
          weight: '100 900',
          style: 'normal',
        },
        {
          path: require('@/assets/fonts/Montserrat-Italic-VariableFont_wght.ttf'),
          weight: '100 900',
          style: 'italic',
        },
      ],
    },
  ]);

  useEffect(() => {
    if (fontError) {
      console.warn('Could not load Montserrat:', fontError);
    }
  }, [fontError]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider value={theme}>
          <Slot />
          {showSplash && (
            <SplashScreenView
              canStart={fontsLoaded || !!fontError}
              fontLoaded={fontsLoaded}
              onReady={handleSplashReady}
              onFinish={handleSplashFinish}
            />
          )}
          <StatusBar style="light" />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
