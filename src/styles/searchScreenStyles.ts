import { StyleSheet } from "react-native";
import {
    responsiveFontSize,
    responsiveWidth,
} from "react-native-responsive-dimensions";
import { COLORS } from "../constants";
import { FONTS } from "../constants/fonts";
export const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    // paddingHorizontal: responsiveWidth(10),
    paddingVertical: responsiveWidth(6),
  },
  filterButton: {
    backgroundColor: COLORS.white,
    borderRadius: responsiveWidth(5),
    padding: responsiveWidth(2),
    minWidth: responsiveWidth(8),
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3,
    elevation: 2,
  },
  filterIcon: {
    fontSize: responsiveFontSize(2),
    backgroundColor: COLORS.white,
  },
  tabContainer: {
    flexDirection: "row",
    // marginHorizontal: responsiveWidth(4),
    marginBottom: responsiveWidth(4),
    backgroundColor: "#F3F4F6",
    borderRadius: responsiveWidth(6),
    padding: responsiveWidth(1),
  },
  tab: {
    flex: 1,
    paddingVertical: responsiveWidth(2),
    // paddingHorizontal: responsiveWidth(4),
    borderRadius: responsiveWidth(5),
    alignItems: "center",
  },
  activeTab: {
    backgroundColor: COLORS.primaryBlue,
  },
  tabText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.Yellix,
    color: "#6B7280",
  },
  activeTabText: {
    color: COLORS.white,
  },
  listContainer: {
    // paddingHorizontal: responsiveWidth(4),
    paddingBottom: responsiveWidth(4),
  },
  customerCard: {
    backgroundColor: COLORS.white,
    borderRadius: responsiveWidth(3),
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
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsiveWidth(3),
    borderBottomColor: COLORS.black,
    borderBottomWidth: 0.5,
    paddingBottom: responsiveWidth(2),
  },
  customerName: {
    fontSize: responsiveFontSize(2.2),
    fontFamily: FONTS.Yellix,
    color: COLORS.black,
    // fontWeight: "600",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: responsiveWidth(2),
  },
  customerDetails: {
    gap: responsiveWidth(2),
  },
  detailText: {
    flexDirection: "row",
  },
  detailLabel: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.Yellix,
    color: COLORS.black,
  },
  detailValue: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.Yellix,
    color: "#6B7280",
  },

  // Search Bar Styles
  searchContainer: {
    // paddingHorizontal: responsiveWidth(4),
    marginBottom: responsiveWidth(10),
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(3),
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.Yellix,
    color: COLORS.black,
    paddingRight: responsiveWidth(2),
    borderWidth: 0,
    borderBlockColor: "transparent",
    borderColor: "transparent",
  },
  searchButton: {
    padding: responsiveWidth(1),
  },
});
