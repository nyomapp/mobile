import { useFonts } from 'expo-font';

export const useCustomFonts = () => {
  const [fontsLoaded] = useFonts({
    'ClashDisplay': require('../../assets/fonts/ClashDisplay-Variable.ttf'),
    'ClashDisplay-Bold': require('../../assets/fonts/ClashDisplay-Variable.ttf'),
  });

  return fontsLoaded;
};

export const FONT_LOADED = {
  ClashDisplay: 'ClashDisplay',
};