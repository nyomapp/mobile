import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { AppProvider } from "../src/contexts";
import { soundManager } from "../src/utils/SoundUtils";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    ClashDisplay: require("../assets/fonts/ClashDisplay-Variable.ttf"),
    MontserratBold: require("../assets/fonts/montserrat/Montserrat-Bold.ttf"),
    MontserratRegular: require("../assets/fonts/montserrat/Montserrat-Regular.ttf"),
    MontserratSemiBold: require("../assets/fonts/montserrat/Montserrat-SemiBold.ttf"),
    Yellix: require("../assets/fonts/yellix/Yellix-Regular.otf"),
    "Yellix-Bold": require("../assets/fonts/yellix/Yellix-Bold.otf"),
    "Yellix-Thin": require("../assets/fonts/yellix/Yellix-Thin.otf"),
  });

  useEffect(() => {
    console.log('🔤 Root Layout - Fonts loaded:', loaded);
    
    if (loaded) {
      console.log('✅ All fonts loaded in _layout.tsx');
      console.log('📋 Available fonts:', {
        ClashDisplay: 'ClashDisplay',
        Yellix: 'Yellix', 
        'Yellix-Bold': 'Yellix-Bold',
        'Yellix-Thin': 'Yellix-Thin',
        MontserratRegular: 'MontserratRegular',
        MontserratBold: 'MontserratBold',
        MontserratSemiBold: 'MontserratSemiBold',
      });
      
      setTimeout(() => {
        SplashScreen.hideAsync();
      }, 3000);
      soundManager.initialize();
    }
  }, [loaded]);


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
