import { StyleSheet } from "react-native";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";
import { COLORS } from "../../constants";
import { FONTS } from "../../constants/fonts";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    // paddingTop: 50,
  },
  imageContainer: {
    alignItems: "center",
    paddingVertical: responsiveWidth(6),
  },
  buildingImage: {
    // width: 247,
    // height: 201,
    width: responsiveWidth(60),
    height: responsiveWidth(60),
  },
  title: {
    fontSize: 40,
    color: "white",
    textAlign: "left",
    marginBottom: 12,
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 13,
    color: "white",
    textAlign: "left",
    marginBottom: 15,
  },
  input: {
    // backgroundColor: "rgba(255, 255, 255, 0.1)",
    // borderRadius: 25,
    // paddingHorizontal: 20,
    // paddingVertical: 15,
    // fontSize: 16,
    // color: "white",
    // marginBottom: 15,
    // paddingLeft: responsiveWidth(16),
  },
  orText: {
    color: "white",
    textAlign: "center",
    marginVertical: 15,
    fontSize: 16,
  },
  phoneContainer: {
    // flexDirection: "row",
    // alignItems: "center",
    // backgroundColor: "rgba(255, 255, 255, 0.1)",
    // borderRadius: 25,
    // marginBottom: 30,
  },
  countryCode: {
    // paddingHorizontal: 15,
    // paddingVertical: 15,
    position: "absolute",
    zIndex: 99,
    top: responsiveWidth(2.4),
    left: responsiveWidth(6),
  },
  flag: {
    fontSize: responsiveFontSize(3),
  },
  phoneInput: {
    flex: 1,
    paddingVertical: 15,
    paddingRight: 20,
    fontSize: 16,
    color: "white",
  },
  otpButton: {
    backgroundColor: "#00bfff",
    borderRadius: 25,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 20,
  },
  otpButtonDisabled: {
    backgroundColor: "#cccccc",
    opacity: 0.7,
  },
  otpButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },

  dividerLine: {
    width: responsiveWidth(10),
    height: 1.2,
    backgroundColor: COLORS.primaryBlue,
    marginBottom: responsiveWidth(5),
  },
  forgetPasswordContainer: {
    alignItems: "center",
    marginBottom: responsiveWidth(5),
  },
  forgetPasswordText: {
    color: COLORS.primaryBlue,
    fontFamily: FONTS.Yellix,
    fontWeight: "600",
  },
  loginButtonContainer:{
    marginTop:"auto",
    marginBottom: responsiveWidth(10),
  }
});
