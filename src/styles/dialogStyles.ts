import { Dimensions, StyleSheet } from "react-native";
import { COLORS, FONTS } from "../constants";

const { width, height } = Dimensions.get("window");

export const dialogStyles = StyleSheet.create({
  // Dialog css
  dialogOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  dialogContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 30,
    padding: 0,
    width: "90%",
    maxHeight: "80%",
    // margin: 60,
    marginTop: 60,
  },
  dialogContent: {
    padding: 20,
  },
  dialogTitle: {
    fontFamily: FONTS.MontserratSemiBold,
    fontSize: 18,
    color: COLORS.primary,
    textAlign: "center",
    paddingVertical: 20,
    borderColor: COLORS.primary,
    borderBottomWidth: 1,
  },
  dialogText: {
    fontFamily: FONTS.body,
    fontSize: 18,
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 20,
  },
  dialogSmallText: {
    fontFamily: FONTS.body,
    fontSize: 13,
    color: COLORS.primary,
    textAlign: "center",
  },

  warningImg: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  dialogButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 10,
    borderColor: COLORS.primary,
    borderTopWidth: 1,
    paddingTop: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderColor: COLORS.primary,
    borderRightWidth: 1,
  },
  okButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    fontSize: 16,
    color: "#A5A5A5",
    fontFamily: FONTS.MontserratSemiBold,
  },
  okButtonText: {
    fontSize: 16,
    color: COLORS.primary,
    fontFamily: FONTS.MontserratSemiBold,
  },

  languageSelector: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
  },
  languageOption: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginVertical: 5,
    borderRadius: 25,
    // backgroundColor: "#f0f0f0",
    width: "100%",
    alignItems: "center",
  },
  selectedLanguageOption: {
    backgroundColor: "#1a237e",
    width: "100%",
  },
  languageText: {
    fontSize: 16,
    color: "#666",
  },
  selectedLanguageText: {
    color: "white",
    fontWeight: "bold",
  },

  //

  timeSelector: {
    width: "100%",
    alignItems: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
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

  scrollView: {
    flexGrow: 0,
    maxHeight: width * 1,
    // backgroundColor: "lightcoral",
    textAlign: 'center'
  },
});
