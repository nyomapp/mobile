import {
  Dimensions,
  Image,
  Modal,
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
import { COLORS, FONTS } from "@/src/constants";
import { useDashBoard } from "@/src/contexts/DashBoardContext";
import { useDeliveryContext } from "@/src/contexts/DeliveryContext";
import { globalStyles } from "@/src/styles";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Calendar } from "react-native-calendars";
import { PieChart } from "react-native-svg-charts";
import Toast from "react-native-toast-message";
import { styles } from "../../styles/homeStyles";

const screenWidth = Dimensions.get("window").width;

export default function HomeScreen() {
  const getDefaultDates = () => {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(1);

    return {
      startDate: startDate.toISOString().split("T")[0],
      endDate: endDate.toISOString().split("T")[0],
    };
  };

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

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [dateValidationError, setDateValidationError] = useState<string>("");
  const [currentFilters, setCurrentFilters] = useState<{
    startDate: string;
    endDate: string;
  }>(() => {
    const defaultDates = getDefaultDates();
    return {
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
    };
  });

  // Reset all filters on initial mount
  useEffect(() => {
    const defaultDates = getDefaultDates();
    setCurrentFilters({
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log("Home screen focused - fetching dashboard data");
      fetchDashBoardData();
    }, []),
  );

  const fetchDashBoardData = async (filters?: typeof currentFilters) => {
    try {
      console.log("Fetching dashboard data...");
      const filtersToUse = filters || currentFilters;
      const response = await getDashBoardData(filtersToUse);
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

  // Helper functions for date formatting:
  const formatDateForDisplay = (dateString: string): string => {
    if (!dateString) return "";
    // Convert YYYY-MM-DD to DD/MM/YYYY for display
    const parts = dateString.split("-");
    if (parts.length === 3) {
      return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return dateString;
  };

  const formatDateForAPI = (dateString: string): string => {
    if (!dateString) return "";
    // If already in YYYY-MM-DD format, return as is
    if (dateString.includes("-") && dateString.split("-").length === 3) {
      return dateString;
    }
    // Convert DD/MM/YYYY to YYYY-MM-DD for API
    const parts = dateString.split("/");
    if (parts.length === 3) {
      return `${parts[2]}-${parts[1]}-${parts[0]}`;
    }
    return dateString;
  };

  // Update date validation function:
  const validateDateRange = (start: string, end: string): string => {
    if (!start && !end) {
      return "";
    }

    if ((start && !end) || (!start && end)) {
      return "Please select both start and end dates";
    }

    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      if (startDate > endDate) {
        return "Start date cannot be after end date";
      }
    }

    return "";
  };

  // Calendar handlers:
  const handleStartDateSelect = (day: any) => {
    setCurrentFilters((prev) => ({ ...prev, startDate: day.dateString }));
    setShowStartDatePicker(false);

    // Clear validation error when user selects a date
    if (dateValidationError) {
      setDateValidationError("");
    }
  };

  const handleEndDateSelect = (day: any) => {
    setCurrentFilters((prev) => ({ ...prev, endDate: day.dateString }));
    setShowEndDatePicker(false);

    // Clear validation error when user selects a date
    if (dateValidationError) {
      setDateValidationError("");
    }
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilter = () => {
    // Validate date range
    const dateError = validateDateRange(
      currentFilters.startDate,
      currentFilters.endDate,
    );
    if (dateError) {
      setDateValidationError(dateError);
      Toast.show({
        type: "error",
        text1: "Validation Error",
        text2: dateError,
      });
      return;
    }

    setDateValidationError("");

    console.log("Applying filter:", currentFilters);
    fetchDashBoardData();
    // Close modal
    setShowFilterModal(false);

    Toast.show({
      type: "success",
      text1: "Filter Applied",
      text2: "Dashboard filtered successfully",
    });
  };

  const handleResetFilter = () => {
    const defaultDates = getDefaultDates();
    const emptyFilters = {
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
    };

    setCurrentFilters(emptyFilters);

    // Fetch data with empty filters
    fetchDashBoardData(emptyFilters);

    // Close modal
    setShowFilterModal(false);

    Toast.show({
      type: "success",
      text1: "Filter Reset",
      text2: "All filters cleared",
    });
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

        {/* Filter button with date range */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: 16,
          }}
        >
          <Text
            style={{
              fontSize: 10,
              color: COLORS.black,
              fontFamily: FONTS.YellixThin,
              marginRight: 8,
            }}
          >
            From: {formatDateForDisplay(currentFilters.startDate)} To:{" "}
            {formatDateForDisplay(currentFilters.endDate)}
          </Text>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFilterPress}
          >
            <Image
              source={require("@/assets/icons/filtericon.png")}
              style={styles.filterIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
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

      {/* Filter Modal - Slides up from bottom */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showFilterModal}
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.filterModalOverlay}>
          <View style={styles.filterModalContent}>
            {/* Modal Header */}
            <View style={styles.filterModalHeader}>
              <TouchableOpacity onPress={() => setShowFilterModal(false)}>
                <Ionicons name="arrow-back" size={24} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.filterModalTitle}>Filter</Text>
              <TouchableOpacity onPress={handleResetFilter}>
                <Text style={styles.resetText}>Reset</Text>
              </TouchableOpacity>
            </View>

            {/* Filter Form */}
            <ScrollView
              style={styles.filterForm}
              contentContainerStyle={{ paddingBottom: 30 }}
              showsVerticalScrollIndicator={false}
            >
              {/* Start Date Picker */}
              <TouchableOpacity
                style={[globalStyles.input, styles.dropdownButton]}
                onPress={() => setShowStartDatePicker(true)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    allStyles.dropdownText,
                    currentFilters.startDate ? { color: COLORS.black } : null,
                  ]}
                >
                  {currentFilters.startDate
                    ? formatDateForDisplay(currentFilters.startDate)
                    : "Start Date"}
                </Text>
                <Ionicons name="calendar" size={20} color="#6C757D" />
              </TouchableOpacity>

              {/* End Date Picker */}
              <TouchableOpacity
                style={[globalStyles.input, styles.dropdownButton]}
                onPress={() => setShowEndDatePicker(true)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    allStyles.dropdownText,
                    currentFilters.endDate ? { color: COLORS.black } : null,
                  ]}
                >
                  {currentFilters.endDate
                    ? formatDateForDisplay(currentFilters.endDate)
                    : "End Date"}
                </Text>
                <Ionicons name="calendar" size={20} color="#6C757D" />
              </TouchableOpacity>

              {/* Date Validation Error */}
              {dateValidationError ? (
                <Text
                  style={{
                    color: "red",
                    fontSize: 12,
                    marginTop: 5,
                    marginBottom: 10,
                  }}
                >
                  {dateValidationError}
                </Text>
              ) : null}
            </ScrollView>

            {/* Apply Button */}
            <View style={styles.filterButtonContainer}>
              <TouchableOpacity
                style={allStyles.btn}
                onPress={handleApplyFilter}
              >
                <Text style={allStyles.btnText}>Apply</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Start Date Calendar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showStartDatePicker}
        onRequestClose={() => setShowStartDatePicker(false)}
      >
        <View style={styles.filterModalOverlay}>
          <View style={[styles.filterModalContent, { height: "60%" }]}>
            {/* Modal Header */}
            <View style={styles.filterModalHeader}>
              <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                <Ionicons name="arrow-back" size={24} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.filterModalTitle}>Select Start Date</Text>
              <TouchableOpacity onPress={() => setShowStartDatePicker(false)}>
                <Text style={styles.resetText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* Calendar */}
            <View style={{ flex: 1, padding: 20 }}>
              <Calendar
                onDayPress={handleStartDateSelect}
                markedDates={{
                  [currentFilters.startDate]: {
                    selected: true,
                    selectedColor: COLORS.primaryBlue || "#007AFF",
                  },
                }}
                maxDate={new Date().toISOString().split("T")[0]}
                theme={{
                  selectedDayBackgroundColor: COLORS.primaryBlue || "#007AFF",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: COLORS.primaryBlue || "#007AFF",
                  dayTextColor: "#2d4150",
                  textDisabledColor: "#d9e1e8",
                  arrowColor: COLORS.primaryBlue || "#007AFF",
                  monthTextColor: COLORS.primaryBlue || "#007AFF",
                  indicatorColor: COLORS.primaryBlue || "#007AFF",
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* End Date Calendar Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showEndDatePicker}
        onRequestClose={() => setShowEndDatePicker(false)}
      >
        <View style={styles.filterModalOverlay}>
          <View style={[styles.filterModalContent, { height: "60%" }]}>
            {/* Modal Header */}
            <View style={styles.filterModalHeader}>
              <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                <Ionicons name="arrow-back" size={24} color="#6B7280" />
              </TouchableOpacity>
              <Text style={styles.filterModalTitle}>Select End Date</Text>
              <TouchableOpacity onPress={() => setShowEndDatePicker(false)}>
                <Text style={styles.resetText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            {/* Calendar */}
            <View style={{ flex: 1, padding: 20 }}>
              <Calendar
                onDayPress={handleEndDateSelect}
                markedDates={{
                  [currentFilters.endDate]: {
                    selected: true,
                    selectedColor: COLORS.primaryBlue || "#007AFF",
                  },
                }}
                maxDate={new Date().toISOString().split("T")[0]}
                minDate={currentFilters.startDate || undefined}
                theme={{
                  selectedDayBackgroundColor: COLORS.primaryBlue || "#007AFF",
                  selectedDayTextColor: "#ffffff",
                  todayTextColor: COLORS.primaryBlue || "#007AFF",
                  dayTextColor: "#2d4150",
                  textDisabledColor: "#d9e1e8",
                  arrowColor: COLORS.primaryBlue || "#007AFF",
                  monthTextColor: COLORS.primaryBlue || "#007AFF",
                  indicatorColor: COLORS.primaryBlue || "#007AFF",
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <Toast />
    </SafeAreaView>
  );
}
