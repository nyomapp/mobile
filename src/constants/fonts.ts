import { Platform } from 'react-native';

export const FONTS = {
  ClashDisplay: 'ClashDisplay',
  Yellix: 'Yellix',
  YellixBold: 'Yellix-Bold',
  YellixMedium: 'Yellix-Medium',
  YellixThin: 'Yellix-Thin',
  // Montserrat variants
  MontserratRegular: 'MontserratRegular',
  MontserratSemiBold: 'MontserratSemiBold',
  MontserratBold: 'MontserratBold',
  // Primary font (ClashDisplay for headings)
  primary: 'ClashDisplay',
  // Body font (Montserrat for body text)
  body: 'MontserratRegular',
  bodySemiBold: 'MontserratSemiBold',
  bodyBold: 'MontserratBold',
  // System fonts
  system: Platform.select({
    ios: 'System',
    android: 'Roboto',
    web: 'system-ui',
    default: 'System',
  }),
};

// import { Platform } from 'react-native';

// export const FONTS = {
//   // Font families
//   clashDisplay: 'ClashDisplay',
//   montserrat: {
//     regular: 'Montserrat-Regular',
//     semiBold: 'Montserrat-SemiBold',
//     bold: 'Montserrat-Bold',
//   },

//   // Typographic hierarchy
//   primary: 'ClashDisplay',
//   body: 'Montserrat-Regular',

//   // Platform system fonts
//   system: Platform.select({
//     ios: 'System',
//     android: 'Roboto',
//     web: 'system-ui',
//     default: 'System',
//   }),
// };
