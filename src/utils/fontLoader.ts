import { useFonts } from 'expo-font';

export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    'ClashDisplay': require('../../assets/fonts/ClashDisplay-Variable.ttf'),
    'ClashDisplay-Bold': require('../../assets/fonts/ClashDisplay-Variable.ttf'),
    'Yellix': require('../../assets/fonts/yellix/Yellix-Regular.otf'),
    'Yellix-Bold': require('../../assets/fonts/yellix/Yellix-Bold.otf'),
    'Yellix-Thin': require('../../assets/fonts/yellix/Yellix-Thin.otf'),
  });

  return fontsLoaded;
};

export const FONT_LOADED = {
  ClashDisplay: 'ClashDisplay',
  Yellix: 'Yellix',
  YellixBold: 'Yellix-Bold',
};