import { StyleSheet } from 'react-native';
import { responsiveFontSize, responsiveWidth } from 'react-native-responsive-dimensions';
import { COLORS, FONTS } from '../constants';

export const otpStyles = StyleSheet.create({
  atmImage: {
    // width: 196,
    // height: 296,
    width: responsiveWidth(60),
    height: responsiveWidth(60),
    // marginBottom: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 40,
    paddingHorizontal: 10,
  },
  otpInput: {
    // width: 70,
    // height: 56,
    width: responsiveWidth(15),
    height: responsiveWidth(15),
    textAlign: 'center',
    backgroundColor: 'transparent',
    borderRadius: responsiveWidth(4),
    borderWidth: 2,
    borderColor: '#BEBFEE',
    fontSize: 24,
    color: COLORS.white,
    fontWeight: 'bold',
    fontFamily: FONTS.primary,
  },
  otpInputFilled: {
    backgroundColor: COLORS.white,
    color: '#333333',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: responsiveWidth(4),
  },
  resendText: {
    color: COLORS.white,
    fontSize: responsiveFontSize(1.8),
    // opacity: 0.8,
    fontFamily:FONTS.MontserratRegular
  },
  resendLink: {
    color: "#F5F3BC",
    fontSize: responsiveFontSize(1.8),
    // fontWeight: 'bold',
    textDecorationLine: 'underline',
    fontFamily: FONTS.MontserratBold,
  },
});