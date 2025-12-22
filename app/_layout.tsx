import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { AppProvider } from "../src/contexts";
import { soundManager } from "../src/utils/SoundUtils";

SplashScreen.preventAutoHideAsync();

console.log('🟢 APP ENTRY: _layout.tsx loaded');

// Simple global error boundary
function ErrorBoundary({ error }: { error: Error }) {
  return (
    <>
      <Stack.Screen name="Error" options={{ headerShown: false }} />
      <div style={{ flex: 1, justifyContent: 'center', alignItems: 'center', background: 'white' }}>
        <h1 style={{ color: 'red' }}>App Error</h1>
        <pre style={{ color: 'black', fontSize: 12 }}>{error.message}</pre>
      </div>
    </>
  );
}

export default function RootLayout() {
  const [error, setError] = useState<Error | null>(null);
  const [loaded] = useFonts({
    ClashDisplay: require("../assets/fonts/ClashDisplay-Variable.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
    MontserratRegular: require("../assets/fonts/montserrat/Montserrat-Regular.ttf"),
    MontserratSemiBold: require("../assets/fonts/montserrat/Montserrat-SemiBold.ttf"),
    Yellix: require("../assets/fonts/yellix/Yellix-Regular.otf"),
    "Yellix-Bold": require("../assets/fonts/yellix/Yellix-Bold.otf"),
    "Yellix-Medium": require("../assets/fonts/yellix/Yellix-Medium.otf"),
    "Yellix-Thin": require("../assets/fonts/yellix/Yellix-Thin.otf"),
  });

  useEffect(() => {
    try {
      console.log('🔤 Root Layout - Fonts loaded:', loaded);
      if (loaded) {
        console.log('✅ All fonts loaded in _layout.tsx');
        setTimeout(() => {
          SplashScreen.hideAsync();
        }, 3000);
        soundManager.initialize();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error(String(err)));
      console.error('❌ Error in RootLayout useEffect:', err);
    }
  }, [loaded]);


  if (error) {
    return <ErrorBoundary error={error} />;
  }
  if (!loaded) {
    return null;
  }

  return (
    <AppProvider>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="[...slug]" options={{ headerShown: false }} />
      </Stack>
    </AppProvider>
  );
}
