import { StyleSheet } from "react-native";
import {
    responsiveFontSize,
    responsiveWidth,
} from "react-native-responsive-dimensions";
import { COLORS } from "../constants";
import { FONTS } from "../constants/fonts";

export const settingsStyles = StyleSheet.create({
  profileSection: {
    flexDirection: "row",
    gap: responsiveWidth(4),
    // justifyContent: "center",
    alignItems: "center",
    paddingVertical: responsiveWidth(8),
    // paddingHorizontal: responsiveWidth(4),
  },

  profileImage: {
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    borderRadius: responsiveWidth(20),
    backgroundColor: "#D1D5DB",
    // marginBottom: responsiveWidth(4),
  },

  userName: {
    fontSize: responsiveFontSize(2.4),
    fontFamily: FONTS.Yellix,
    color: COLORS.black,
    marginBottom: responsiveWidth(1),
  },

  companyName: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: FONTS.Yellix,
    color: "#9CA3AF",
    marginBottom: responsiveWidth(4),
  },

  editProfileButton: {
    backgroundColor: COLORS.primaryBlue,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "flex-start",
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(0.75),
    borderRadius: responsiveWidth(2),
  },

  editProfileText: {
    fontSize: responsiveFontSize(1.4),
    fontFamily: FONTS.Yellix,
    color: COLORS.white,
  },

  contactSection: {
    paddingHorizontal: responsiveWidth(4),
    marginTop: responsiveWidth(4),
  },

  contactItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: responsiveWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  contactIcon: {
    // width: responsiveWidth(20),
    // height: responsiveWidth(20),
    borderRadius: responsiveWidth(2),
    // backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsiveWidth(4),
  },

  contactIconImage: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    tintColor: COLORS.primaryBlue,
  },

  contactInfo: {
    flex: 1,
  },

  contactLabel: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.Yellix,
    color: "#9CA3AF",
    marginBottom: responsiveWidth(0.5),
  },

  contactValue: {
    fontSize: responsiveFontSize(2.1),
    fontFamily: FONTS.Yellix,
    color: COLORS.black,
  },

  actionSection: {
    paddingHorizontal: responsiveWidth(4),
    marginTop: responsiveWidth(8),
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: responsiveWidth(12),
  },

  changePasswordButton: {
    alignItems: "center",
    paddingVertical: responsiveWidth(4),
    marginBottom: responsiveWidth(4),
  },

  changePasswordText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.Yellix,
    color: COLORS.black,
  },

  logoutButton: {
    backgroundColor: COLORS.primaryBlue,
    paddingVertical: responsiveWidth(4),
    borderRadius: responsiveWidth(2),
    alignItems: "center",
  },

  logoutText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.Yellix,
    color: COLORS.white,
  },
});
