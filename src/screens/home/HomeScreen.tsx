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

import { getDashBoardData } from "@/src/api/dashBoard";
import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { COLORS } from "@/src/constants";
import { useDashBoard } from "@/src/contexts/DashBoardContext";
import { useDeliveryContext } from "@/src/contexts/DeliveryContext";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { PieChart } from "react-native-svg-charts";
import Toast from "react-native-toast-message";
import { styles } from "../../styles/homeStyles";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const { user, updateUser } = useAuth();
  const {
    dashBoardData,
    setDashBoardData,
    setTotalDeliveries,
    getTotalRevenue,
    addNotification,
    isLoading,
  } = useDashBoard();
  const {
    currentDelivery,
    resetCurrentDelivery,
    isEdit,
    deliveryId,
    resetDeliveryId,
    setIsEdit,
    resetIsEdit,
  } = useDeliveryContext();

  useFocusEffect(
    useCallback(() => {
      console.log("Home screen focused - fetching dashboard data");
      fetchDashBoardData();
    }, []),
  );

  const fetchDashBoardData = async () => {
    try {
      console.log("Fetching dashboard data...");
      const response = await getDashBoardData();
      console.log("Dashboard data fetched successfully:", response);
      setDashBoardData(response as any);
    } catch (error) {
      console.error("Dashboard fetch error:", error);
      Toast.show({
        type: "error",
        text1: "Dashboard Error",
        text2:
          (error as any).message ||
          "An error occurred while fetching dashboard data.",
      });
    }
  };

  // Chart data calculation
  const totalValue = (dashBoardData as any)?.pieChart?.total || 0;
  const activeValue = (dashBoardData as any)?.pieChart?.delivered || 0;
  const pendingValue = (dashBoardData as any)?.pieChart?.pending || 0;

  const chartData = [
    {
      name: "Total",
      value: totalValue,
      color: COLORS.primaryBlue,
    },
    {
      name: "Delivered",
      value: activeValue,
      color: COLORS.secondaryBlue,
    },
    {
      name: "Pending",
      value: pendingValue,
      color: "#67E8F9",
    },
  ];

  // Donut Chart Component
  const RadialChart = () => {
    // Handle empty data
    if (activeValue + pendingValue + totalValue <= 0) {
      return (
        <View style={styles.radialChartContainer}>
          <View style={styles.progressCirclesContainer}>
            <Text style={styles.centerText}>0</Text>
            <Text style={styles.centerSubText}>No Data</Text>
          </View>
        </View>
      );
    }

    const chartDataForKit = [
      {
        value: activeValue,
        svg: { fill: COLORS.secondaryBlue },
        key: "delivered",
      },
      {
        value: pendingValue,
        svg: { fill: "#67E8F9" },
        key: "pending",
      },
      {
        value: totalValue,
        svg: { fill: COLORS.primaryBlue },
        key: "total",
      },
    ];

    return (
      <View style={styles.radialChartContainer}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            height: 240,
          }}
        >
          <PieChart
            style={{ height: 240, width: screenWidth - 80 }}
            data={chartDataForKit}
            innerRadius="50%"
            outerRadius="85%"
            spacing={0}
            // padAngle={0}
          />
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={allStyles.safeArea} edges={["top"]}>
      <ScrollView style={allStyles.container}>
        {/* Header Section */}
        <View style={styles.headingContainer}>
          <View style={styles.headingTextContainer}>
            <View style={[styles.headingText]}>
              <Text style={styles.UserStyle}>Hello</Text>
              <Text style={styles.UserStyle}>
                {user?.name
                  ? user.name.charAt(0).toUpperCase() +
                    user.name.slice(1).toLowerCase()
                  : ""}
              </Text>
            </View>
            {user?.mainDealerRef?.name && (
              <Text style={styles.UserDealerStyle}>
                {user?.mainDealerRef?.name}
              </Text>
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
            {chartData.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>{item.name}</Text>
                <Text style={styles.legendValue}>{item.value}</Text>
              </View>
            ))}
          </View>

          {/* Progress Chart */}
          <View style={styles.chartContainer}>
            <RadialChart />
          </View>
        </View>

        {/* Total Sales Section */}
        <Text style={allStyles.sectionHeader}>Total Sales</Text>
        <View style={allStyles.statsContainer}>
          <LinearGradient
            colors={["#183B64", "#3077CA"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={[allStyles.statCard, styles.gradientCard]}
          >
            <View style={styles.statCardHeader}>
              <Text style={styles.statLabel}>Total{"\n"}Deliveries</Text>
              <Image
                source={require("@/assets/icons/totaldeliveriesicon.png")}
                style={styles.img}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.statValue}>
              {(dashBoardData as any)?.pieChart?.total}
            </Text>
          </LinearGradient>

          <LinearGradient
            colors={["#183B64", "#3077CA"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[allStyles.statCard, styles.gradientCard]}
          >
            <View style={styles.statCardHeader}>
              <Text style={styles.statLabel}>Average{"\n"}Discount</Text>
              <Image
                source={require("@/assets/icons/averagediscounticon.png")}
                style={styles.img}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.statValue}>
              {(dashBoardData as any)?.avgDiscount}
            </Text>
          </LinearGradient>

          <LinearGradient
            colors={["#183B64", "#3077CA"]}
            start={{ x: 0, y: 1 }}
            end={{ x: 1, y: 0 }}
            style={[allStyles.statCard, styles.gradientCard]}
          >
            <View style={styles.statCardHeader}>
              <Text style={styles.statLabel}>Total{"\n"}Accessories</Text>
              <Image
                source={require("@/assets/icons/totalaccessoriesicon.png")}
                style={styles.img}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.statValue}>
              {(dashBoardData as any)?.totalAccessories}
            </Text>
          </LinearGradient>

          <LinearGradient
            colors={["#183B64", "#3077CA"]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={[allStyles.statCard, styles.gradientCard]}
          >
            <View style={styles.statCardHeader}>
              <Text style={styles.statLabel}>Total{"\n"}Helmets</Text>
              <Image
                source={require("@/assets/icons/noofhelmetsicon.png")}
                style={styles.img}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.statValue}>
              {(dashBoardData as any)?.noOfHelmets}
            </Text>
          </LinearGradient>
        </View>
        <LinearGradient
          colors={["#183B64", "#3077CA"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[allStyles.statCard, styles.gradientCard]}
        >
          <View style={styles.statCardHeader}>
            <Text style={styles.statLabel}>Total{"\n"}Loyality</Text>
            <Image
              source={require("@/assets/icons/loyalityicon.png")}
              style={styles.img}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.statValue}>
            {(dashBoardData as any)?.totalLoyality}
          </Text>
        </LinearGradient>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => {
          setIsEdit(false);
          router.push("/add-delivery");
        }}
        style={allStyles.floatingButton}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
      <Toast />
    </SafeAreaView>
  );
}
