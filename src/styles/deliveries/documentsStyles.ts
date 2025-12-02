import { StyleSheet } from "react-native";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";
import { COLORS } from "../../constants";
import { FONTS } from "../../constants/fonts";
export const styles = StyleSheet.create({
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: responsiveWidth(2),
  },
  documentUploadedCard: {
    backgroundColor: "#89898926",
  },
  documentLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: responsiveWidth(10),
    height: responsiveWidth(10),
    borderRadius: responsiveWidth(5),
    justifyContent: "center",
    alignItems: "center",
    marginRight: responsiveWidth(3),
  },
  documentTitle: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.YellixThin,
    color: COLORS.black,
    flex: 1,
  },
});