import { StyleSheet } from "react-native";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";
import { COLORS } from "../../constants";
import { FONTS } from "../../constants/fonts";
export const styles = StyleSheet.create({
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.white,
    borderRadius: responsiveWidth(4),
    width: '85%',
    maxHeight: '70%',
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modalTitle: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: FONTS.YellixThin,
    color: COLORS.black,
    fontWeight: '600',
  },
  closeButton: {
    padding: responsiveWidth(1),
  },
  modalScrollView: {
    maxHeight: responsiveWidth(100),
  },
  modalOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedOption: {
    backgroundColor: '#F0F9FF',
  },
  modalOptionText: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.YellixThin,
    color: '#333',
  },
  selectedOptionText: {
    color: COLORS.primaryBlue,
    fontWeight: '600',
  },
  
  // Legacy dropdown styles (keeping for reference)
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
    fontFamily: FONTS.YellixThin,
    color: '#333'
  },
    radioRow: {
    flexDirection: "row",
    gap: responsiveWidth(5),
    paddingHorizontal: responsiveWidth(2),
  },
  radioContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: responsiveWidth(3),
  },

  radioButton: {
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    borderRadius: responsiveWidth(2.5),
    borderWidth: 2,
    borderColor: COLORS.primaryBlue,
    alignItems: "center",
    justifyContent: "center",
    marginRight: responsiveWidth(3),
  },

  radioSelected: {
    width: responsiveWidth(2.5),
    height: responsiveWidth(2.5),
    borderRadius: responsiveWidth(1.25),
    backgroundColor: COLORS.primaryBlue,
  },

  radioText: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: FONTS.YellixThin,
    color: COLORS.black,
  },
});