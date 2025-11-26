import { StyleSheet } from 'react-native';
import { COLORS, DIMENSIONS, FONTS } from '../constants';

const AVATAR_SIZE = 80;
const BORDER_WIDTH = 4;

import {
  responsiveFontSize,
  responsiveWidth
} from "react-native-responsive-dimensions";

export const profileStyles = StyleSheet.create({
  solidHeader: {
    backgroundColor: COLORS.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    padding: 15,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: DIMENSIONS.padding.medium,
    paddingTop: 50,
    paddingBottom: DIMENSIONS.padding.medium,
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: FONTS.primary,
  },
  headerRight: {
    flexDirection: 'row',
  },
  iconButton: {
    backgroundColor: COLORS.secondary,
    padding: 8,
    borderRadius: DIMENSIONS.borderRadius.medium,
    marginLeft: DIMENSIONS.padding.small,
  },
  content: {
    flex: 1,
    paddingHorizontal: DIMENSIONS.padding.medium,
  },
  profileSection: {
    marginBottom: 15,
    marginTop: DIMENSIONS.padding.medium,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    gap: DIMENSIONS.padding.medium,
  },
  avatarWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressCircle: {
    width: AVATAR_SIZE + BORDER_WIDTH * 2,
    height: AVATAR_SIZE + BORDER_WIDTH * 2,
    borderRadius: (AVATAR_SIZE + BORDER_WIDTH * 2) / 2,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
    borderWidth: BORDER_WIDTH,
    borderColor: COLORS.accent,
  },
  profileImage: {
    width: 96,
    height: 96,
    borderRadius: 50,
    marginBottom: 15,
    backgroundColor: '#4C7CBE',
  },
  profileName: {
    color: COLORS.white,
    fontSize: 20,
    fontWeight: '500',
    marginBottom: DIMENSIONS.padding.small,
    fontFamily: FONTS.primary,
  },
  levelContainer: {
    alignItems: 'flex-start',
    backgroundColor: '#5C5EE7',
    borderRadius: DIMENSIONS.borderRadius.medium,
    padding: 16,
    width: 274,
    marginBottom: 30,
  },
  levelText: {
    color: COLORS.accent,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
  },
  memberSince: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: '400',
  },
  memberSinceDate: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  statCard: {
    backgroundColor: COLORS.primary,
    padding: DIMENSIONS.padding.medium,
    borderRadius: 24,
    width: '48%',
  },
  statLabel: {
    color: COLORS.white,
    fontSize: responsiveFontSize(1.8),
    fontWeight: '600',
    marginBottom: DIMENSIONS.padding.small,
  },
  statAmount: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  statValue: {
    color: COLORS.white,
    fontSize: responsiveFontSize(2.4),
    // fontWeight: '600',
    fontFamily: FONTS.MontserratBold,
    marginLeft: 5,
  },
  statPercentage: {
    color: '#10EE4B',
    fontSize: 12,
    fontWeight: '500',
    backgroundColor: COLORS.secondary,
    width: 50,
    height: 21,
    borderRadius: 11,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 6,
  },
  statPercentageNegative: {
    color: '#ff4757',
    fontSize: 12,
    fontWeight: '500',
    backgroundColor: COLORS.secondary,
    width: 50,
    height: 21,
    borderRadius: 11,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 6,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 15,
  },
  gameStatsContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.primary,
    borderRadius: responsiveWidth(4),
    paddingVertical: 30,
    paddingHorizontal: DIMENSIONS.padding.medium,
    justifyContent: 'space-between',
  },
  gameStatItem: {
    flex: 1,
    alignItems: 'center',
    borderRightWidth: 2,
    borderRightColor: '#47489B',
    borderStyle: 'solid',
  },
  lastGameStatItem: {
    borderRightWidth: 0,
  },
  gameStatNumber: {
    color: COLORS.accent,
    fontSize: responsiveFontSize(2.5),
    // fontWeight: '700',
    marginBottom: responsiveWidth(1),
    fontFamily: FONTS.MontserratBold
  },
  gameStatLabel: {
    color: COLORS.white,
    fontSize: responsiveFontSize(1.4),
    // fontWeight: '500',
    fontFamily: FONTS.MontserratSemiBold
  },
  achievementsContainer: {
    flexDirection: 'row',
    // flexWrap: 'wrap',
    // justifyContent: 'space-between',
  },
  achievementItem: {
    // width: '12%',
    width: responsiveWidth(21),
    marginHorizontal:  responsiveWidth(1)
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginBottom: 15,
    // backgroundColor: '#5C5EE7',
    // borderRadius: responsiveWidth(100),
    // padding:  responsiveWidth(12),
    // height: 100,
    // height: responsiveWidth(25),
  },
  achievementIcon: {
    width: responsiveWidth(20),
    height:  responsiveWidth(20),
    backgroundColor: '#5C5EE7',
    borderRadius:  responsiveWidth(100),
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom:  responsiveWidth(3),
  },
  achievementEmoji: {
    fontSize: 34,
  },
  achievementTitle: {
    color: COLORS.white,
    fontSize: responsiveFontSize(1.2),
    textAlign: 'center',
    // fontWeight: '500',
    fontFamily: FONTS.MontserratSemiBold
  },

  achievementBadge:{
    width:responsiveWidth(10),
    height:responsiveWidth(10),
  },


  // Edit Profile
  settingsGroup: {
    backgroundColor: COLORS.primary,
    borderRadius: 15,
    marginBottom: DIMENSIONS.padding.medium,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    minHeight: 64,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    color: COLORS.white,
    fontSize: responsiveFontSize(2),
    marginLeft: 15,
    fontFamily: FONTS.body,
  },
  settingRight: {
    flexDirection: 'row',
    alignItems: 'center',
    color: '#8095AF',
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.MontserratSemiBold
  },
  settingValue: {
    color: '#8095AF',
    fontSize: responsiveFontSize(1.8),
    marginRight: 5,
    fontFamily: FONTS.MontserratSemiBold
  },
  forwardIcon: {
    color: '#8095AF',
    fontSize: 20,
  },

  editProfileSection: {
    flexDirection: 'column',
    alignItems: 'center',
    paddingVertical: 20
  },
  charactersImg: {
    backgroundColor: '#4c7cbe',
    borderRadius: 50,
    position: 'relative',
    // width: responsiveWidth(20),
    // height: responsiveWidth(20),
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginBottom: 15
  },
  avatarText: {
    fontSize: responsiveFontSize(1.8),
    fontFamily: FONTS.MontserratSemiBold,
    color: COLORS.white,
    marginTop: 10
  },
  editCircle: {
    position: 'absolute',
    bottom: -5,
    right: 0,
    backgroundColor: COLORS.accent,
    borderRadius: responsiveWidth(100),
    width: responsiveWidth(7),
    height: responsiveWidth(7),
    justifyContent: 'center',
    alignItems: 'center'
  },
  // deleteButton: {
  //   backgroundColor: 'transparent',
  //   marginHorizontal: 20,
  //   marginVertical: 30,
  //   paddingVertical: 15,
  //   borderRadius: 30,
  //   alignItems: 'center',
  //   borderWidth: 1,
  //   borderColor: COLORS.white,
  //   marginBottom: 60
  // },
  // deleteText: {
  //   color: 'white',
  //   fontSize: 18,
  //   fontFamily: FONTS.MontserratSemiBold,
  //   paddingLeft: 15,
  // },
  deleteAccount: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnCircle: {
    backgroundColor: COLORS.secondary,
    width: 38,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 50,
  },

});