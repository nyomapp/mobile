import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { FONTS } from '../../constants/fonts';

export const FontTest = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.systemFont}>System Font Test</Text>
      <Text style={styles.clashFont}>ClashDisplay Font Test</Text>
      <Text style={styles.primaryFont}>Primary Font Test</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'rgba(255,255,255,0.1)',
    margin: 10,
    borderRadius: 10,
  },
  systemFont: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
    fontFamily: FONTS.system,
  },
  clashFont: {
    fontSize: 16,
    color: 'white',
    marginBottom: 10,
    fontFamily: 'ClashDisplay',
  },
  primaryFont: {
    fontSize: 16,
    color: 'white',
    fontFamily: FONTS.primary,
  },
});