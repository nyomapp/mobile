import { StyleSheet } from "react-native";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";
import { COLORS } from "../constants";
import { FONTS } from "../constants/fonts";
export const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: responsiveWidth(2),
  },
  section: {
    marginBottom: responsiveWidth(10),

  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.black,
    paddingBottom: responsiveWidth(2.5),
    marginBottom: responsiveWidth(4),
  },
  sectionTitle: {
    fontSize: responsiveFontSize(3),
    fontFamily: FONTS.YellixThin,
    color: COLORS.black,
    // fontWeight: "600",
  },
  editLink: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.Yellix,
    color: COLORS.primaryBlue,
  },
  detailRow: {
    flexDirection: "row",
    gap:5,
    alignItems: "center",
    paddingVertical: responsiveWidth(3),
  },
  detailRowSpaced: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: responsiveWidth(3),
    paddingRight:responsiveWidth(1),
  },
  detailLabel: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.YellixMedium,
  
    
    color:"#646566",
    // flex: 1,
  },
  detailValue: {
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.YellixThin,
    color: "#646566",
    textAlign: "right",
    // flex: 1,
  },
  documentItem: {
    marginVertical: responsiveWidth(4),
  },
  documentTitle: {
    fontSize: responsiveFontSize(2.5),
    fontFamily: FONTS.Yellix,
    color:"#646566",
    marginBottom: responsiveWidth(5),
  },
   documentPreviewTitle: {
    fontSize: responsiveFontSize(1.9),
    fontFamily: FONTS.YellixThin,
    color: COLORS.black,
    flex: 1,
  },
  documentImageContainer: {
    // alignItems: "center",
  },
  documentImage: {
    width: responsiveWidth(80),
    height: responsiveWidth(50),
    borderRadius: responsiveWidth(2),
    resizeMode: "contain",
  },
  placeholderImage: {
    width: responsiveWidth(80),
    height: responsiveWidth(50),
    backgroundColor: "#F8F9FA",
    borderRadius: responsiveWidth(2),
    borderWidth: 1,
    borderColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    padding: responsiveWidth(3),
  },
  placeholderContent: {
    width: "100%",
    height: "100%",
  },
  placeholderHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: responsiveWidth(2),
  },
  placeholderFlag: {
    width: responsiveWidth(8),
    height: responsiveWidth(5),
    backgroundColor: "#FF9500",
    marginRight: responsiveWidth(2),
    borderRadius: 2,
  },
  placeholderText: {
    fontSize: responsiveFontSize(1.2),
    fontFamily: FONTS.Yellix,
    color: "#374151",
    fontWeight: "600",
  },
  placeholderBody: {
    flexDirection: "row",
    flex: 1,
    marginBottom: responsiveWidth(2),
  },
  placeholderPhoto: {
    width: responsiveWidth(15),
    height: responsiveWidth(18),
    backgroundColor: "#D1D5DB",
    marginRight: responsiveWidth(3),
    borderRadius: responsiveWidth(1),
  },
  placeholderInfo: {
    flex: 1,
    justifyContent: "center",
  },
  placeholderLine: {
    height: 2,
    backgroundColor: "#D1D5DB",
    marginBottom: responsiveWidth(2),
    width: "80%",
  },
  placeholderLineShort: {
    height: 2,
    backgroundColor: "#D1D5DB",
    width: "60%",
  },
  placeholderQR: {
    width: responsiveWidth(8),
    height: responsiveWidth(8),
    backgroundColor: "#D1D5DB",
    alignSelf: "flex-end",
  },
  amountInputBox: {
  backgroundColor: COLORS.white,
  borderRadius: responsiveWidth(2),
  paddingHorizontal: responsiveWidth(3),
  paddingVertical: responsiveWidth(2.5),
  minWidth: responsiveWidth(35),
  borderWidth: 1,
  borderColor: "#E2E2E2",
  // shadowColor: COLORS.black,
    // shadowOffset: {
    //   width: 0,
    //   height: 1,
    // },
    // shadowOpacity: 0.1,
    // shadowRadius: 3,
    // elevation: 2,
},
amountPlaceholder: {
  fontSize: responsiveFontSize(1.6),
  fontFamily: FONTS.Yellix,
  color: "#958c8c",
},
  documentCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: responsiveWidth(1.5),
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
  documentRightButtons:{
    flexDirection:"row",
    alignItems:"center",
    gap:responsiveWidth(6),
  }
});
