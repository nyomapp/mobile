import React, { useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import { responsiveFontSize, responsiveHeight, responsiveWidth } from 'react-native-responsive-dimensions';

const { width } = Dimensions.get('window');

interface TimeRangePickerProps {
  label: string;
  initialHour?: number;
  isPM?: boolean;
  onTimeChange?: (hour: number) => void;
}

export const TimeRangePicker: React.FC<TimeRangePickerProps> = ({
  label,
  initialHour = 9,
  isPM = false,
  onTimeChange
}) => {
  const [selectedHour, setSelectedHour] = useState(initialHour);
  const scrollViewRef = useRef<ScrollView>(null);

  const hours = isPM ? [4, 5, 6, 7, 8] : [6, 7, 8, 9, 10];

  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / responsiveWidth(22));
    const hour = hours[Math.min(Math.max(index, 0), hours.length - 1)];
    if (hour !== selectedHour) {
      setSelectedHour(hour);
      onTimeChange?.(hour);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollViewRef}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        onMomentumScrollEnd={handleScroll}
        snapToInterval={responsiveWidth(22)}
        decelerationRate="fast"
      >
        {hours.map((hour, index) => {
          const isSelected = hour === selectedHour;
          return (
            <View key={index} style={styles.hourContainer}>
              <Text style={[styles.hourText, isSelected && styles.selectedHourText]}>
                {hour} {isPM ? 'PM' : 'AM'}
              </Text>
              <View style={styles.ticksContainer}>
                {[0, 1, 2, 3, 4].map((i) => (
                  <View
                    key={i}
                    style={[
                      styles.tick,
                      i === 2 && styles.centerTick,
                      isSelected && i === 2 && styles.selectedTick
                    ]}
                  />
                ))}
              </View>
            </View>
          );
        })}
      </ScrollView>
      
      <View style={[styles.labelContainer, isPM ? styles.stopTimeLabel : styles.startTimeLabel]}>
        <Text style={styles.labelText}>{label}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: responsiveHeight(2),
    // backgroundColor: '#ff0',
    // height: 'auto'
  },
  scrollContent: {
    paddingHorizontal: width / 2 - responsiveWidth(11),
  },
  hourContainer: {
    width: responsiveWidth(22),
    alignItems: 'center',
  },
  hourText: {
    fontSize: responsiveFontSize(2),
    color: '#B8C5D6',
    fontWeight: '600',
    marginBottom: responsiveHeight(1.5),
  },
  selectedHourText: {
    color: '#2D3E50',
    fontSize: responsiveFontSize(2.5),
    fontWeight: '700',
  },
  ticksContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    height: responsiveHeight(5),
    alignItems: 'flex-end',
  },
  tick: {
    width: 2,
    height: responsiveHeight(2.5),
    backgroundColor: '#D1DBE8',
  },
  centerTick: {
    height: responsiveHeight(3.5),
    backgroundColor: '#B8C5D6',
  },
  selectedTick: {
    backgroundColor: '#2D3E50',
    height: responsiveHeight(5),
    width: 3,
  },
  labelContainer: {
    alignSelf: 'center',
    paddingHorizontal: responsiveWidth(10),
    paddingVertical: responsiveHeight(1.5),
    borderRadius: 30,
    marginTop: responsiveHeight(2.5),
  },
  startTimeLabel: {
    backgroundColor: '#C8E6C9',
  },
  stopTimeLabel: {
    backgroundColor: '#FFCDD2',
  },
  labelText: {
    fontSize: responsiveFontSize(2),
    fontWeight: '600',
    color: '#2D3E50',
  },
});
