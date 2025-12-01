import { Dimensions, StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { COLORS, DIMENSIONS, FONTS } from '../constants';
const { width, height } = Dimensions.get("window");
export const authStyles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: DIMENSIONS.padding.small,
    paddingTop: DIMENSIONS.padding.medium,
  },
  imageContainer: {
    alignItems: 'center',
    // marginTop: DIMENSIONS.padding.large,
    // marginBottom: DIMENSIONS.padding.large,
    paddingVertical: responsiveWidth(8),
  },
  buildingImage: {
    width: 247,
    height: 201,
  },
  title: {
    fontSize: responsiveFontSize(4),
    color: COLORS.primaryBlue,
    textAlign: 'left',
    marginBottom: responsiveWidth(3),
    fontFamily: FONTS.Yellix,
    fontWeight:600,
    // lineHeight: 30,
  },
  subtitle: {
    fontSize: responsiveFontSize(2),
    color: COLORS.secondaryBlue,
    textAlign: 'left',
    marginBottom: responsiveWidth(5),
    // lineHeight: 22,
    fontFamily: FONTS.Yellix,
  },
  orText: {
    color: COLORS.white,
    textAlign: 'center',
    fontSize: responsiveFontSize(1.8),
    marginBottom: 16,
    opacity: 0.8,
    fontFamily: FONTS.body,
  },
  phoneContainer: {
    flexDirection: 'row',
    // backgroundColor: COLORS.white,
    backgroundColor: '#ff0',
    borderRadius: responsiveWidth(100),
    marginBottom: responsiveWidth(1),
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveWidth(1),
    fontSize: responsiveFontSize(1.8),
  },
  countryCode: {
    // paddingLeft: DIMENSIONS.padding.medium,
    // paddingRight: 12,
    // paddingVertical: 16,
    // borderRightWidth: 1,
    // borderRightColor: '#ff0',
  },
  flag: {
    fontSize: 20,
  },
  phoneInput: {
    flex: 1,
    // paddingHorizontal: 16,
    // paddingVertical: 16,
    // fontSize: 16,
    // color: '#333',
  },
  otpButton: {
    backgroundColor: COLORS.button.secondary,
    borderRadius: DIMENSIONS.borderRadius.large,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: DIMENSIONS.padding.large,
    borderWidth: 1,
    borderColor: COLORS.button.border,
    borderStyle: 'solid',
  },
  otpButtonText: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: FONTS.MontserratSemiBold,
  },

  input: {
    backgroundColor: COLORS.white,
    borderRadius: responsiveWidth(100),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(4),
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    marginBottom: responsiveWidth(4),
  },

  dropdown: {
    backgroundColor: COLORS.white,
    borderRadius: responsiveWidth(100),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(4),
    fontSize: responsiveFontSize(1.8),
    color: '#333',
    marginBottom: responsiveWidth(4),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  dropdownText: {
   fontSize: responsiveFontSize(1.8),
  },

  dropdownArrow: {
    fontSize: responsiveFontSize(1.8),
    color: '#666',
  },

});