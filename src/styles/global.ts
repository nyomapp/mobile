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
    fontFamily: FONTS.Yellix,
    backgroundColor: COLORS.white 
  },
  background: {
    flex: 1,
  },
  container: {
    flex: 1,
    paddingHorizontal: responsiveWidth(4),
    // paddingVertical: responsiveWidth(6),
  },
  scrollContent: {
    flex: 1,
    paddingBottom: responsiveWidth(0),
  },
  heading: {
    fontSize: responsiveFontSize(3),
    // marginBottom: 16,
    fontFamily: FONTS.Yellix,
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

  // Button
  btn: {
    backgroundColor: COLORS.primaryBlue,
    paddingVertical: responsiveWidth(4),
    borderRadius: responsiveWidth(2),
    alignItems: "center",
    fontFamily: FONTS.YellixThin,
    marginTop: responsiveWidth(4),
    borderColor: COLORS.white,
  },

  btnText: {
    color: COLORS.white,
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.Yellix,
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
    backgroundColor: COLORS.primaryBlue,
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
    backgroundColor: COLORS.primaryBlue,
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
    justifyContent: "flex-end",
    // alignItems: "center",
    // paddingHorizontal: DIMENSIONS.padding.medium,
    //  padding: responsiveWidth(4),
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
    backgroundColor: COLORS.secondaryBlue,
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
    backgroundColor: COLORS.secondaryBlue,
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
    backgroundColor: COLORS.secondaryBlue,
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
    // bottom button container
   bottomContainer: {
    // paddingHorizontal: responsiveWidth(4),
    paddingBottom: responsiveWidth(4),
  },

  // Card styles
  card: {
    backgroundColor: COLORS.white,
    borderRadius: responsiveWidth(6),
    padding: responsiveWidth(4),
    marginBottom: responsiveWidth(4),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },

  // Stats container styles
  statsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  statCard: {
    backgroundColor: "#E0F7FA",
    borderRadius: responsiveWidth(4),
    padding: responsiveWidth(4),
    width: "48%",
    marginBottom: responsiveWidth(3),
    alignItems: "flex-start",
  },

  statCardAlt: {
    backgroundColor: "#B2EBF2",
  },

  // Floating button
  floatingButton: {
    position: "absolute",
    bottom: responsiveWidth(15),
    right: responsiveWidth(6),
    backgroundColor: COLORS.primaryBlue,
    width: responsiveWidth(14),
    height: responsiveWidth(14),
    borderRadius: responsiveWidth(4),
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
  },

  // Section titles
  sectionHeader: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: FONTS.Yellix,
    color: COLORS.black,
    marginBottom: responsiveWidth(4),
  },

  // Form styles
  formContainer: {
    flex: 1,
    // paddingHorizontal: responsiveWidth(4),
  },
  
  formInput: {
    backgroundColor: "#F8F9FA",
    borderRadius: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(4),
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.Yellix,
    color: COLORS.black,
    marginBottom: responsiveWidth(4),
    borderWidth: 1,
    borderColor: "#E9ECEF",
  },

  dropdown: {
    backgroundColor:COLORS.white,
    borderRadius: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(4),
    marginBottom: responsiveWidth(4),
  
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  dropdownText: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.Yellix,
    color: "#6C757D",
  },

 

 

  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F8F9FA",
    borderRadius: responsiveWidth(6),
    // padding: responsiveWidth(1),
    marginBottom: responsiveWidth(6),
    alignSelf: "flex-end",
    borderWidth: 1,
    borderColor: "#E9ECEF",
    minHeight: responsiveWidth(10),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  toggleButton: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(1.5),
    borderRadius: responsiveWidth(5),
    minWidth: responsiveWidth(20),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginHorizontal: responsiveWidth(0.5),
  },

  toggleButtonActive: {
    backgroundColor: COLORS.primaryBlue,
    shadowColor: "#000",
    // shadowOffset: {
    //   width: 0,
    //   height: 3,
    // },
    // shadowOpacity: 0.35,
    // shadowRadius: 4,
    // elevation: 5,
    // borderWidth: 1,
    // borderColor: COLORS.primaryBlue,
  },

  toggleButtonText: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.Yellix,
    color: "#6C757D",
    textAlign: "center",
    fontWeight: "100",
  },

  toggleButtonTextActive: {
    color: COLORS.white,
    fontFamily: FONTS.Yellix,
    fontWeight: "100",
    // fontSize: responsiveFontSize(2),
  },

  Title: {
    fontSize: responsiveFontSize(3.5),
    fontFamily: FONTS.Yellix,
    color: COLORS.black,
    marginBottom: responsiveWidth(4),
  },

  // nextButton: {
  //   backgroundColor: COLORS.primaryBlue,
  //   borderRadius: responsiveWidth(3),
  //   paddingVertical: responsiveWidth(4),
  //   alignItems: "center",
  //   marginTop: "auto",
  //   marginBottom: responsiveWidth(4),
  // },

  // nextButtonText: {
  //   color: COLORS.white,
  //   fontSize: responsiveFontSize(2.2),
  //   fontFamily: FONTS.MontserratSemiBold,
  // },

  backButton: {
    alignItems: "center",
    marginVertical: responsiveWidth(4),
  },

  backButtonText: {
    color: "#6C757D",
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.Yellix,
  },

  pageHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(6),
  },

  pageTitle: {
    fontSize: responsiveFontSize(5.5),
    paddingTop: responsiveWidth(5),
    fontFamily: FONTS.Yellix,
    fontWeight:"200",
    color: COLORS.secondaryBlue,
  },

  pageSubtitle: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.Yellix,
    color: "#6C757D",
  },
});
