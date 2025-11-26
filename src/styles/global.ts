import { Dimensions, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constants";
const { width, height } = Dimensions.get("window");

import {
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";

export const allStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#000",
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(6),
  },
  scrollContent: {
    paddingBottom: responsiveWidth(0),
  },
  heading: {
    fontSize: responsiveFontSize(3),
    // marginBottom: 16,
    fontFamily: FONTS.primary,
    color: COLORS.white,
    // borderRadius: DIMENSIONS.borderRadius.large,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  subHeading: {
    fontSize: responsiveFontSize(2.2),
    // marginTop: responsiveWidth(2),
    // marginBottom: 8,
    color: COLORS.white,
    fontFamily: FONTS.MontserratSemiBold,
    textShadowColor: "rgba(0, 0, 0, 0.3)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  paragraph: {
    fontSize: responsiveFontSize(1.7),
    color: COLORS.white,
    lineHeight: responsiveWidth(6),
    fontFamily: FONTS.MontserratRegular,
  },

  //  Outline Button
  outlineBtn: {
    backgroundColor: "transparent",
    paddingVertical: responsiveWidth(3),
    borderRadius: responsiveWidth(100),
    alignItems: "center",
    marginTop: responsiveWidth(4),
    borderColor: COLORS.white,
    borderWidth: 1,
  },
  outlineBtnText: {
    color: COLORS.white,
    fontSize: responsiveFontSize(2.4),
    fontFamily: FONTS.MontserratSemiBold,
  },

  // Soild Button
  solidBtn: {
    backgroundColor: COLORS.white,
    paddingVertical: responsiveWidth(3),
    borderRadius: responsiveWidth(100),
    alignItems: "center",
    marginTop: responsiveWidth(4),
    borderColor: COLORS.white,
    borderWidth: 1,
  },
  solidBtnText: {
    color: COLORS.black,
    fontSize: responsiveFontSize(2.4),
    fontFamily: FONTS.MontserratSemiBold,
  },

  // primary Button
  primaryBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: responsiveWidth(3),
    borderRadius: responsiveWidth(100),
    alignItems: "center",
    marginTop: responsiveWidth(4),
    borderColor: COLORS.white,
    borderWidth: 1,
  },
  primaryBtnText: {
    color: COLORS.white,
    fontSize: responsiveFontSize(2.4),
    fontFamily: FONTS.MontserratSemiBold,
  },

  // Header settings
  solidHeader: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    // padding: 15,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(6),
    // paddingTop: responsiveWidth(4),
    // paddingBottom: 50,
    // paddingTop: 50,
    // paddingHorizontal: DIMENSIONS.padding.medium,
    // paddingBottom: DIMENSIONS.padding.medium,
    // marginBottom: 20,
    // marginBottom: responsiveWidth(2),
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: DIMENSIONS.padding.medium,
    // paddingTop: 50,
    // paddingBottom: DIMENSIONS.padding.medium,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: responsiveFontSize(3),
    fontFamily: FONTS.primary,
    letterSpacing: 1,
  },
  headerRight: {
    flexDirection: "row",
  },
  iconButton: {
    backgroundColor: COLORS.secondary,
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: responsiveWidth(4),
    // padding: responsiveWidth(4),
    // borderRadius: DIMENSIONS.borderRadius.medium,
    marginLeft: responsiveWidth(2),
  },
  btnCircle: {
    backgroundColor: COLORS.secondary,
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    justifyContent: "center",
    alignItems: "center",
    borderRadius: responsiveWidth(4),
  },
  headerRightIcon: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    // justifyContent: "center",
    // alignItems: "center",
    // borderRadius: responsiveWidth(4),
    // padding: responsiveWidth(4),
    // borderRadius: DIMENSIONS.borderRadius.medium,
    // marginLeft: responsiveWidth(2),
  },

  // Others
  sectionTitle: {
    color: COLORS.white,
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.MontserratSemiBold,
    marginBottom: responsiveWidth(3),
  },

  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: responsiveWidth(100),
    height: responsiveWidth(8),
    width: responsiveWidth(16),
    justifyContent: "center",
  },
  coinText: {
    color: "white",
    // fontWeight: "bold",
    fontFamily: FONTS.primary,
    marginLeft: responsiveWidth(1),
    fontSize: responsiveFontSize(1.8),
  },
  headerCoinIcon: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    // marginRight: responsiveWidth(1.8)
  },

  characterContainer: { alignItems: "center", marginTop: responsiveWidth(10) },
  characterImage: {
    width: responsiveWidth(66),
    height: responsiveWidth(66),
    marginBottom: responsiveWidth(-18),
    marginTop: responsiveWidth(2),
  },

  // 9 questions from left shoulder to right shoulder
  question8: {
    position: "absolute",
    top: responsiveWidth(40),
    left: responsiveWidth(14),
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    zIndex: 1,
    // display: 'none'
    // 1
  },
  question9: {
    position: "absolute",
    top: responsiveWidth(24),
    left: responsiveWidth(8),
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    zIndex: 1,
    // display: 'none'
    // 2
  },
  question1: {
    position: "absolute",
    top: responsiveWidth(7),
    left: responsiveWidth(14),
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    zIndex: 1,
    // display: 'none'
    // 3
  },
  question2: {
    position: "absolute",
    top: responsiveWidth(-5),
    left: responsiveWidth(28),
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    zIndex: 1,
    // display: 'none'
    // 4
  },
  question3: {
    position: "absolute",
    top: responsiveWidth(-12),
    left: responsiveWidth(44),
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    zIndex: 1,
    // display: 'none'
    // 5
  },
  question4: {
    position: "absolute",
    top: responsiveWidth(-5),
    right: responsiveWidth(28),
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    zIndex: 1,
    // display: 'none'
    // 6
  },
  question5: {
    position: "absolute",
    top: responsiveWidth(7),
    right: responsiveWidth(14),
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    zIndex: 1,
    // display: 'none'
    // 7
  },
  question6: {
    position: "absolute",
    top: responsiveWidth(24),
    right: responsiveWidth(8),
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    zIndex: 1,
    // display: 'none'
    // 8
  },
  question7: {
    position: "absolute",
    top: responsiveWidth(40),
    right: responsiveWidth(14),
    width: responsiveWidth(12),
    height: responsiveWidth(12),
    zIndex: 1,
    // display: 'none'
    // 9
  },
});
