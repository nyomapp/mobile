import { StyleSheet } from "react-native";
import { responsiveFontSize } from "react-native-responsive-dimensions";
import { FONTS } from "../constants";
export const styles = StyleSheet.create({
headerStyle:{
    fontFamily:FONTS.Yellix,
    fontSize:responsiveFontSize(3.5),
}
  
});
