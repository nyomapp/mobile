import { useFonts } from 'expo-font';

export const useCustomFonts = () => {
  console.log('🔤 FontLoader: Starting font loading...');

  const [fontsLoaded, error] = useFonts({
    'ClashDisplay': require('../../assets/fonts/ClashDisplay-Variable.ttf'),
    'ClashDisplay-Bold': require('../../assets/fonts/ClashDisplay-Variable.ttf'),
    'Yellix': require('../../assets/fonts/yellix/Yellix-Regular.otf'),
    'Yellix-Bold': require('../../assets/fonts/yellix/Yellix-Bold.otf'),
    'Yellix-Thin': require('../../assets/fonts/yellix/Yellix-Thin.otf'),
  });

  // Debug logs
  console.log('🔤 FontLoader Status:');
  console.log('  - Fonts loaded:', fontsLoaded);
  console.log('  - Loading error:', error);

  if (fontsLoaded) {
    console.log('✅ All fonts loaded successfully!');
    console.log('📋 Available fonts:');
    console.log('  - ClashDisplay:', 'ClashDisplay');
    console.log('  - Yellix:', 'Yellix');
    console.log('  - Yellix-Bold:', 'Yellix-Bold');
    console.log('  - Yellix-Thin:', 'Yellix-Thin');
  } else if (error) {
    console.error('❌ Font loading failed:', error);
  } else {
    console.log('⏳ Fonts still loading...');
  }

  return fontsLoaded;
};

export const FONT_LOADED = {
  ClashDisplay: 'ClashDisplay',
  Yellix: 'Yellix',
  YellixThin: 'Yellix-Thin',
  YellixBold: 'Yellix-Bold',
};