import { StyleSheet } from "react-native";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";
import { COLORS } from "../../constants";
import { FONTS } from "../../constants/fonts";
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
    borderBottomColor:COLORS.black,
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
  uploadButton: {
    backgroundColor: COLORS.primaryBlue,
    borderRadius: responsiveWidth(2),
    paddingHorizontal: responsiveWidth(3),
    paddingVertical: responsiveWidth(1),
    flexDirection: "row",
    alignItems: "center",
    gap: responsiveWidth(1),
  },
  uploadButtonText: {
    fontSize: responsiveFontSize(1.6),
    fontFamily: FONTS.Yellix,
    color: COLORS.white,
  },
  uploadIcon: {
    // backgroundColor: "rgba(255,255,255,0.3)",
    borderRadius: responsiveWidth(3),
    width: responsiveWidth(5),
    height: responsiveWidth(5),
    alignItems: "center",
    justifyContent: "center",
  },
  uploadArrow: {
    fontSize: responsiveFontSize(1.4),
    color: COLORS.white,
    fontWeight: "bold",
  },
  moreButton: {
    backgroundColor: "#898989",
    borderRadius: responsiveWidth(4),
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    alignItems: "center",
    justifyContent: "center",
  },
  moreText: {
    fontSize: responsiveFontSize(2.5),
    color: "#6B7280",
    fontWeight: "bold",
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

  // Filter Modal Styles (Bottom sliding modal)
  filterModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  filterModalContent: {
    backgroundColor: COLORS.white,
    borderTopLeftRadius: responsiveWidth(6),
    borderTopRightRadius: responsiveWidth(6),
    paddingBottom: responsiveWidth(8),
    minHeight: '70%',
  },
  filterModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterModalTitle: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: FONTS.Yellix,
    color: COLORS.black,
    fontWeight: '600',
  },
  resetText: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.Yellix,
    color: COLORS.primaryBlue,
  },
  filterForm: {
    flex: 1,
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveWidth(6),
  },
  dropdownButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  // dropdownText: {
  //   fontSize: responsiveFontSize(1.8),
  //   fontFamily: FONTS.Yellix,
  //   color: "#9CA3AF",
  //   flex: 1,
  // },
  filterButtonContainer: {
    paddingHorizontal: responsiveWidth(5),
    paddingTop: responsiveWidth(4),
  },
  

  // Model Selection Modal Styles (Center modal)
  modelModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelModalContent: {
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
  modelModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: '#E9ECEF',
  },
  modelModalTitle: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: FONTS.Yellix,
    color: COLORS.black,
    fontWeight: '600',
  },
  closeButton: {
    padding: responsiveWidth(1),
  },
  modelScrollView: {
    maxHeight: responsiveWidth(100),
  },
  modelOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: responsiveWidth(5),
    paddingVertical: responsiveWidth(4),
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedModelOption: {
    backgroundColor: '#F0F9FF',
  },
  modelOptionText: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.Yellix,
    color: '#333',
  },
  selectedModelText: {
    color: COLORS.primaryBlue,
    fontWeight: '600',
  },
});