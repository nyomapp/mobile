import { StyleSheet } from "react-native";
import {
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { COLORS } from "../constants";
import { FONTS } from "../constants/fonts";
export const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: responsiveWidth(4),
  },
  totalAmountCard: {
    // backgroundColor: COLORS.white,
    paddingRight: responsiveWidth(1),
    // marginHorizontal: responsiveWidth(4),
    // marginBottom: responsiveWidth(4),
    // borderRadius: responsiveWidth(3),
    // padding: responsiveWidth(5),
    flexDirection: "column",
    // textAlign: "left",
  },
  totalAmountDisplay: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    marginLeft: "auto",
    minWidth: responsiveWidth(35),
    borderBottomColor: "#E5E7EB",
    paddingBottom: responsiveWidth(3),
    marginTop: responsiveWidth(2),
  },
  totalAmountValue: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.Yellix,
    color: "#333",
    textAlign: "right",
  },
  formSection: {
    paddingVertical: responsiveWidth(2),
  },
  amountRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: responsiveWidth(5),
    paddingRight: responsiveWidth(1),
    flex: 1,
  },
  amountLabel: {
    fontSize: responsiveFontSize(2.1),
    fontFamily: FONTS.YellixThin,
    // color: "#6B7280",
    flex: 1,
    marginRight: responsiveWidth(4),
  },
  discountLabel: {
    color: "#EF4444", // Red color for discount
  },
  totalAmountLabel: {
    fontSize: responsiveFontSize(2),
    // maxWidth: responsiveWidth(35),
    // minWidth: responsiveWidth(35),
    fontFamily: FONTS.Yellix,
    color: "#646566",
    marginLeft: "auto",
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(2),
    borderRadius: responsiveWidth(2),
    backgroundColor: COLORS.white,
    // borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 1,
  },
  amountInput: {
    flex: 1,
    maxWidth: responsiveWidth(35),
    textAlign: "left",
    paddingVertical: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(2),
    backgroundColor: "transparent",
    borderColor: "#E2E2E2",
    marginBottom: 0,
  },
  bottomNavigation: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveWidth(6),
    backgroundColor: COLORS.white,
  },
  backButton: {
    marginTop: responsiveWidth(10),
    flex: 1,
    alignItems: "flex-start",
  },
  backButtonText: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.Yellix,
    color: "#6B7280",
  },
  nextButton: {
    paddingHorizontal: responsiveWidth(8),
    // paddingVertical: responsiveWidth(3),
    flex: 1,
    maxWidth: responsiveWidth(30),
    alignItems: "center",
    marginHorizontal: responsiveWidth(4),
  },
  nextButtonText: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.Yellix,
    color: COLORS.white,
    fontWeight: "600",
  },
  skipButton: {
    marginTop: responsiveWidth(10),
    flex: 1,
    alignItems: "flex-end",
  },
  skipButtonText: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.YellixThin,
    // color: "#6B7280",
  },
});
