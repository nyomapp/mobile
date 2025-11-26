import { Dimensions, StyleSheet } from 'react-native';
import { COLORS, DIMENSIONS, FONTS } from '../constants';
const { width, height } = Dimensions.get("window");

import {
  responsiveFontSize,
  responsiveWidth
} from "react-native-responsive-dimensions";


export const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 28,
    fontFamily: FONTS.primary,
  },
  button: {
    backgroundColor: COLORS.button.primary,
    borderRadius: DIMENSIONS.borderRadius.large,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: DIMENSIONS.padding.large,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 22,
    fontFamily: FONTS.MontserratSemiBold,
  },
  input: {
    backgroundColor: COLORS.white,
    borderRadius: responsiveWidth(100),
    paddingHorizontal: responsiveWidth(6),
    paddingVertical: responsiveWidth(4),
    fontSize: responsiveFontSize(1.8),
    marginBottom: responsiveWidth(4),
    color: '#333',
  },
  iconButton: {
    backgroundColor: COLORS.secondary,
    padding: 8,
    borderRadius: DIMENSIONS.borderRadius.medium,
    marginLeft: 10,
  },
  // Verified Screen Styles
  verifiedContainer: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  verifiedTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: COLORS.white,
    textAlign: "center",
    marginBottom: 20,
    fontFamily: FONTS.primary,
  },
  verifiedSubtitle: {
    fontSize: 16,
    color: COLORS.white,
    opacity: 0.8,
    textAlign: "center",
    marginBottom: 60,
    lineHeight: 22,
    paddingHorizontal: 20,
    fontFamily: FONTS.body,
  },
  verifiedImageContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  verifiedContinueButton: {
    backgroundColor: "transparent",
    borderRadius: 30,
    paddingVertical: 16,
    paddingHorizontal: 60,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#BEBFEE",
    // width: "100%",
    marginTop: 20,
  },


  buttonBg: {
    width: responsiveWidth(100),
    height: responsiveWidth(12),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 0,
  },

  infoLabel: {
    color: "white",
    fontSize: responsiveFontSize(2),
    fontFamily: FONTS.MontserratBold
  },
  infoValue: {
    color: "white",
    fontSize: responsiveFontSize(2.2),
    fontFamily: FONTS.primary
  },
  coinValue: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#114B98",
    borderRadius: responsiveWidth(100),
    height: responsiveWidth(10),
    width: responsiveWidth(26),
    justifyContent: "space-between",
    paddingHorizontal: responsiveWidth(2),
    fontFamily: FONTS.primary
  },
  coinIcon: {
    fontSize: 16,
    marginRight: 5,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: responsiveWidth(4),
  },
  startButton: {
    backgroundColor: "white",
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  startButtonText: {
    color: COLORS.primary,
    fontSize: 20,
    fontFamily: FONTS.MontserratSemiBold,
  },
  sliderContainer: {
    // marginVertical: 20,
  },
  sliderLabel: {
    color: "white",
    fontSize: responsiveWidth(3.5),
    textAlign: "center",
    marginBottom: responsiveWidth(2),
    fontFamily: FONTS.MontserratRegular
  },
  slider: {
    flexDirection: "row",
    marginHorizontal: responsiveWidth(2),
    backgroundColor: "#114B98",
    padding: responsiveWidth(1),
    borderRadius: responsiveWidth(100),
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: responsiveWidth(2),
  },
  sliderTrack: {
    height: responsiveWidth(1.4),
    backgroundColor: "#6488E9",
    borderRadius: responsiveWidth(100),
    position: "relative",
    width: responsiveWidth(60),
  },
  sliderFill: {
    height: responsiveWidth(1.4),
    backgroundColor: "#6488E9",
    borderRadius: responsiveWidth(100),
  },
  sliderThumb: {
    position: "absolute",
    right: "90%",
    top: responsiveWidth(-0.8),
    width: responsiveWidth(3),
    height: responsiveWidth(3),
    backgroundColor: "#C6E4FF",
    borderRadius: responsiveWidth(0.8),
  },
  sliderLabels: {
    flexDirection: "row",
    justifyContent: "space-between",
    // marginTop: 5,
    // backgroundColor: "#ff0"
  },
  sliderMin: {
    color: "#ffd700",
    fontSize: responsiveFontSize(1.4),
    fontFamily: FONTS.MontserratBold
  },
  sliderMax: {
    color: "#ffd700",
    fontSize: responsiveFontSize(1.4),
    fontFamily: FONTS.MontserratBold
  },
  solidHeader: {
    backgroundColor: "#131465",
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 15,
    marginBottom: 30
  },
  btnCircle: {
    backgroundColor: "#114B98",
    width: 38,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 50,
  },

  // Modal styles
  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    width: "100%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
  },
  timeSelector: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  timeOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginVertical: 5,
    borderRadius: 25,
    // backgroundColor: "#f0f0f0",
    width: "100%",
    alignItems: "center",
  },
  selectedTimeOption: {
    backgroundColor: "#1a237e",
    width: "100%",
  },
  timeText: {
    fontSize: 16,
    color: "#666",
  },
  selectedTimeText: {
    color: "white",
    fontWeight: "bold",
  },
  minText: {
    fontSize: 16,
    color: "#666",
    marginLeft: 10,
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 30
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    marginRight: 10,
  },
  okButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    marginLeft: 10,
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#666",
  },
  okButtonText: {
    fontSize: 16,
    color: "#1a237e",
    fontWeight: "bold",
  },
  timeSelect: {
    flexDirection: "row",
    alignItems: "center",
    // backgroundColor: "#114B98",
    borderRadius: 20,
    height: 34,
    width: 94,
    justifyContent: "space-between",
    paddingHorizontal: 10
  },
  textCenter: {
    justifyContent: "center",
  },
  coinContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: responsiveWidth(100),
    height: responsiveWidth(8),
    width: responsiveWidth(16),
    justifyContent: "center",
  },
  coinText: {
    color: "white",
    // fontWeight: "bold",
    fontFamily: FONTS.primary,
    marginLeft: responsiveWidth(1),
    fontSize: responsiveFontSize(1.8)
  },
  headerCoinIcon: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    // marginRight: responsiveWidth(1.8)
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  scrollContent: {
    paddingBottom: 50, // Add bottom padding to prevent cutoff
    flexGrow: 1,
  },
  characterContainer: {
    alignItems: "center",
  },
  characterImage: {
    width: responsiveWidth(66),
    height: responsiveWidth(66),
    // borderRadius: 0,
    marginBottom: responsiveWidth(-18),
    // marginBottom: -100
    marginTop: responsiveWidth(2)
  },
  battleInfo: {
    backgroundColor: "#131465",
    borderRadius: responsiveWidth(4),
    padding: responsiveWidth(4),
    // marginBottom: responsiveWidth(0),
    // width: "100%",
  },


  opponentSection: {
    alignItems: "center",
    backgroundColor: COLORS.secondary,
    borderRadius: responsiveWidth(100),
    padding: responsiveWidth(2),
    marginTop: responsiveWidth(4)
  },
  opponentTitle: {
    color: "white",
    fontSize: responsiveFontSize(1.4),
    fontFamily: FONTS.MontserratSemiBold,
    marginBottom: responsiveWidth(2)
  },
  toggleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  toggleOption: {
    paddingHorizontal: responsiveWidth(4),
    paddingVertical: responsiveWidth(2),
  },
  toggleText: {
    color: "white",
    fontSize: responsiveFontSize(1.6),
    fontFamily: FONTS.MontserratSemiBold
  },
  toggleSwitch: {
    width: responsiveWidth(14),
    height: responsiveWidth(8),
    backgroundColor: "#FFB200",
    borderRadius: responsiveWidth(100),
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: responsiveWidth(1),
  },
  toggleActive: {
    width: responsiveWidth(6),
    height: responsiveWidth(6),
    backgroundColor: "#fff",
    borderRadius: responsiveWidth(100),
  },
  characterContainerPvp: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: responsiveWidth(4),
  },
  levelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: responsiveWidth(4),
  },

  levelText: {
    color: "black",
    fontWeight: "bold",
    fontSize: responsiveFontSize(1.6),
    textAlign: "center"
  },
  leaderboardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.2)",
    marginBottom: 10,
  },
  headerColumn: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 14,
    fontWeight: "600",
    flex: 1,
    textAlign: "center",
  },
  leaderboardList: {
    flex: 1,
  },
  leaderboardItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  playerInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  playerName: {
    color: "#131465",
    fontSize: 14,
    fontFamily: FONTS.body,
  },
  playerLevel: {
    color: "#131465",
    fontSize: 14,
    fontFamily: FONTS.body,
    flex: 1,
    textAlign: "center",
  },
  playerBattles: {
    color: "#131465",
    fontSize: 14,
    fontFamily: FONTS.body,
    flex: 1,
    textAlign: "center",
  },
  playerWinRate: {
    color: "#131465",
    fontSize: 14,
    fontFamily: FONTS.body,
    flex: 1,
    textAlign: "center",
  },

  tableHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 15,
    // borderBottomWidth: 1,
    // borderBottomColor: "rgba(0,0,0,0.1)",
    marginBottom: 10,
    backgroundColor: "#E4E4FF"
  },
  tableColumn: {
    color: "#131465",
    fontSize: 13,
    fontFamily: FONTS.MontserratSemiBold,
    flex: 1,
    textAlign: "center",
  },
  tableItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  tableInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    textAlign: "center",
  },

  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  radioCircle: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#2e64e5',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  selectedRb: {
    backgroundColor: '#2e64e5',
  },
  radioText: {
    fontSize: 16,
    color: '#000',
  },
  tabText: {
    color: '#666',
    fontSize: 14,
    // fontWeight: '500',
    fontFamily: FONTS.MontserratSemiBold,
  },
  searchInput: {
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 20,
    // paddingVertical: 12,
    fontSize: 13,
    color: '#333',
    fontFamily: FONTS.MontserratSemiBold,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 20,
    // fontWeight: '600',
    fontFamily: FONTS.MontserratSemiBold,
  },
  headerText: {
    flex: 1,
    fontSize: 14,
    fontFamily: FONTS.MontserratSemiBold,
    color: '#131465',
    textAlign: 'center',
  },
  //   playerName: {
  //   fontSize: 14,
  //   color: '#333',
  //   fontFamily: FONTS.MontserratSemiBold,
  // },
  // playerLevel: {
  //   flex: 1,
  //   fontSize: 14,
  //   color: '#333',
  //   textAlign: 'center',
  //   fontFamily: FONTS.MontserratSemiBold,
  // },
  // playerWinRate: {
  //   flex: 1,
  //   fontSize: 14,
  //   color: '#333',
  //   textAlign: 'center',
  //   fontFamily: FONTS.MontserratSemiBold,
  // },

  Obscreentitle: {
    fontFamily: FONTS.primary,
    fontSize: responsiveFontSize(6),
    color: '#fff'
  },
  ObscreenSubtitle: {
    fontFamily: FONTS.primary,
    fontSize: responsiveFontSize(4),
    color: '#FCB104'
  },
  ObscreenDec: {
    fontFamily: FONTS.MontserratRegular,
    fontSize: responsiveFontSize(2),
    color: '#fff',
    // marginTop: 10,
    // marginBottom: 30,
    // width: width * 0.60,
    textAlign: 'center',
    marginVertical: responsiveWidth(6),
    width: responsiveWidth(90)
  },
  noRecordsContainer: {
    backgroundColor: "#131465",
    padding: 20,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  noRecordsText: {
    color: "#8095AF",
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.body,
  },

});