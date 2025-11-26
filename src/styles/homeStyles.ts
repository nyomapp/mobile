import { StyleSheet } from "react-native";
import {
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { COLORS, DIMENSIONS, FONTS } from "../constants";
export const homeStyles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: DIMENSIONS.padding.medium,
    paddingTop: 25,
    paddingBottom: DIMENSIONS.padding.medium,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: responsiveWidth(100),
    height: responsiveWidth(8),
    width: responsiveWidth(18),
    justifyContent: "center",
  },
  coinText: {
    color: COLORS.white,
    fontSize: responsiveFontSize(2),
    marginLeft: 4,
    fontFamily: FONTS.primary,
  },
  coinIcon: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileSection: {
    alignItems: "center",
    marginVertical: responsiveWidth(6),
  },
  profileImageContainer: {
    position: "relative",
  },
  profileImage: {
    width: responsiveWidth(30),
    height: responsiveWidth(30),
    borderRadius: responsiveWidth(100),
    // borderWidth: 3,
    // borderColor: COLORS.accent,
    backgroundColor: "#4C7CBE",
  },
  levelBadge: {
    position: "absolute",
    top: -10,
    right: 0,
    backgroundColor: COLORS.accent,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: DIMENSIONS.borderRadius.small,
  },
  levelText: {
    color: "black",
    fontSize: responsiveFontSize(1.2),
    fontFamily: FONTS.MontserratBold,
  },
  userInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    width: "100%",
    paddingHorizontal: DIMENSIONS.padding.medium,
  },
  leftInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  onlineIndicator: {
    width: 10,
    height: 10,
    backgroundColor: COLORS.success,
    borderRadius: 5,
    marginLeft: 10,
  },
  greeting: {
    color: COLORS.white,
    fontSize: responsiveFontSize(3),
    fontFamily: "ClashDisplay",
  },
  level: {
    color: COLORS.text.accent,
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.bodyBold,
  },
  progressContainer: {
    paddingHorizontal: responsiveWidth(4),
    marginTop: responsiveWidth(2),
  },
  progressBar: {
    height: 10,
    backgroundColor: COLORS.progress.background,
    borderRadius: 3,
  },
  progressFill: {
    height: "100%",
    backgroundColor: COLORS.progress.fill,
    borderRadius: 3,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: DIMENSIONS.padding.medium,
    marginVertical: 10,
  },
  statItem: {
    alignItems: "center",
  },
  statNumber: {
    color: COLORS.accent,
    fontSize: responsiveFontSize(2.5),
    fontFamily: FONTS.MontserratBold,
  },
  statLabel: {
    color: COLORS.white,
    fontSize: responsiveFontSize(1.4),
    fontFamily: FONTS.MontserratSemiBold,
  },
  charactersContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "flex-end",
    marginTop: responsiveWidth(10),
  },

  characterImage: {
    width: responsiveWidth(80),
    height: responsiveWidth(50),
  },

  battleButton: {
    // backgroundColor: COLORS.primary,
    // marginHorizontal: DIMENSIONS.padding.large,
    // paddingVertical: 8,
    // borderRadius: 25,
    // borderWidth: 1,
    // borderColor: 'rgba(255,255,255,0.3)',
    // flexDirection: 'row',
    // justifyContent: 'center',
    // margin: 0,
  },
  battleButtonText: {
    color: COLORS.white,
    fontSize: responsiveFontSize(2.5),
    fontFamily: FONTS.bodySemiBold,
  },

  solidHeader: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 15,
  },

  iconButton: {
    backgroundColor: "#114B98",
    padding: 8,
    borderRadius: 20,
    marginLeft: 10,
  },

  yourBattle: {
    backgroundColor: COLORS.secondary,
    borderWidth: 1,
    borderColor: "#10EE4B",
    flexDirection: "row",
    justifyContent: "center",
    width: responsiveWidth(38),
    alignItems: "center",
    marginHorizontal: "auto",
    borderRadius: responsiveWidth(3),
    paddingVertical: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(4),
    marginTop: responsiveWidth(2),
  },

  battleText: { color: "#fff", fontSize: responsiveFontSize(1.8), fontFamily: FONTS.MontserratSemiBold },
});
