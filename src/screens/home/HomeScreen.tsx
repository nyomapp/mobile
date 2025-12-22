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
import { useCallback, useEffect } from "react";
// import PieChart from 'react-native-pie-chart';
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
    }, [])
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

  useEffect(() => {
    console.log("Dashboard data updated:", dashBoardData);
  }, [dashBoardData]);

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

  // RadialChart component with correct props
  const RadialChart = () => {
    // Create series array with just numbers
    const series = [
      { value: activeValue, color: COLORS.secondaryBlue },
      { value: totalValue, color: COLORS.primaryBlue },
      { value: pendingValue, color: "#67E8F9" },
    ];
    // const sliceColors = [COLORS.primaryBlue, COLORS.secondaryBlue, '#67E8F9'];

    // Check if all values are zero to prevent the error
    // const hasData = series.some(value => value as any > 0);

    // if (!hasData) {
    //   // Show placeholder when no data
    //   return (
    //     <View style={styles.radialChartContainer}>
    //       <View style={styles.progressCirclesContainer}>
    //         <View style={[styles.centerContent, { width: 120, height: 120, borderRadius: 60, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' }]}>
    //           <Text style={styles.centerText}>0</Text>
    //           <Text style={styles.centerSubText}>No Data</Text>
    //         </View>
    //       </View>
    //     </View>
    //   );
    // }

    return (
      <View style={styles.radialChartContainer}>
        <View
          style={[
            styles.progressCirclesContainer,
            { height: "auto", justifyContent: "center", alignItems: "center" },
          ]}
        >
          {/* <PieChart
            widthAndHeight={150}
            series={series}
            cover={0.6}
          /> */}

          {/* <View style={styles.centerContent}>
            <Text style={styles.centerText}>{totalValue}</Text>
            <Text style={styles.centerSubText}>Total</Text>
          </View> */}
        </View>
      </View>
    );
  };

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
              {(dashBoardData as any)?.totalSales}
    
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
              <Text style={styles.statLabel}>No. of{"\n"}Helmets</Text>
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
