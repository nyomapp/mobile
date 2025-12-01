import { StyleSheet } from "react-native";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";
import { COLORS } from "../../constants";
import { FONTS } from "../../constants/fonts";
export const styles = StyleSheet.create({

  dropdownOptions: {
    backgroundColor: COLORS.white,
    borderRadius: responsiveWidth(2),
    marginTop: -responsiveWidth(4),
    marginBottom: responsiveWidth(4),
    borderWidth: 1,
    borderColor: "#E9ECEF",
    borderTopWidth: 0,
    borderTopLeftRadius: 0,
    borderTopRightRadius: 0,
  },
  dropdownOption: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(3),
    borderBottomWidth: 1,
    borderBottomColor: "#E9ECEF",
  },
  dropdownOptionText: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.Yellix,
    color: COLORS.black,
  },
});