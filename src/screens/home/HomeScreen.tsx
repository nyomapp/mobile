import {
  Dimensions,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuth } from "../../contexts/AuthContext";

import { SafeAreaView } from "react-native-safe-area-context";
import { allStyles } from "../../styles/global";

import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { COLORS } from "@/src/constants";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";

//import Svg, { Circle } from "react-native-svg";
import { styles } from "../../styles/homeStyles";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const { user, updateUser } = useAuth();
  //console.log("Current user:", user);

  // Radial chart data
  const chartData = [
    { name: "Total", value: 60, color: COLORS.primaryBlue },
    { name: "Active", value: 25, color: COLORS.secondaryBlue },
    { name: "Pending", value: 15, color: "#67E8F9" },
  ];

  // Calculate percentages and angles for radial chart
  const total = chartData.reduce((sum, item) => sum + item.value, 0);
  let cumulativeAngle = 0;
  const chartSize = 160;
  const strokeWidth = 35;
  const radius = (chartSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;

  const RadialChart = () => (
    <View style={styles.radialChartContainer}>
      {/* <Svg width={chartSize} height={chartSize} style={styles.radialChart}>
        {chartData.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (item.value / total) * 360;
          const strokeDasharray = `${
            (percentage / 100) * circumference
          } ${circumference}`;
          const strokeDashoffset = -((cumulativeAngle / 360) * circumference);

          cumulativeAngle += angle;

          return (
            <Circle
              key={index}
              cx={chartSize / 2}
              cy={chartSize / 2}
              r={radius}
              stroke={item.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              fill="transparent"
              strokeLinecap="butt"
              transform={`rotate(-90 ${chartSize / 2} ${chartSize / 2})`}
            />
          );
        })}
      </Svg> */}
    </View>
  );

  return (
    <SafeAreaView style={allStyles.safeArea} edges={["top"]}>
      <ScrollView
        style={allStyles.container}
        contentContainerStyle={allStyles.scrollContent}
      >
        {/* Header Section */}
        <View style={styles.headingContainer}>
          <View style={styles.headingTextContainer}>
            <View style={[styles.headingText]}>
              <Text style={styles.UserStyle}>Hello</Text>
             
              <Text style={styles.UserStyle}>{user?.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase() : ""}</Text>
            </View>
             {user?.mainDealerRef?.name && (
            <Text style={styles.UserDealerStyle}>{user?.mainDealerRef?.name}</Text>
            )}
          </View>
          <HeaderIcon />
        </View>

        {/* Delivery Card */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>Delivery</Text>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#1E3A8A" }]}
              />
              <Text style={styles.legendText}>Total</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#06B6D4" }]}
              />
              <Text style={styles.legendText}>Active</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#67E8F9" }]}
              />
              <Text style={styles.legendText}>Pending</Text>
            </View>
          </View>

          {/* Radial Chart */}
          <View style={styles.chartContainer}>
            <RadialChart />
          </View>
        </View>

        {/* Total Sales Section */}
        <Text style={allStyles.sectionHeader}>Total Sales</Text>
        <View style={allStyles.statsContainer}>
          <LinearGradient
            colors={["#183B64", "#3077CA",]}
            start={{ x: 0 , y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[allStyles.statCard, styles.gradientCard]}
          >
            <View style={styles.statCardHeader}>
              <Text style={styles.statLabel}>Total{"\n"}Deliveries</Text>
              <Image
                source={require("@/assets/icons/TotalDeliveriesIcon.png")}
                style={styles.img}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.statValue}>100</Text>
          </LinearGradient>

          <LinearGradient
            colors={["#183B64", "#3077CA",]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[allStyles.statCard, styles.gradientCard]}
          >
            <View style={styles.statCardHeader}>
              <Text style={styles.statLabel}>Average{"\n"}Discount</Text>
              <Image
                source={require("@/assets/icons/AverageDiscountIcon.png")}
                style={styles.img}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.statValue}>Rs 30,000</Text>
          </LinearGradient>

         <LinearGradient
            colors={["#183B64", "#3077CA",]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={[allStyles.statCard, styles.gradientCard]}
          >
            <View style={styles.statCardHeader}>
              <Text style={styles.statLabel}>Total{"\n"}Accessories</Text>
              <Image
                source={require("@/assets/icons/TotalAccessoriesIcon.png")}
                style={styles.img}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.statValue}>30</Text>
          </LinearGradient>

           <LinearGradient
            colors={["#183B64", "#3077CA",]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[allStyles.statCard, styles.gradientCard]}
          >
            <View style={styles.statCardHeader}>
              <Text style={styles.statLabel}>No. of{"\n"}Helmets</Text>
              <Image
                source={require("@/assets/icons/NoOfHelmetsIcon.png")}
                style={styles.img}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.statValue}>50</Text>
          </LinearGradient>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => router.push("/add-delivery")}
        style={allStyles.floatingButton}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}
