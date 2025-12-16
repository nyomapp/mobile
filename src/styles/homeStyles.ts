import { StyleSheet } from "react-native";
import {
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { COLORS, FONTS } from "../constants";
export const styles = StyleSheet.create({
  UserStyle:{
    fontSize: responsiveFontSize(3),
    fontWeight:700,
    color: COLORS.primaryBlue,
    fontFamily: FONTS.Yellix,
  },
  UserDealerStyle:{
    fontSize: responsiveFontSize(2.2),
    fontFamily:FONTS.Yellix
  },
  headingText: {
    fontSize: responsiveFontSize(3.5),
    fontFamily: FONTS.Yellix,
    color: COLORS.primaryBlue,
    lineHeight: responsiveFontSize(4),
    flexDirection:"row",
    gap: responsiveWidth(2),
  },
  headingContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: responsiveWidth(6),
    paddingTop: responsiveWidth(4),
  },
  headingTextContainer: {
    flex: 1,
    flexDirection: "column",
    flexWrap: "wrap",
  },
  deliveryCard: {
    marginBottom: responsiveWidth(6),
  },
  deliveryHeader: {
    marginBottom: responsiveWidth(4),
  },
  deliveryTitle: {
    backgroundColor: COLORS.primaryBlue,
    color: "white",
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.Yellix,
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(1.5),
    borderRadius: responsiveWidth(2),
    alignSelf: "flex-start",
  },
  legendContainer: {
    flexDirection: "row",
    marginBottom: responsiveWidth(3),
    gap: responsiveWidth(6),
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: responsiveWidth(2),
  },
  legendText: {
    fontSize: responsiveFontSize(1.6),
    color: "#666",
    fontFamily: FONTS.MontserratRegular,
  },
  statIcon: {
    marginBottom: responsiveWidth(2),
  },
  statLabel: {
    fontSize: responsiveFontSize(1.8),
    color: COLORS.white,
    fontFamily: FONTS.MontserratRegular,
    marginBottom: responsiveWidth(2),
    lineHeight: responsiveFontSize(2),
  },
  statValue: {
    fontSize: responsiveFontSize(2.6),
    color: COLORS.white,
    fontFamily: FONTS.YellixMedium,
    // fontWeight: "600",
  },
  chartContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: responsiveWidth(3),
    marginBottom: responsiveWidth(3),
  },
  radialChartContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  radialChart: {
    alignSelf: "center",
  },
  img: {
    width: 35,
    height: 35,
    // marginRight: responsiveWidth(1),
  },
  statCardHeader: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsiveWidth(2),
  },
  gradientCard: {
    backgroundColor: "transparent",
  },
});
