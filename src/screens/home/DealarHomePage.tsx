import {
  getDealerGraphData,
  getExecutives,
  getFinanciers,
} from "@/src/api/dealerHome";
import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { COLORS, FONTS, chartColors } from "@/src/constants";
import { useDashBoard } from "@/src/contexts/DashBoardContext";
import { useExecutiveData } from "@/src/contexts/ExecutiveDataContext";
import { useFinancierData } from "@/src/contexts/FinancierDataContext";
import { globalStyles } from "@/src/styles";
import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  Image,
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text as SvgText } from "react-native-svg";
import { BarChart, PieChart, StackedBarChart } from "react-native-svg-charts";
import Toast from "react-native-toast-message";
import { useAuth } from "../../contexts/AuthContext";
import { allStyles } from "../../styles/global";
import { styles } from "../../styles/homeStyles";
const screenWidth = Dimensions.get("window").width;

export default function DealerHomeScreen() {
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
  const { executives, setExecutives, resetExecutives } = useExecutiveData();
  const {
    data: financiers,
    setData: setFinanciers,
    resetData: resetFinanciers,
  } = useFinancierData();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [dateValidationError, setDateValidationError] = useState<string>("");
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [selectedExecutives, setSelectedExecutives] = useState<Array<string>>(
    [],
  );
  const [selectedFinanciers, setSelectedFinanciers] = useState<Array<string>>(
    [],
  );
  const [showUserModal, setShowUserModal] = useState(false);
  const [currentFilters, setCurrentFilters] = useState<{
    userRef: string[];
    financierRef: string[];
    startDate: string;
    endDate: string;
    includingCash: boolean;
  }>(() => {
    const defaultDates = getDefaultDates();
    return {
      userRef: [],
      financierRef: [],
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
      includingCash: false,
    };
  });

  // Reset all filters on initial mount
  useEffect(() => {
    const defaultDates = getDefaultDates();
    setCurrentFilters({
      userRef: [],
      financierRef: [],
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
      includingCash: false,
    });
  }, []);

  useFocusEffect(
    useCallback(() => {
      console.log("Home screen focused - fetching dashboard data");
      fetchDashBoardData();
    }, []),
  );

  const fetchFinanciers = async () => {
    const response = await getFinanciers();
    setFinanciers((response as any) || []);
  };

  const fetchExecutives = async () => {
    const response = await getExecutives();
    setExecutives((response as any).results || []);
  };

  const fetchDashBoardData = async (filters?: typeof currentFilters) => {
    try {
      console.log("Fetching dashboard data...");
      const filtersToUse = filters !== undefined ? filters : currentFilters;
      const response = await getDealerGraphData(filtersToUse);
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

  // Add helper functions for date formatting:
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
      const day = parts[0].padStart(2, "0");
      const month = parts[1].padStart(2, "0");
      const year = parts[2];
      return `${year}-${month}-${day}`;
    }
    return dateString;
  };

  // Update date validation function:
  const validateDateRange = (start: string, end: string): string => {
    if (!start && !end) {
      return ""; // Both empty is valid
    }

    if ((start && !end) || (!start && end)) {
      return "Both start date and end date are required when filtering by date";
    }

    if (start && end) {
      const startDateObj = new Date(formatDateForAPI(start));
      const endDateObj = new Date(formatDateForAPI(end));

      if (startDateObj > endDateObj) {
        return "Start date cannot be greater than end date";
      }
    }

    return "";
  };

  // Calendar handlers:
  const handleStartDateSelect = (day: any) => {
    setCurrentFilters((prev) => ({ ...prev, startDate: day.dateString })); // Store in YYYY-MM-DD format
    setShowStartDatePicker(false);

    // Clear validation error when user selects a date
    if (dateValidationError) {
      setDateValidationError("");
    }
  };

  const handleEndDateSelect = (day: any) => {
    setCurrentFilters((prev) => ({ ...prev, endDate: day.dateString })); // Store in YYYY-MM-DD format
    setShowEndDatePicker(false);

    // Clear validation error when user selects a date
    if (dateValidationError) {
      setDateValidationError("");
    }
  };
  const handleFilterPress = async () => {
    setShowFilterModal(true);
    try {
      fetchExecutives();
      fetchFinanciers();
    } catch (error) {
      console.error("Error loading users:", error);
      Toast.show({
        type: "error",
        text1: "API Error",
        text2: `Failed to load users: ${(error as Error).message}`,
        visibilityTime: 3000,
      });
    }
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
        text1: "Date Validation Error",
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
      text2: "Deliveries filtered successfully",
    });
  };

  const handleResetFilter = () => {
    const defaultDates = getDefaultDates();
    const emptyFilters = {
      userRef: [],
      financierRef: [],
      startDate: defaultDates.startDate,
      endDate: defaultDates.endDate,
      includingCash: false,
    };

    setCurrentFilters(emptyFilters);
    setSelectedExecutives([]);
    setSelectedFinanciers([]);

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

  const colors = chartColors;

  // Chart data calculation
  // const totalValue = (dashBoardData as any)?.pieChart?.total || 0;
  const activeValue =
    (dashBoardData as any)?.deliveryStatusData?.delivered || 0;
  const pendingValue = (dashBoardData as any)?.deliveryStatusData?.pending || 0;
  // Delivery Location Wise

  //  delivery
  const chartData_1 = [
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
  // delivery vs accessories
  const chartData_2 = [
    {
      name: "Deliveries",
      value1: (dashBoardData as any)?.accessoriesData?.deliveries || 0,
      value2: (dashBoardData as any)?.accessoriesData?.deliveriesAmount || 0,

      color: COLORS.secondaryBlue,
    },
    {
      name: "Accessories",
      value1: (dashBoardData as any)?.accessoriesData?.accessories || 0,
      value2: (dashBoardData as any)?.accessoriesData?.accessoriesAmount || 0,
      color: "#67E8F9",
    },
  ];
  //  delivery vs rsa
  const chartData_3 = [
    {
      name: "Deliveries",
      value1: (dashBoardData as any)?.rsaData?.deliveries || 0,
      value2: (dashBoardData as any)?.rsaData?.deliveriesAmount || 0,

      color: COLORS.secondaryBlue,
    },
    {
      name: "RSA",
      value1: (dashBoardData as any)?.rsaData?.rsa || 0,
      value2: (dashBoardData as any)?.rsaData?.rsaAmount || 0,
      color: "#67E8F9",
    },
  ];
  //  delivery vs helmet
  const chartData_4 = [
    {
      name: "Deliveries",
      value1: (dashBoardData as any)?.helmetData?.deliveries || 0,
      value2: (dashBoardData as any)?.helmetData?.deliveriesAmount || 0,

      color: COLORS.secondaryBlue,
    },
    {
      name: "Helmet",
      value1: (dashBoardData as any)?.helmetData?.helmet || 0,
      value2: (dashBoardData as any)?.helmetData?.helmetAmount || 0,
      color: "#67E8F9",
    },
  ];
  //  Delivery VS Discount & Scheme Discount
  const chartData_5 = [
    {
      name: "Deliveries",
      value: (dashBoardData as any)?.discountData?.deliveries || 0,

      color: COLORS.secondaryBlue,
    },
    {
      name: "Discount",
      value: (dashBoardData as any)?.discountData?.discount || 0,
      color: "#67E8F9",
    },
    {
      name: "Scheme Discount",
      value: (dashBoardData as any)?.discountData?.schemeDiscount || 0,
      color: "#10B981",
    },
    {
      name: "Average Discount",
      value: (dashBoardData as any)?.discountData?.avgDiscount || 0,
      color: "#F59E0B",
    },
    {
      name: "Average Scheme Discount",
      value: (dashBoardData as any)?.discountData?.avgSchemeDiscount || 0,
      color: "#8B5CF6",
    },
  ];

  //  Delivery Location Wise
  const chartData_6 =
    (dashBoardData as any)?.locationWiseData?.map(
      (item: any, index: number) => ({
        name: item.name,
        value: item.count,
        // color: colors[index],
      }),
    ) || [];
  // [
  //   { name: "Location A", value1: 5, value2: 10, color: COLORS.primaryBlue },
  //   { name: "Location B", value1: 10, value2: 20, color: "#67E8F9" },
  //   { name: "Location C", value1: 15, value2: 30, color: "#10B981" },
  //   { name: "Location D", value1: 20, value2: 40, color: "#F59E0B" },
  //   { name: "Location E", value1: 25, value2: 50, color: "#8B5CF6" },
  // ];
  // Delivery Model wise
  const chartData_7 =
    (dashBoardData as any)?.modelWiseData
      ?.sort((a: any, b: any) => b.count - a.count)
      .map((item: any, index: number) => ({
        name: item.name,
        value: item.count,
        color: COLORS.secondaryBlue,
      })) || [];

  //   || [
  //   { name: "Modal 1", value: 5, color: COLORS.primaryBlue },
  //   { name: "Modal 2", value: 10, color: "#67E8F9" },
  //   { name: "Modal 3", value: 15, color: "#10B981" },
  //   { name: "Modal 4", value: 20, color: "#F59E0B" },
  //   { name: "Modal 5", value: 25, color: "#8B5CF6" },
  // ];
  // Delivery RTO Location (Same City, Other City/Same State, Other State)
  const chartData_8 = [
    {
      name: "Total",
      value: (dashBoardData as any)?.rtoLocationData?.total?.count || 0,
      color: COLORS.secondaryBlue,
    },
    {
      name: "Same City",
      value: (dashBoardData as any)?.rtoLocationData?.sameCity?.count || 0,
      color: "#67E8F9",
    },
    {
      name: "Other City/Same State",
      value: (dashBoardData as any)?.rtoLocationData?.sameState?.count || 0,
      color: "#10B981",
    },
    {
      name: "Other State",
      value: (dashBoardData as any)?.rtoLocationData?.otherState?.count || 0,
      color: "#F59E0B",
    },
  ];

  const chartData_9 = [
    {
      name: "Cash",
      value: (dashBoardData as any)?.financierOverviewData?.cash?.count,
      color: COLORS.secondaryBlue,
    },
    {
      name: "Finance",
      value: (dashBoardData as any)?.financierOverviewData?.finance?.count,
      color: "#67E8F9",
    },
  ];
  //  Delivery Financier Wise
  const chartData_10 =
    (dashBoardData as any)?.financierWiseData?.map(
      (item: any, index: number) => ({
        name: item.name,
        value: item.count,
        color: colors[index],
      }),
    ) || [];
  //  [
  //   { name: "Financier 1", value1: 25, value2: 50, color: COLORS.primaryBlue },
  //   { name: "Financier 2", value1: 20, value2: 40, color: "#67E8F9" },
  //   { name: "Financier 3", value1: 15, value2: 30, color: "#10B981" },
  //   { name: "Financier 4", value1: 10, value2: 20, color: "#F59E0B" },
  //   { name: "Financier 5", value1: 5, value2: 10, color: "#8B5CF6" },
  // ];

  //  Sales Executive Performance(%)
  const chartData_11 =
    (dashBoardData as any)?.executivePerformancePercentageData
      ?.sort(
        (a: any, b: any) => b.accessoriesPercentage - a.accessoriesPercentage,
      )
      .map((item: any, index: number) => ({
        name: item.name,
        value2: item.accessoriesPercentage,
        value3: item.rsaPercentage,
        value4: item.helmetPercentage,
        value5: item.loyaltyCardPercentage,
        color: colors[index],
      })) || [];

  // [
  //   {
  //     name: "Financier 1",
  //     value1: 25,
  //     value2: 50,
  //     value3: 50,
  //     value4: 50,
  //     value5: 50,
  //     color: COLORS.primaryBlue,
  //   },
  //   {
  //     name: "Financier 2",
  //     value1: 20,
  //     value2: 40,
  //     value3: 40,
  //     value4: 40,
  //     value5: 40,
  //     color: "#67E8F9",
  //   },
  //   {
  //     name: "Financier 3",
  //     value1: 15,
  //     value2: 30,
  //     value3: 30,
  //     value4: 30,
  //     value5: 30,
  //     color: "#10B981",
  //   },
  //   {
  //     name: "Financier 4",
  //     value1: 10,
  //     value2: 20,
  //     value3: 20,
  //     value4: 20,
  //     value5: 20,
  //     color: "#F59E0B",
  //   },
  //   {
  //     name: "Financier 5",
  //     value1: 5,
  //     value2: 10,
  //     value3: 10,
  //     value4: 10,
  //     value5: 10,
  //     color: "#8B5CF6",
  //   },
  //   {
  //     name: "Financier 5",
  //     value1: 5,
  //     value2: 10,
  //     value3: 10,
  //     value4: 10,
  //     value5: 10,
  //     color: "#8B5CF6",
  //   },
  //   {
  //     name: "Financier 5",
  //     value1: 5,
  //     value2: 10,
  //     value3: 10,
  //     value4: 10,
  //     value5: 10,
  //     color: "#8B5CF6",
  //   },
  //   {
  //     name: "Financier 5",
  //     value1: 5,
  //     value2: 10,
  //     value3: 10,
  //     value4: 10,
  //     value5: 10,
  //     color: "#8B5CF6",
  //   },
  //   {
  //     name: "Financier 5",
  //     value1: 5,
  //     value2: 10,
  //     value3: 10,
  //     value4: 10,
  //     value5: 10,
  //     color: "#8B5CF6",
  //   },
  //   {
  //     name: "Financier 5",
  //     value1: 5,
  //     value2: 10,
  //     value3: 10,
  //     value4: 10,
  //     value5: 10,
  //     color: "#8B5CF6",
  //   },
  // ];
  //  Sales Executive Performance(total)
  const chartData_12 =
    (dashBoardData as any)?.executivePerformanceData
      ?.sort((a: any, b: any) => b.deliveries - a.deliveries)
      .map((item: any, index: number) => ({
        name: item.name,
        value1: item.deliveries,
        value2: item.accessories,
        value3: item.rsa,
        value4: item.helmet,
        value5: item.loyaltyCard,
        color: colors[index],
      })) || [];

  //  Sales Executive Wise Discount
  const chartData_13 =
    (dashBoardData as any)?.executiveDiscountData
      ?.sort((a: any, b: any) => b.avgDiscount - a.avgDiscount)
      .map((item: any, index: number) => ({
        name: item.name,
        value: item.avgDiscount,
      })) || [];

  //  Sales Executive Wise Scheme Discount
  const chartData_14 =
    (dashBoardData as any)?.executiveSchemeDiscountData
      ?.sort((a: any, b: any) => b.avgSchemeDiscount - a.avgSchemeDiscount)
      .map((item: any, index: number) => ({
        name: item.name,
        value: item.avgSchemeDiscount,
      })) || [];

  //  Model Wise Average Discount
  const chartData_15 =
    (dashBoardData as any)?.modelWiseDiscountData
      ?.sort((a: any, b: any) => b.avgDiscount - a.avgDiscount)
      .map((item: any, index: number) => ({
        name: item.name,
        value: item.avgDiscount,
      })) || [];

  //  Sales Executive Wise Delivery
  const chartData_16 =
    (dashBoardData as any)?.executivePerformanceData
      ?.sort((a: any, b: any) => b.deliveries - a.deliveries)
      .map((item: any, index: number) => ({
        name: item.name,
        value: item.deliveries,
      })) || [];

  // [
  //   {
  //     name: "Financier 1",
  //     value1: 25,
  //     value2: 50,
  //     value3: 50,
  //     value4: 50,
  //     value5: 50,
  //     color: COLORS.primaryBlue,
  //   },
  //   {
  //     name: "Financier 2",
  //     value1: 20,
  //     value2: 40,
  //     value3: 40,
  //     value4: 40,
  //     value5: 40,
  //     color: "#67E8F9",
  //   },
  //   {
  //     name: "Financier 3",
  //     value1: 15,
  //     value2: 30,
  //     value3: 30,
  //     value4: 30,
  //     value5: 30,
  //     color: "#10B981",
  //   },
  //   {
  //     name: "Financier 4",
  //     value1: 10,
  //     value2: 20,
  //     value3: 20,
  //     value4: 20,
  //     value5: 20,
  //     color: "#F59E0B",
  //   },
  //   {
  //     name: "Financier 5",
  //     value1: 5,
  //     value2: 10,
  //     value3: 10,
  //     value4: 10,
  //     value5: 10,
  //     color: "#8B5CF6",
  //   },
  //   {
  //     name: "Financier 6",
  //     value1: 5,
  //     value2: 10,
  //     value3: 10,
  //     value4: 10,
  //     value5: 10,
  //     color: "#8B5CF6",
  //   },
  //   {
  //     name: "Financier 7",
  //     value1: 5,
  //     value2: 10,
  //     value3: 10,
  //     value4: 10,
  //     value5: 10,
  //     color: "#8B5CF6",
  //   },
  //   {
  //     name: "Financier 8",
  //     value1: 5,
  //     value2: 10,
  //     value3: 10,
  //     value4: 10,
  //     value5: 10,
  //     color: "#8B5CF6",
  //   },
  //   {
  //     name: "Financier 9",
  //     value1: 5,
  //     value2: 10,
  //     value3: 10,
  //     value4: 10,
  //     value5: 10,
  //     color: "#8B5CF6",
  //   },
  //   {
  //     name: "Financier 9",
  //     value1: 5,
  //     value2: 10,
  //     value3: 10,
  //     value4: 10,
  //     value5: 10,
  //     color: "#8B5CF6",
  //   },
  //   {
  //     name: "Financier 9",
  //     value1: 5,
  //     value2: 10,
  //     value3: 10,
  //     value4: 10,
  //     value5: 10,
  //     color: "#8B5CF6",
  //   },
  //   {
  //     name: "Financier 9",
  //     value1: 5,
  //     value2: 10,
  //     value3: 10,
  //     value4: 10,
  //     value5: 10,
  //     color: "#8B5CF6",
  //   },
  //   {
  //     name: "Financier 9",
  //     value1: 5,
  //     value2: 10,
  //     value3: 10,
  //     value4: 10,
  //     value5: 10,
  //     color: "#8B5CF6",
  //   },
  //   {
  //     name: "Financier 9",
  //     value1: 5,
  //     value2: 10,
  //     value3: 10,
  //     value4: 10,
  //     value5: 10,
  //     color: "#8B5CF6",
  //   },
  // ];
  // Donut Chart Component
  //  Financier Wise Performance(%)
  const chartData_17 =
    (dashBoardData as any)?.financierPerformancePercentageData
      ?.sort(
        (a: any, b: any) => b.accessoriesPercentage - a.accessoriesPercentage,
      )
      .map((item: any, index: number) => ({
        name: item.name,
        value2: item.accessoriesPercentage,
        value3: item.rsaPercentage,
        value4: item.helmetPercentage,
        value5: item.loyaltyCardPercentage,
        color: colors[index],
      })) || [];
  // Financier wise Performance(total)
  const chartData_18 =
    (dashBoardData as any)?.financierPerformanceData
      ?.sort((a: any, b: any) => b.deliveries - a.deliveries)
      .map((item: any, index: number) => ({
        name: item.name,
        value1: item.deliveries,
        value2: item.accessories,
        value3: item.rsa,
        value4: item.helmet,
        value5: item.loyaltyCard,
        color: colors[index],
      })) || [];
  //  Financier Wise Discount
  const chartData_19 =
    (dashBoardData as any)?.financierDiscountData
      ?.sort((a: any, b: any) => b.avgDiscount - a.avgDiscount)
      .map((item: any, index: number) => ({
        name: item.name,
        value: item.avgDiscount,
      })) || [];

  //  Financier Wise Scheme Discount
  const chartData_20 =
    (dashBoardData as any)?.financierSchemeDiscountData
      ?.sort((a: any, b: any) => b.avgSchemeDiscount - a.avgSchemeDiscount)
      .map((item: any, index: number) => ({
        name: item.name,
        value: item.avgSchemeDiscount,
      })) || [];

  const PieChart_1 = () => {
    // Handle empty data
    if (chartData_1.reduce((sum, item) => sum + item.value, 0) <= 0) {
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
        value: chartData_1[0].value,
        svg: { fill: COLORS.secondaryBlue },
        key: "delivered",
      },
      {
        value: chartData_1[1].value,
        svg: { fill: "#67E8F9" },
        key: "pending",
      },
    ];

    const total = chartData_1.reduce((sum, item) => sum + item.value, 0);

    const Labels = ({ slices }: any) => {
      return slices.map((slice: any, index: number) => {
        const { pieCentroid, data } = slice;
        const percentage = ((data.value / total) * 100).toFixed(1);
        // Adjust position to be closer to center to avoid overflow
        const x = pieCentroid[0] * 1;
        const y = pieCentroid[1] * 1;
        return (
          <SvgText
            key={index}
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={10}
            // fontWeight="bold"
            fontFamily={FONTS.YellixMedium}
          >
            {percentage}%
          </SvgText>
        );
      });
    };

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
            innerRadius={"50%"}
            // outerRadius={"85%"}
            spacing={0}
          >
            <Labels />
          </PieChart>
        </View>
      </View>
    );
  };
  const PieChart_2 = () => {
    // Handle empty data
    if (chartData_2.reduce((sum, item) => sum + item.value1, 0) <= 0) {
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
        value: chartData_2[1].value1, // accessories
        svg: { fill: "#67E8F9" },
        key: "accessories",
      },
      {
        value: Math.max(0, chartData_2[0].value1 - chartData_2[1].value1), // deliveries without accessories
        svg: { fill: COLORS.secondaryBlue },
        key: "deliveries",
      },
    ];

    const total = chartData_2[0].value1; // Use deliveries as 100%

    const Labels = ({ slices }: any) => {
      return slices.map((slice: any, index: number) => {
        const { pieCentroid, data } = slice;
        // For accessories (index 0), calculate percentage relative to deliveries
        // For deliveries (index 1), show remaining percentage
        const percentage =
          index === 1
            ? (100 - (chartData_2[1].value1 / total) * 100).toFixed(1)
            : ((data.value / total) * 100).toFixed(1);
        // Adjust position to be closer to center to avoid overflow
        const x = pieCentroid[0] * 1;
        const y = pieCentroid[1] * 1;
        return (
          <SvgText
            key={index}
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={10}
            // fontWeight="bold"
            fontFamily={FONTS.YellixMedium}
          >
            {percentage}%
          </SvgText>
        );
      });
    };

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
            innerRadius={"0%"}
            // outerRadius={"0%"}
            spacing={0}
          >
            <Labels />
          </PieChart>
        </View>
      </View>
    );
  };
  const PieChart_3 = () => {
    // Handle empty data
    if (chartData_3.reduce((sum, item) => sum + item.value1, 0) <= 0) {
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
        value: chartData_3[1].value1, // RSA
        svg: { fill: "#67E8F9" },
        key: "accessories",
      },
      {
        value: Math.max(0, chartData_3[0].value1 - chartData_3[1].value1), // deliveries without RSA
        svg: { fill: COLORS.secondaryBlue },
        key: "deliveries",
      },
    ];

    const total = chartData_3[0].value1; // Use deliveries as 100%

    const Labels = ({ slices }: any) => {
      return slices.map((slice: any, index: number) => {
        const { pieCentroid, data } = slice;
        // For RSA (index 0), calculate percentage relative to deliveries
        // For deliveries (index 1), show remaining percentage
        const percentage =
          index === 1
            ? (100 - (chartData_3[1].value1 / total) * 100).toFixed(1)
            : ((data.value / total) * 100).toFixed(1);
        // Adjust position to be closer to center to avoid overflow
        const x = pieCentroid[0] * 1;
        const y = pieCentroid[1] * 1;
        return (
          <SvgText
            key={index}
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={10}
            // fontWeight="bold"
            fontFamily={FONTS.YellixMedium}
          >
            {percentage}%
          </SvgText>
        );
      });
    };

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
            innerRadius={"50%"}
            spacing={0}
          >
            <Labels />
          </PieChart>
        </View>
      </View>
    );
  };
  const PieChart_4 = () => {
    // Handle empty data
    if (chartData_4.reduce((sum, item) => sum + item.value1, 0) <= 0) {
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
        value: chartData_4[1].value1, // helmet
        svg: { fill: "#67E8F9" },
        key: "accessories",
      },
      {
        value: Math.max(0, chartData_4[0].value1 - chartData_4[1].value1), // deliveries without helmet
        svg: { fill: COLORS.secondaryBlue },
        key: "deliveries",
      },
    ];

    const total = chartData_4[0].value1; // Use deliveries as 100%

    const Labels = ({ slices }: any) => {
      return slices.map((slice: any, index: number) => {
        const { pieCentroid, data } = slice;
        // For helmet (index 0), calculate percentage relative to deliveries
        // For deliveries (index 1), show remaining percentage
        const percentage =
          index === 1
            ? (100 - (chartData_4[1].value1 / total) * 100).toFixed(1)
            : ((data.value / total) * 100).toFixed(1);
        // Adjust position to be closer to center to avoid overflow
        const x = pieCentroid[0] * 1;
        const y = pieCentroid[1] * 1;
        return (
          <SvgText
            key={index}
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={10}
            // fontWeight="bold"
            fontFamily={FONTS.YellixMedium}
          >
            {percentage}%
          </SvgText>
        );
      });
    };

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
            innerRadius={"0%"}
            spacing={0}
          >
            <Labels />
          </PieChart>
        </View>
      </View>
    );
  };
  const BarChart_1 = () => {
    // Handle empty data
    if (chartData_5.reduce((sum, item) => sum + item.value, 0) <= 0) {
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
        value: chartData_5[0].value,
        label: chartData_5[0].name,
        svg: { fill: COLORS.secondaryBlue },
      },
      {
        value: chartData_5[1].value,
        label: chartData_5[1].name,
        svg: { fill: "#67E8F9" },
      },
      {
        value: chartData_5[2].value,
        label: chartData_5[2].name,
        svg: { fill: "#10B981" },
      },
    ];

    // Labels component to show values on top of bars
    const ValueLabels = ({ x, y, bandwidth, data }: any) =>
      data.map((value: any, index: number) => (
        <SvgText
          key={index}
          x={x(index) + bandwidth / 2}
          y={y(value.value) - 5}
          fontSize={10}
          fill={COLORS.black}
          alignmentBaseline="middle"
          textAnchor="middle"
          // fontWeight="bold"
          fontFamily={FONTS.YellixThin}
        >
          {value.value}
        </SvgText>
      ));

    return (
      <View style={styles.radialChartContainer}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingVertical: 20,
          }}
        >
          <BarChart
            style={{ height: 200, width: screenWidth - 80 }}
            data={chartDataForKit}
            yAccessor={({
              item,
            }: {
              item: { value: number; label: string; svg: { fill: string } };
            }) => item.value}
            contentInset={{ top: 30, bottom: 10 }}
            spacing={0.4}
            gridMin={0}
          >
            <ValueLabels />
          </BarChart>

          {/* Bottom labels */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              width: screenWidth - 80,
              marginTop: 10,
            }}
          >
            {chartDataForKit.map((item, index) => (
              <Text
                key={index}
                style={{
                  flex: 1,
                  textAlign: "center",
                  fontSize: 9,
                  color: COLORS.black,
                  fontFamily: FONTS.YellixThin,
                }}
              >
                {item.label}
              </Text>
            ))}
          </View>
        </View>
      </View>
    );
  };
  const BarChart_2 = () => {
    // Handle empty data
    if (chartData_6.reduce((sum: any, item: any) => sum + item.value, 0) <= 0) {
      return (
        <View style={styles.radialChartContainer}>
          <View style={styles.progressCirclesContainer}>
            <Text style={styles.centerText}>0</Text>
            <Text style={styles.centerSubText}>No Data</Text>
          </View>
        </View>
      );
    }

    const chartDataForKit = chartData_6.map((item: any) => ({
      value: item.value,
      svg: { fill: COLORS.secondaryBlue },
      label: item.name,
    }));

    const maxValue = Math.max(...chartData_6.map((item: any) => item.value));

    const minBarWidth = 40;
    const calculatedWidth = chartData_6.length * minBarWidth + 100;
    const chartWidth = Math.max(screenWidth - 80, calculatedWidth);

    const ValueLabels = ({ x, y, bandwidth, data }: any) =>
      data.map((value: any, index: number) => (
        <SvgText
          key={index}
          x={x(index) + bandwidth / 2}
          y={y(value.value) - 5}
          fontSize={10}
          fill={COLORS.black}
          alignmentBaseline="middle"
          textAnchor="middle"
          fontFamily={FONTS.YellixThin}
        >
          {value.value}
        </SvgText>
      ));

    return (
      <View style={styles.radialChartContainer}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingVertical: 20,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={{ width: screenWidth - 80 }}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <View>
              <BarChart
                style={{ height: 200, width: chartWidth }}
                data={chartDataForKit}
                yAccessor={({ item }: { item: { value: number } }) =>
                  item.value
                }
                contentInset={{ top: 30, bottom: 10 }}
                spacing={0.2}
                gridMin={0}
                gridMax={maxValue * 1.1}
              >
                <ValueLabels />
              </BarChart>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: chartWidth,
                  marginTop: 10,
                }}
              >
                {chartData_6.map((item: any, index: number) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 9,
                        color: COLORS.black,
                        fontFamily: FONTS.YellixThin,
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };
  const BarChart_4 = () => {
    // Handle empty data
    if (chartData_8.reduce((sum: any, item: any) => sum + item.value, 0) <= 0) {
      return (
        <View style={styles.radialChartContainer}>
          <View style={styles.progressCirclesContainer}>
            <Text style={styles.centerText}>0</Text>
            <Text style={styles.centerSubText}>No Data</Text>
          </View>
        </View>
      );
    }

    const chartDataForKit = chartData_8.map((item: any) => ({
      value: item.value,
      svg: { fill: COLORS.secondaryBlue },
      label: item.name,
    }));

    const maxValue = Math.max(...chartData_8.map((item: any) => item.value));

    const minBarWidth = 40;
    const calculatedWidth = chartData_8.length * minBarWidth + 100;
    const chartWidth = Math.max(screenWidth - 80, calculatedWidth);

    const ValueLabels = ({ x, y, bandwidth, data }: any) =>
      data.map((value: any, index: number) => (
        <SvgText
          key={index}
          x={x(index) + bandwidth / 2}
          y={y(value.value) - 5}
          fontSize={10}
          fill={COLORS.black}
          alignmentBaseline="middle"
          textAnchor="middle"
          fontFamily={FONTS.YellixThin}
        >
          {value.value}
        </SvgText>
      ));

    return (
      <View style={styles.radialChartContainer}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingVertical: 20,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={{ width: screenWidth - 80 }}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <View>
              <BarChart
                style={{ height: 200, width: chartWidth }}
                data={chartDataForKit}
                yAccessor={({ item }: { item: { value: number } }) =>
                  item.value
                }
                contentInset={{ top: 30, bottom: 10 }}
                spacing={0.4}
                gridMin={0}
                gridMax={maxValue * 1.1}
              >
                <ValueLabels />
              </BarChart>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: chartWidth,
                  marginTop: 10,
                }}
              >
                {chartData_8.map((item: any, index: number) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 9,
                        color: COLORS.black,
                        fontFamily: FONTS.YellixThin,
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };
  const PieChart_6 = () => {
    // Handle empty data
    if (chartData_9.reduce((sum, item) => sum + item.value, 0) <= 0) {
      return (
        <View style={styles.radialChartContainer}>
          <View style={styles.progressCirclesContainer}>
            <Text style={styles.centerText}>0</Text>
            <Text style={styles.centerSubText}>No Data</Text>
          </View>
        </View>
      );
    }

    const chartDataForKit = chartData_9.map((item) => ({
      value: item.value,
      svg: { fill: item.color },
      key: item.name,
    }));

    const total = chartData_9.reduce((sum, item) => sum + item.value, 0);

    const Labels = ({ slices }: any) => {
      return slices.map((slice: any, index: number) => {
        const { pieCentroid, data } = slice;
        const percentage = ((data.value / total) * 100).toFixed(1);
        // Adjust position to be closer to center to avoid overflow
        const x = pieCentroid[0] * 1;
        const y = pieCentroid[1] * 1;
        return (
          <SvgText
            key={index}
            x={x}
            y={y}
            fill="white"
            textAnchor="middle"
            alignmentBaseline="middle"
            fontSize={10}
            // fontWeight="bold"
            fontFamily={FONTS.YellixMedium}
          >
            {percentage}%
          </SvgText>
        );
      });
    };

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
            innerRadius={"0%"}
            // outerRadius={"85%"}
            spacing={0}
          >
            <Labels />
          </PieChart>
        </View>
      </View>
    );
  };
  const BarChart_3 = () => {
    // Handle empty data
    if (
      chartData_10.reduce((sum: any, item: any) => sum + item.value, 0) <= 0
    ) {
      return (
        <View style={styles.radialChartContainer}>
          <View style={styles.progressCirclesContainer}>
            <Text style={styles.centerText}>0</Text>
            <Text style={styles.centerSubText}>No Data</Text>
          </View>
        </View>
      );
    }

    const chartDataForKit = chartData_10.map((item: any) => ({
      value: item.value,
      svg: { fill: COLORS.secondaryBlue },
      label: item.name,
    }));

    const maxValue = Math.max(...chartData_10.map((item: any) => item.value));

    const minBarWidth = 40;
    const calculatedWidth = chartData_10.length * minBarWidth + 100;
    const chartWidth = Math.max(screenWidth - 80, calculatedWidth);

    const ValueLabels = ({ x, y, bandwidth, data }: any) =>
      data.map((value: any, index: number) => (
        <SvgText
          key={index}
          x={x(index) + bandwidth / 2}
          y={y(value.value) - 5}
          fontSize={10}
          fill={COLORS.black}
          alignmentBaseline="middle"
          textAnchor="middle"
          fontFamily={FONTS.YellixThin}
        >
          {value.value}
        </SvgText>
      ));

    return (
      <View style={styles.radialChartContainer}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingVertical: 20,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={{ width: screenWidth - 80 }}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <View>
              <BarChart
                style={{ height: 200, width: chartWidth }}
                data={chartDataForKit}
                yAccessor={({ item }: { item: { value: number } }) =>
                  item.value
                }
                contentInset={{ top: 30, bottom: 10 }}
                spacing={0.2}
                gridMin={0}
                gridMax={maxValue * 1.1}
              >
                <ValueLabels />
              </BarChart>

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: chartWidth,
                  marginTop: 10,
                }}
              >
                {chartData_10.map((item: any, index: number) => (
                  <View
                    key={index}
                    style={{
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 9,
                        color: COLORS.black,
                        fontFamily: FONTS.YellixThin,
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };
  const BarChart_5 = () => {
    if (
      chartData_13.reduce((sum: any, item: any) => sum + item.value, 0) <= 0
    ) {
      return (
        <View style={styles.radialChartContainer}>
          <View style={styles.progressCirclesContainer}>
            <Text style={styles.centerText}>0</Text>
            <Text style={styles.centerSubText}>No Data</Text>
          </View>
        </View>
      );
    }

    const chartDataForKit = chartData_13.map((item: any) => ({
      value: item.value,
      svg: { fill: COLORS.secondaryBlue },
      label: item.name,
    }));

    const maxValue = Math.max(...chartData_13.map((item: any) => item.value));
    const minBarWidth = 40;
    const calculatedWidth = chartData_13.length * minBarWidth + 100;
    const chartWidth = Math.max(screenWidth - 80, calculatedWidth);

    const ValueLabels = ({ x, y, bandwidth, data }: any) =>
      data.map((value: any, index: number) => (
        <SvgText
          key={index}
          x={x(index) + bandwidth / 2}
          y={y(value.value) - 5}
          fontSize={10}
          fill={COLORS.black}
          alignmentBaseline="middle"
          textAnchor="middle"
          fontFamily={FONTS.YellixThin}
        >
          {value.value}
        </SvgText>
      ));

    return (
      <View style={styles.radialChartContainer}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingVertical: 20,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={{ width: screenWidth - 80 }}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <View>
              <BarChart
                style={{ height: 200, width: chartWidth }}
                data={chartDataForKit}
                yAccessor={({ item }: { item: { value: number } }) =>
                  item.value
                }
                contentInset={{ top: 30, bottom: 10 }}
                spacing={0.2}
                gridMin={0}
                gridMax={maxValue * 1.1}
              >
                <ValueLabels />
              </BarChart>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: chartWidth,
                  marginTop: 10,
                }}
              >
                {chartData_13.map((item: any, index: number) => (
                  <View key={index} style={{ flex: 1, alignItems: "center" }}>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 9,
                        color: COLORS.black,
                        fontFamily: FONTS.YellixThin,
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };
  const BarChart_6 = () => {
    if (
      chartData_14.reduce((sum: any, item: any) => sum + item.value, 0) <= 0
    ) {
      return (
        <View style={styles.radialChartContainer}>
          <View style={styles.progressCirclesContainer}>
            <Text style={styles.centerText}>0</Text>
            <Text style={styles.centerSubText}>No Data</Text>
          </View>
        </View>
      );
    }

    const chartDataForKit = chartData_14.map((item: any) => ({
      value: item.value,
      svg: { fill: COLORS.secondaryBlue },
      label: item.name,
    }));

    const maxValue = Math.max(...chartData_14.map((item: any) => item.value));
    const minBarWidth = 40;
    const calculatedWidth = chartData_14.length * minBarWidth + 100;
    const chartWidth = Math.max(screenWidth - 80, calculatedWidth);

    const ValueLabels = ({ x, y, bandwidth, data }: any) =>
      data.map((value: any, index: number) => (
        <SvgText
          key={index}
          x={x(index) + bandwidth / 2}
          y={y(value.value) - 5}
          fontSize={10}
          fill={COLORS.black}
          alignmentBaseline="middle"
          textAnchor="middle"
          fontFamily={FONTS.YellixThin}
        >
          {value.value}
        </SvgText>
      ));

    return (
      <View style={styles.radialChartContainer}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingVertical: 20,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={{ width: screenWidth - 80 }}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <View>
              <BarChart
                style={{ height: 200, width: chartWidth }}
                data={chartDataForKit}
                yAccessor={({ item }: { item: { value: number } }) =>
                  item.value
                }
                contentInset={{ top: 30, bottom: 10 }}
                spacing={0.2}
                gridMin={0}
                gridMax={maxValue * 1.1}
              >
                <ValueLabels />
              </BarChart>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: chartWidth,
                  marginTop: 10,
                }}
              >
                {chartData_14.map((item: any, index: number) => (
                  <View key={index} style={{ flex: 1, alignItems: "center" }}>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 9,
                        color: COLORS.black,
                        fontFamily: FONTS.YellixThin,
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };
  const BarChart_7 = () => {
    if (
      chartData_15.reduce((sum: any, item: any) => sum + item.value, 0) <= 0
    ) {
      return (
        <View style={styles.radialChartContainer}>
          <View style={styles.progressCirclesContainer}>
            <Text style={styles.centerText}>0</Text>
            <Text style={styles.centerSubText}>No Data</Text>
          </View>
        </View>
      );
    }

    const chartDataForKit = chartData_15.map((item: any) => ({
      value: item.value,
      svg: { fill: COLORS.secondaryBlue },
      label: item.name,
    }));

    const maxValue = Math.max(...chartData_15.map((item: any) => item.value));
    const minBarWidth = 40;
    const calculatedWidth = chartData_15.length * minBarWidth + 100;
    const chartWidth = Math.max(screenWidth - 80, calculatedWidth);

    const ValueLabels = ({ x, y, bandwidth, data }: any) =>
      data.map((value: any, index: number) => (
        <SvgText
          key={index}
          x={x(index) + bandwidth / 2}
          y={y(value.value) - 5}
          fontSize={10}
          fill={COLORS.black}
          alignmentBaseline="middle"
          textAnchor="middle"
          fontFamily={FONTS.YellixThin}
        >
          {value.value}
        </SvgText>
      ));

    return (
      <View style={styles.radialChartContainer}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingVertical: 20,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={{ width: screenWidth - 80 }}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <View>
              <BarChart
                style={{ height: 200, width: chartWidth }}
                data={chartDataForKit}
                yAccessor={({ item }: { item: { value: number } }) =>
                  item.value
                }
                contentInset={{ top: 30, bottom: 10 }}
                spacing={0.2}
                gridMin={0}
                gridMax={maxValue * 1.1}
              >
                <ValueLabels />
              </BarChart>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: chartWidth,
                  marginTop: 10,
                }}
              >
                {chartData_15.map((item: any, index: number) => (
                  <View key={index} style={{ flex: 1, alignItems: "center" }}>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 9,
                        color: COLORS.black,
                        fontFamily: FONTS.YellixThin,
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };
  const BarChart_8 = () => {
    if (
      chartData_16.reduce((sum: any, item: any) => sum + item.value, 0) <= 0
    ) {
      return (
        <View style={styles.radialChartContainer}>
          <View style={styles.progressCirclesContainer}>
            <Text style={styles.centerText}>0</Text>
            <Text style={styles.centerSubText}>No Data</Text>
          </View>
        </View>
      );
    }

    const chartDataForKit = chartData_16.map((item: any) => ({
      value: item.value,
      svg: { fill: COLORS.secondaryBlue },
      label: item.name,
    }));

    const maxValue = Math.max(...chartData_16.map((item: any) => item.value));
    const minBarWidth = 40;
    const calculatedWidth = chartData_16.length * minBarWidth + 100;
    const chartWidth = Math.max(screenWidth - 80, calculatedWidth);

    const ValueLabels = ({ x, y, bandwidth, data }: any) =>
      data.map((value: any, index: number) => (
        <SvgText
          key={index}
          x={x(index) + bandwidth / 2}
          y={y(value.value) - 5}
          fontSize={10}
          fill={COLORS.black}
          alignmentBaseline="middle"
          textAnchor="middle"
          fontFamily={FONTS.YellixThin}
        >
          {value.value}
        </SvgText>
      ));

    return (
      <View style={styles.radialChartContainer}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingVertical: 20,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={{ width: screenWidth - 80 }}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <View>
              <BarChart
                style={{ height: 200, width: chartWidth }}
                data={chartDataForKit}
                yAccessor={({ item }: { item: { value: number } }) =>
                  item.value
                }
                contentInset={{ top: 30, bottom: 10 }}
                spacing={0.2}
                gridMin={0}
                gridMax={maxValue * 1.1}
              >
                <ValueLabels />
              </BarChart>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: chartWidth,
                  marginTop: 10,
                }}
              >
                {chartData_16.map((item: any, index: number) => (
                  <View key={index} style={{ flex: 1, alignItems: "center" }}>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 9,
                        color: COLORS.black,
                        fontFamily: FONTS.YellixThin,
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };
  const BarChart_9 = () => {
    if (
      chartData_19.reduce((sum: any, item: any) => sum + item.value, 0) <= 0
    ) {
      return (
        <View style={styles.radialChartContainer}>
          <View style={styles.progressCirclesContainer}>
            <Text style={styles.centerText}>0</Text>
            <Text style={styles.centerSubText}>No Data</Text>
          </View>
        </View>
      );
    }

    const chartDataForKit = chartData_19.map((item: any) => ({
      value: item.value,
      svg: { fill: COLORS.secondaryBlue },
      label: item.name,
    }));

    const maxValue = Math.max(...chartData_19.map((item: any) => item.value));
    const minBarWidth = 40;
    const calculatedWidth = chartData_16.length * minBarWidth + 100;
    const chartWidth = Math.max(screenWidth - 80, calculatedWidth);

    const ValueLabels = ({ x, y, bandwidth, data }: any) =>
      data.map((value: any, index: number) => (
        <SvgText
          key={index}
          x={x(index) + bandwidth / 2}
          y={y(value.value) - 5}
          fontSize={10}
          fill={COLORS.black}
          alignmentBaseline="middle"
          textAnchor="middle"
          fontFamily={FONTS.YellixThin}
        >
          {value.value}
        </SvgText>
      ));

    return (
      <View style={styles.radialChartContainer}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingVertical: 20,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={{ width: screenWidth - 80 }}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <View>
              <BarChart
                style={{ height: 200, width: chartWidth }}
                data={chartDataForKit}
                yAccessor={({ item }: { item: { value: number } }) =>
                  item.value
                }
                contentInset={{ top: 30, bottom: 10 }}
                spacing={0.2}
                gridMin={0}
                gridMax={maxValue * 1.1}
              >
                <ValueLabels />
              </BarChart>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: chartWidth,
                  marginTop: 10,
                }}
              >
                {chartData_19.map((item: any, index: number) => (
                  <View key={index} style={{ flex: 1, alignItems: "center" }}>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 9,
                        color: COLORS.black,
                        fontFamily: FONTS.YellixThin,
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };
  const BarChart_10 = () => {
    if (
      chartData_20.reduce((sum: any, item: any) => sum + item.value, 0) <= 0
    ) {
      return (
        <View style={styles.radialChartContainer}>
          <View style={styles.progressCirclesContainer}>
            <Text style={styles.centerText}>0</Text>
            <Text style={styles.centerSubText}>No Data</Text>
          </View>
        </View>
      );
    }

    const chartDataForKit = chartData_20.map((item: any) => ({
      value: item.value,
      svg: { fill: COLORS.secondaryBlue },
      label: item.name,
    }));

    const maxValue = Math.max(...chartData_20.map((item: any) => item.value));
    const minBarWidth = 40;
    const calculatedWidth = chartData_20.length * minBarWidth + 100;
    const chartWidth = Math.max(screenWidth - 80, calculatedWidth);

    const ValueLabels = ({ x, y, bandwidth, data }: any) =>
      data.map((value: any, index: number) => (
        <SvgText
          key={index}
          x={x(index) + bandwidth / 2}
          y={y(value.value) - 5}
          fontSize={10}
          fill={COLORS.black}
          alignmentBaseline="middle"
          textAnchor="middle"
          fontFamily={FONTS.YellixThin}
        >
          {value.value}
        </SvgText>
      ));

    return (
      <View style={styles.radialChartContainer}>
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: "100%",
            paddingVertical: 20,
          }}
        >
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={true}
            style={{ width: screenWidth - 80 }}
            contentContainerStyle={{ paddingRight: 20 }}
          >
            <View>
              <BarChart
                style={{ height: 200, width: chartWidth }}
                data={chartDataForKit}
                yAccessor={({ item }: { item: { value: number } }) =>
                  item.value
                }
                contentInset={{ top: 30, bottom: 10 }}
                spacing={0.2}
                gridMin={0}
                gridMax={maxValue * 1.1}
              >
                <ValueLabels />
              </BarChart>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: chartWidth,
                  marginTop: 10,
                }}
              >
                {chartData_20.map((item: any, index: number) => (
                  <View key={index} style={{ flex: 1, alignItems: "center" }}>
                    <Text
                      style={{
                        textAlign: "center",
                        fontSize: 9,
                        color: COLORS.black,
                        fontFamily: FONTS.YellixThin,
                      }}
                    >
                      {item.name}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    );
  };

  const HorizontalStackedBarChart_1 = () => {
    // Handle empty data
    if (
      chartData_11.length === 0 ||
      chartData_11.reduce(
        (sum: any, item: any) =>
          sum + item.value2 + item.value3 + item.value4 + item.value5,
        0,
      ) <= 0
    ) {
      return (
        <View style={styles.radialChartContainer}>
          <View style={styles.progressCirclesContainer}>
            <Text style={styles.centerText}>0</Text>
            <Text style={styles.centerSubText}>No Data</Text>
          </View>
        </View>
      );
    }

    const keys = ["value2", "value3", "value4", "value5"];

    // Transform data for StackedBarChart
    const data = chartData_11.map((item: any) => ({
      value2: item.value2,
      value3: item.value3,
      value4: item.value4,
      value5: item.value5,
    }));

    const ValueLabels = ({ x, y, bandwidth, data }: any) => {
      return data.map((values: any, dataIndex: number) => {
        let cumulativeValue = 0;
        return keys.map((key, keyIndex) => {
          const value = values[key];
          const xPos = x(cumulativeValue + value / 2);
          cumulativeValue += value;

          return (
            <SvgText
              key={`${dataIndex}-${keyIndex}`}
              x={xPos}
              y={y(dataIndex) + bandwidth / 2}
              fontSize={10}
              fill="white"
              alignmentBaseline="middle"
              textAnchor="middle"
              fontFamily={FONTS.YellixMedium}
            >
              {value > 0 ? value : ""}
            </SvgText>
          );
        });
      });
    };
    const barHeight = 35;
    const chartHeight = chartData_11.length * barHeight;

    // show max 6 rows before scrolling
    const maxVisibleBars = 6;
    const maxVisibleHeight = barHeight * maxVisibleBars;
    // Use actual chart height if less than max, to avoid extra space
    const scrollViewHeight = Math.min(chartHeight + 20, maxVisibleHeight);

    return (
      <View style={{ paddingVertical: 10 }}>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={chartData_11.length > maxVisibleBars}
          style={{ maxHeight: scrollViewHeight }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            {/* Y-axis labels (names) */}
            <View
              style={{
                width: responsiveWidth(25),
                paddingRight: 8,
              }}
            >
              {chartData_11.map((item: any, index: number) => (
                <View
                  key={index}
                  style={{
                    height: barHeight,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: COLORS.black,
                      fontFamily: FONTS.YellixThin,
                      textAlign: "right",
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.name}
                  </Text>
                </View>
              ))}
            </View>

            {/* Stacked Bar Chart */}
            <View style={{ width: responsiveWidth(65), paddingRight: 5 }}>
              <StackedBarChart
                style={{ height: chartHeight, width: responsiveWidth(65) }}
                keys={keys}
                colors={colors}
                data={data}
                contentInset={{ top: 0, bottom: 0, left: 5, right: 15 }}
                horizontal={true}
              >
                <ValueLabels />
              </StackedBarChart>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };
  const HorizontalStackedBarChart_2 = () => {
    // Handle empty data
    if (
      chartData_12.length === 0 ||
      chartData_12.reduce(
        (sum: any, item: any) =>
          sum +
          item.value1 +
          item.value2 +
          item.value3 +
          item.value4 +
          item.value5,
        0,
      ) <= 0
    ) {
      return (
        <View style={styles.radialChartContainer}>
          <View style={styles.progressCirclesContainer}>
            <Text style={styles.centerText}>0</Text>
            <Text style={styles.centerSubText}>No Data</Text>
          </View>
        </View>
      );
    }

    const keys = ["value1", "value2", "value3", "value4", "value5"];

    // Transform data for StackedBarChart
    const data = chartData_12.map((item: any) => ({
      value1: item.value1,
      value2: item.value2,
      value3: item.value3,
      value4: item.value4,
      value5: item.value5,
    }));

    const ValueLabels = ({ x, y, bandwidth, data }: any) => {
      return data.map((values: any, dataIndex: number) => {
        let cumulativeValue = 0;
        return keys.map((key, keyIndex) => {
          const value = values[key];
          const xPos = x(cumulativeValue + value / 2);
          cumulativeValue += value;

          return (
            <SvgText
              key={`${dataIndex}-${keyIndex}`}
              x={xPos}
              y={y(dataIndex) + bandwidth / 2}
              fontSize={10}
              fill="white"
              alignmentBaseline="middle"
              textAnchor="middle"
              fontFamily={FONTS.YellixMedium}
            >
              {value > 0 ? value : ""}
            </SvgText>
          );
        });
      });
    };

    const barHeight = 35;
    const chartHeight = chartData_12.length * barHeight;

    // show max 7 rows before scrolling
    const maxVisibleBars = 7;
    const maxVisibleHeight = barHeight * maxVisibleBars;
    // Use actual chart height if less than max, to avoid extra space
    const scrollViewHeight = Math.min(chartHeight + 20, maxVisibleHeight);

    return (
      <View style={{ paddingVertical: 10 }}>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={chartData_12.length > maxVisibleBars}
          style={{ maxHeight: scrollViewHeight }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            {/* Y-axis labels */}
            <View
              style={{
                width: responsiveWidth(25),
                paddingRight: 8,
              }}
            >
              {chartData_12.map((item: any, index: number) => (
                <View
                  key={index}
                  style={{
                    height: barHeight,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: COLORS.black,
                      fontFamily: FONTS.YellixThin,
                      textAlign: "right",
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.name}
                  </Text>
                </View>
              ))}
            </View>

            {/* Stacked Bar Chart */}
            <View style={{ width: responsiveWidth(65), paddingRight: 5 }}>
              <StackedBarChart
                style={{ height: chartHeight, width: responsiveWidth(65) }}
                keys={keys}
                colors={colors}
                data={data}
                contentInset={{ top: 0, bottom: 0, left: 5, right: 15 }}
                horizontal={true}
              >
                <ValueLabels />
              </StackedBarChart>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };
  const HorizontalStackedBarChart_3 = () => {
    // Handle empty data
    if (chartData_7.reduce((sum: any, item: any) => sum + item.value, 0) <= 0) {
      return (
        <View style={styles.radialChartContainer}>
          <View style={styles.progressCirclesContainer}>
            <Text style={styles.centerText}>0</Text>
            <Text style={styles.centerSubText}>No Data</Text>
          </View>
        </View>
      );
    }

    const barHeight = 25;
    const chartHeight = chartData_7.length * barHeight;

    const maxVisibleBars = 6;
    const maxVisibleHeight = barHeight * maxVisibleBars;
    const scrollViewHeight = Math.min(chartHeight + 20, maxVisibleHeight);

    const maxValue = Math.max(...chartData_7.map((item: any) => item.value));

    return (
      <View style={{ paddingVertical: 10 }}>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={chartData_7.length > maxVisibleBars}
          style={{ maxHeight: scrollViewHeight }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            {/* Y-axis labels (names) */}
            <View
              style={{
                width: responsiveWidth(25),
                paddingRight: 8,
              }}
            >
              {chartData_7.map((item: any, index: number) => (
                <View
                  key={index}
                  style={{
                    height: barHeight,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: COLORS.black,
                      fontFamily: FONTS.YellixThin,
                      textAlign: "right",
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.name}
                  </Text>
                </View>
              ))}
            </View>

            {/* Horizontal Bars */}
            <View style={{ width: responsiveWidth(65), paddingRight: 5 }}>
              {chartData_7.map((item: any, index: number) => {
                const barWidth = (item.value / maxValue) * 100;
                return (
                  <View
                    key={index}
                    style={{
                      height: barHeight,
                      justifyContent: "center",
                      // marginBottom: 0,
                    }}
                  >
                    <View
                      style={{
                        height: 25,
                        width: `${barWidth}%`,
                        backgroundColor: item.color,
                        borderRadius: 4,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 10,
                          color: COLORS.white,
                          fontFamily: FONTS.YellixMedium,
                        }}
                      >
                        {item.value}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };
  const HorizontalStackedBarChart_4 = ({
    graphData,
  }: {
    graphData: Array<any>;
  }) => {
    // Handle empty data
    if (
      graphData.length === 0 ||
      graphData.reduce(
        (sum: any, item: any) =>
          sum + item.value2 + item.value3 + item.value4 + item.value5,
        0,
      ) <= 0
    ) {
      return (
        <View style={styles.radialChartContainer}>
          <View style={styles.progressCirclesContainer}>
            <Text style={styles.centerText}>0</Text>
            <Text style={styles.centerSubText}>No Data</Text>
          </View>
        </View>
      );
    }

    const keys = ["value2", "value3", "value4", "value5"];

    // Transform data for StackedBarChart
    const data = graphData.map((item: any) => ({
      value2: item.value2,
      value3: item.value3,
      value4: item.value4,
      value5: item.value5,
    }));

    const ValueLabels = ({ x, y, bandwidth, data }: any) => {
      return data.map((values: any, dataIndex: number) => {
        let cumulativeValue = 0;
        return keys.map((key, keyIndex) => {
          const value = values[key];
          const xPos = x(cumulativeValue + value / 2);
          cumulativeValue += value;

          return (
            <SvgText
              key={`${dataIndex}-${keyIndex}`}
              x={xPos}
              y={y(dataIndex) + bandwidth / 2}
              fontSize={10}
              fill="white"
              alignmentBaseline="middle"
              textAnchor="middle"
              fontFamily={FONTS.YellixMedium}
            >
              {value > 0 ? value : ""}
            </SvgText>
          );
        });
      });
    };
    const barHeight = 35;
    const chartHeight = graphData.length * barHeight;

    // show max 6 rows before scrolling
    const maxVisibleBars = 6;
    const maxVisibleHeight = barHeight * maxVisibleBars;
    // Use actual chart height if less than max, to avoid extra space
    const scrollViewHeight = Math.min(chartHeight + 20, maxVisibleHeight);

    return (
      <View style={{ paddingVertical: 10 }}>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={chartData_11.length > maxVisibleBars}
          style={{ maxHeight: scrollViewHeight }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            {/* Y-axis labels (names) */}
            <View
              style={{
                width: responsiveWidth(25),
                paddingRight: 8,
              }}
            >
              {graphData.map((item: any, index: number) => (
                <View
                  key={index}
                  style={{
                    height: barHeight,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: COLORS.black,
                      fontFamily: FONTS.YellixThin,
                      textAlign: "right",
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.name}
                  </Text>
                </View>
              ))}
            </View>

            {/* Stacked Bar Chart */}
            <View style={{ width: responsiveWidth(65), paddingRight: 5 }}>
              <StackedBarChart
                style={{ height: chartHeight, width: responsiveWidth(65) }}
                keys={keys}
                colors={colors}
                data={data}
                contentInset={{ top: 0, bottom: 0, left: 5, right: 15 }}
                horizontal={true}
              >
                <ValueLabels />
              </StackedBarChart>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };
  const HorizontalStackedBarChart_5 = () => {
    // Handle empty data
    if (
      chartData_18.length === 0 ||
      chartData_18.reduce(
        (sum: any, item: any) =>
          sum +
          item.value1 +
          item.value2 +
          item.value3 +
          item.value4 +
          item.value5,
        0,
      ) <= 0
    ) {
      return (
        <View style={styles.radialChartContainer}>
          <View style={styles.progressCirclesContainer}>
            <Text style={styles.centerText}>0</Text>
            <Text style={styles.centerSubText}>No Data</Text>
          </View>
        </View>
      );
    }

    const keys = ["value1", "value2", "value3", "value4", "value5"];

    // Transform data for StackedBarChart
    const data = chartData_18.map((item: any) => ({
      value1: item.value1,
      value2: item.value2,
      value3: item.value3,
      value4: item.value4,
      value5: item.value5,
    }));

    const ValueLabels = ({ x, y, bandwidth, data }: any) => {
      return data.map((values: any, dataIndex: number) => {
        let cumulativeValue = 0;
        return keys.map((key, keyIndex) => {
          const value = values[key];
          const xPos = x(cumulativeValue + value / 2);
          cumulativeValue += value;

          return (
            <SvgText
              key={`${dataIndex}-${keyIndex}`}
              x={xPos}
              y={y(dataIndex) + bandwidth / 2}
              fontSize={10}
              fill="white"
              alignmentBaseline="middle"
              textAnchor="middle"
              fontFamily={FONTS.YellixMedium}
            >
              {value > 0 ? value : ""}
            </SvgText>
          );
        });
      });
    };

    const barHeight = 35;
    const chartHeight = chartData_18.length * barHeight;

    // show max 7 rows before scrolling
    const maxVisibleBars = 7;
    const maxVisibleHeight = barHeight * maxVisibleBars;
    // Use actual chart height if less than max, to avoid extra space
    const scrollViewHeight = Math.min(chartHeight + 20, maxVisibleHeight);

    return (
      <View style={{ paddingVertical: 10 }}>
        <ScrollView
          nestedScrollEnabled={true}
          showsVerticalScrollIndicator={chartData_18.length > maxVisibleBars}
          style={{ maxHeight: scrollViewHeight }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-start",
              width: "100%",
            }}
          >
            {/* Y-axis labels */}
            <View
              style={{
                width: responsiveWidth(25),
                paddingRight: 8,
              }}
            >
              {chartData_18.map((item: any, index: number) => (
                <View
                  key={index}
                  style={{
                    height: barHeight,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 10,
                      color: COLORS.black,
                      fontFamily: FONTS.YellixThin,
                      textAlign: "right",
                    }}
                    numberOfLines={1}
                    ellipsizeMode="tail"
                  >
                    {item.name}
                  </Text>
                </View>
              ))}
            </View>

            {/* Stacked Bar Chart */}
            <View style={{ width: responsiveWidth(65), paddingRight: 5 }}>
              <StackedBarChart
                style={{ height: chartHeight, width: responsiveWidth(65) }}
                keys={keys}
                colors={colors}
                data={data}
                contentInset={{ top: 0, bottom: 0, left: 5, right: 15 }}
                horizontal={true}
              >
                <ValueLabels />
              </StackedBarChart>
            </View>
          </View>
        </ScrollView>
      </View>
    );
  };

  return (
    <SafeAreaView style={allStyles.safeArea} edges={["top"]}>
      <ScrollView
        style={[allStyles.container]}
        // contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={true}
      >
        {/* Header Section */}
        <View style={styles.headingContainer}>
          <View style={styles.headingTextContainer}>
            <View style={[styles.headingText, { flex: 1, flexShrink: 1 }]}>
              <Text
                style={styles.UserStyle}
                numberOfLines={3}
                ellipsizeMode="tail"
              >
                Hello{" "}
                {user?.name
                  ? user.name
                      .split(" ")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase(),
                      )
                      .join(" ")
                  : ""}
              </Text>
            </View>
            {user?.mainDealerRef?.name && (
              <Text
                style={styles.UserDealerStyle}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {user?.mainDealerRef?.name}
              </Text>
            )}
          </View>
          <HeaderIcon />
        </View>
        {/* filter button */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: responsiveWidth(6),
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
            {chartData_1.map((item, index) => (
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
            <PieChart_1 />
          </View>
        </View>
        {/* Delivery VS Accessories Card */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>Delivery VS Accessories </Text>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            {chartData_2.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>{item.name}</Text>
                <Text style={styles.legendValue}>
                  {item.value1}
                  {` / ₹${item.value2}`}
                </Text>
              </View>
            ))}
          </View>

          {/* Progress Chart2 */}
          <View style={styles.chartContainer}>
            <PieChart_2 />
          </View>
        </View>
        {/* Delivery VS RSA Card */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>Delivery VS RSA</Text>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            {chartData_3.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>{item.name}</Text>
                <Text style={styles.legendValue}>
                  {item.value1}
                  {` / ₹${item.value2}`}
                </Text>
              </View>
            ))}
          </View>

          {/* Progress Chart2 */}
          <View style={styles.chartContainer}>
            <PieChart_3 />
          </View>
        </View>
        {/* Delivery VS Helmet Card */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>Delivery VS Helmet</Text>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            {chartData_4.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>{item.name}</Text>
                <Text style={styles.legendValue}>
                  {item.value1}
                  {` / ₹${item.value2}`}
                </Text>
              </View>
            ))}
          </View>

          {/* Progress Chart4 */}
          <View style={styles.chartContainer}>
            <PieChart_4 />
          </View>
        </View>
        {/* Delivery VS Discount & Scheme Discount Card */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>
              Delivery VS Discount & Scheme Discount
            </Text>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            {chartData_5.map((item, index) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>{item.name}</Text>
                <Text style={styles.legendValue}>
                  {item.name == "Deliveries" ? item.value : `${item.value}`}
                </Text>
              </View>
            ))}
          </View>

          {/* Progress Chart4 */}
          <View style={styles.chartContainer}>
            <BarChart_1 />
          </View>
        </View>
        {/* Delivery Location Wise Card */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>Delivery Location Wise</Text>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: COLORS.secondaryBlue },
                ]}
              />
              <Text style={styles.legendText}>Count</Text>
            </View>
          </View>

          {/* Progress Chart4 */}
          <View style={styles.chartContainer}>
            <BarChart_2 />
          </View>
        </View>
        {/* Delivery Model wise  Card */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>Delivery Model wise</Text>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: COLORS.secondaryBlue },
                ]}
              />
              <Text style={styles.legendText}>Count</Text>
            </View>
          </View>

          {/* Progress Chart4 */}
          <View style={styles.chartContainer}>
            <HorizontalStackedBarChart_3 />
          </View>
        </View>
        {/* Model Wise Average Discount */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>
              Model Wise Average Discount
            </Text>
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: COLORS.secondaryBlue },
                ]}
              />
              <Text style={styles.legendText}>Avg Discount</Text>
            </View>
          </View>

          <View style={[styles.chartContainer, { marginBottom: 20 }]}>
            <BarChart_7 />
          </View>
        </View>

        {/* Delivery RTO Location (Same City, Other City/Same State, Other State)  */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>Delivery RTO Location</Text>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: COLORS.secondaryBlue },
                ]}
              />
              <Text style={styles.legendText}>Count</Text>
            </View>
          </View>

          {/* Progress Chart4 */}
          <View style={styles.chartContainer}>
            <BarChart_4 />
          </View>
        </View>
        {/* Delivery Financier Overview  */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>
              Delivery Financier Overview{" "}
            </Text>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            {chartData_9.map((item, index) => (
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
            <PieChart_6 />
          </View>
        </View>
        {/* Delivery Financier Wise  */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>Delivery Financier Wise </Text>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: COLORS.secondaryBlue },
                ]}
              />
              <Text style={styles.legendText}>Count</Text>
            </View>
          </View>
          {/* Progress Chart4 */}
          <View style={styles.chartContainer}>
            <BarChart_3 />
          </View>
        </View>
        {/* Sales Executive Performance - Horizontal Stacked Bar Chart */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>
              Sales Executive Performance (%)
            </Text>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            {/* <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[0] }]}
              />
              <Text style={styles.legendText}>Deliveries</Text>
            </View> */}
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[0] }]}
              />
              <Text style={styles.legendText}>Accessories</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[1] }]}
              />
              <Text style={styles.legendText}>RSA</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[2] }]}
              />
              <Text style={styles.legendText}>Helmet</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[3] }]}
              />
              <Text style={styles.legendText}>Loyality Card</Text>
            </View>
          </View>

          {/* Horizontal Stacked Bar Chart */}
          <View style={styles.chartContainer}>
            <HorizontalStackedBarChart_1 />
          </View>
        </View>
        {/* Sales Executive Performance - Horizontal Stacked Bar Chart */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>
              Sales Executive Performance (Total)
            </Text>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[0] }]}
              />
              <Text style={styles.legendText}>Deliveries</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[1] }]}
              />
              <Text style={styles.legendText}>Accessories</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[2] }]}
              />
              <Text style={styles.legendText}>RSA</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[3] }]}
              />
              <Text style={styles.legendText}>Helmet</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[4] }]}
              />
              <Text style={styles.legendText}>Loyality Card</Text>
            </View>
          </View>

          {/* Horizontal Stacked Bar Chart */}
          <View style={[styles.chartContainer, { marginBottom: 20 }]}>
            <HorizontalStackedBarChart_2 />
          </View>
        </View>
        {/* Sales Executive Wise Discount */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>
              Sales Executive Wise Avg Discount
            </Text>
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: COLORS.secondaryBlue },
                ]}
              />
              <Text style={styles.legendText}>Avg Discount</Text>
            </View>
          </View>

          <View style={styles.chartContainer}>
            <BarChart_5 />
          </View>
        </View>
        {/* Sales Executive Wise Scheme Discount */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>
              Sales Executive Wise Avg Scheme Discount
            </Text>
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: COLORS.secondaryBlue },
                ]}
              />
              <Text style={styles.legendText}>Avg Scheme Discount</Text>
            </View>
          </View>

          <View style={[styles.chartContainer, { marginBottom: 20 }]}>
            <BarChart_6 />
          </View>
        </View>
        {/* Sales Executive Wise Delivery */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>
              Sales Executive Wise Delivery
            </Text>
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: COLORS.secondaryBlue },
                ]}
              />
              <Text style={styles.legendText}>Deliveries</Text>
            </View>
          </View>

          <View style={[styles.chartContainer, { marginBottom: 20 }]}>
            <BarChart_8 />
          </View>
        </View>
        {/* Financier Performance (%) */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>Financier Performance (%)</Text>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            {/* <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[0] }]}
              />
              <Text style={styles.legendText}>Deliveries</Text>
            </View> */}
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[0] }]}
              />
              <Text style={styles.legendText}>Accessories</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[1] }]}
              />
              <Text style={styles.legendText}>RSA</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[2] }]}
              />
              <Text style={styles.legendText}>Helmet</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[3] }]}
              />
              <Text style={styles.legendText}>Loyality Card</Text>
            </View>
          </View>

          {/* Horizontal Stacked Bar Chart */}
          <View style={styles.chartContainer}>
            <HorizontalStackedBarChart_4 graphData={chartData_17} />
          </View>
        </View>
        {/* Financier Performance (Total) */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>
              Financier Performance (Total)
            </Text>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[0] }]}
              />
              <Text style={styles.legendText}>Deliveries</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[1] }]}
              />
              <Text style={styles.legendText}>Accessories</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[2] }]}
              />
              <Text style={styles.legendText}>RSA</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[3] }]}
              />
              <Text style={styles.legendText}>Helmet</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: colors[4] }]}
              />
              <Text style={styles.legendText}>Loyality Card</Text>
            </View>
          </View>

          {/* Horizontal Stacked Bar Chart */}
          <View style={[styles.chartContainer, { marginBottom: 20 }]}>
            <HorizontalStackedBarChart_5 />
          </View>
        </View>

        {/* Financier Wise Avg Discount */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>
              Financier Wise Avg Discount
            </Text>
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: COLORS.secondaryBlue },
                ]}
              />
              <Text style={styles.legendText}>Avg Discount</Text>
            </View>
          </View>

          <View style={[styles.chartContainer, { marginBottom: 20 }]}>
            <BarChart_9 />
          </View>
        </View>
        {/* Financier Wise Avg Scheme Discount */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>
              Financier Wise Avg Scheme Discount
            </Text>
          </View>

          <View style={styles.legendContainer}>
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: COLORS.secondaryBlue },
                ]}
              />
              <Text style={styles.legendText}>Avg Scheme Discount</Text>
            </View>
          </View>

          <View style={[styles.chartContainer, { marginBottom: 20 }]}>
            <BarChart_10 />
          </View>
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      {/* <TouchableOpacity
        onPress={() => {
          setIsEdit(false);
          router.push("/add-delivery");
        }}
        style={allStyles.floatingButton}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity> */}
      <Toast />

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

              {/* Executive Dropdown */}
              <TouchableOpacity
                style={[globalStyles.input, styles.dropdownButton]}
                onPress={() => setShowUserModal(true)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    allStyles.dropdownText,
                    selectedExecutives.length > 0
                      ? { color: COLORS.black }
                      : null,
                  ]}
                >
                  {selectedExecutives.length > 0
                    ? executives
                        .filter((exec) =>
                          selectedExecutives.includes(exec.id || exec._id),
                        )
                        .map((exec) => exec.name)
                        .join(", ") || "Select Executive"
                    : "Select Executive"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#6C757D" />
              </TouchableOpacity>

              {/* Financier Dropdown */}
              <TouchableOpacity
                style={[globalStyles.input, styles.dropdownButton]}
                onPress={() => setShowModelModal(true)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    allStyles.dropdownText,
                    selectedFinanciers.length > 0
                      ? { color: COLORS.black }
                      : null,
                  ]}
                >
                  {selectedFinanciers.length > 0
                    ? financiers
                        .filter((financier) =>
                          selectedFinanciers.includes(
                            financier.id || financier._id,
                          ),
                        )
                        .map((financier) => financier.name)
                        .join(", ") || "Select Financier"
                    : "Select Financier"}
                </Text>
                <Ionicons name="chevron-down" size={20} color="#6C757D" />
              </TouchableOpacity>

              {/* Including Cash Checkbox */}
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  // paddingVertical: 12,
                  // marginTop: 16,
                }}
                onPress={() => {
                  setCurrentFilters((prev) => ({
                    ...prev,
                    includingCash: !prev.includingCash,
                  }));
                }}
                activeOpacity={0.7}
              >
                <View
                  style={[
                    {
                      width: 20,
                      height: 20,
                      borderWidth: 2,
                      borderColor: "#6C757D",
                      borderRadius: 4,
                      marginRight: 12,
                      justifyContent: "center",
                      alignItems: "center",
                    },
                    currentFilters.includingCash && {
                      backgroundColor: COLORS.primaryBlue,
                      borderColor: COLORS.primaryBlue,
                    },
                  ]}
                >
                  {currentFilters.includingCash && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 12,
                    color: COLORS.black,
                    fontFamily: FONTS.YellixThin,
                  }}
                >
                  Including Cash
                </Text>
              </TouchableOpacity>
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
                maxDate={new Date().toISOString().split("T")[0]} // Today's date
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
      {/* Executives Selection Modal - Center of screen */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showUserModal}
        onRequestClose={() => setShowUserModal(false)}
      >
        <View style={styles.modelModalOverlay}>
          <View style={styles.modelModalContent}>
            <View style={styles.modelModalHeader}>
              <Text style={styles.modelModalTitle}>Select Executives</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowUserModal(false)}
              >
                <Ionicons name="close" size={24} color="#6C757D" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modelScrollView}
              showsVerticalScrollIndicator={false}
            >
              {/* Select All Option */}
              <TouchableOpacity
                style={[
                  styles.modelOption,
                  selectedExecutives.length === executives.length &&
                    styles.selectedModelOption,
                ]}
                onPress={() => {
                  if (selectedExecutives.length === executives.length) {
                    setSelectedExecutives([]);
                    setCurrentFilters((prev) => ({
                      ...prev,
                      userRef: [],
                    }));
                  } else {
                    const allIds = executives.map(
                      (exec) => exec.id || exec._id,
                    );
                    setSelectedExecutives(allIds);
                    setCurrentFilters((prev) => ({
                      ...prev,
                      userRef: allIds,
                    }));
                  }
                }}
              >
                <Text
                  style={[
                    styles.modelOptionText,
                    selectedExecutives.length === executives.length &&
                      styles.selectedModelText,
                  ]}
                >
                  All
                </Text>
                {selectedExecutives.length === executives.length && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={COLORS.primaryBlue}
                  />
                )}
              </TouchableOpacity>

              {Array.isArray(executives) && executives.length > 0 ? (
                executives.map((executive, index) => {
                  const executiveId = executive.id || executive._id;
                  const isSelected = selectedExecutives.includes(executiveId);

                  return (
                    <TouchableOpacity
                      key={executiveId || index}
                      style={[
                        styles.modelOption,
                        isSelected && styles.selectedModelOption,
                      ]}
                      onPress={() => {
                        console.log(
                          "Toggling executive:",
                          executive.name,
                          "ID:",
                          executiveId,
                        );
                        setSelectedExecutives((prev) => {
                          const newSelection = prev.includes(executiveId)
                            ? prev.filter((id) => id !== executiveId)
                            : [...prev, executiveId];
                          setCurrentFilters((filters) => ({
                            ...filters,
                            userRef: newSelection,
                          }));
                          return newSelection;
                        });
                      }}
                    >
                      <Text
                        style={[
                          styles.modelOptionText,
                          isSelected && styles.selectedModelText,
                        ]}
                      >
                        {executive.name}
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={COLORS.primaryBlue}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={{ padding: 20, alignItems: "center" }}>
                  <Text style={{ color: "#666", fontSize: 14 }}>
                    {executives === null || executives === undefined
                      ? "Loading executives..."
                      : "No executives available"}
                  </Text>
                </View>
              )}
            </ScrollView>
            <View style={styles.filterButtonContainer}>
              <TouchableOpacity
                style={[allStyles.btn, { marginBottom: responsiveWidth(2) }]}
                onPress={() => setShowUserModal(false)}
              >
                <Text style={allStyles.btnText}>Done</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {/* Financiers Selection Modal - Center of screen */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showModelModal}
        onRequestClose={() => setShowModelModal(false)}
      >
        <View style={styles.modelModalOverlay}>
          <View style={styles.modelModalContent}>
            <View style={styles.modelModalHeader}>
              <Text style={styles.modelModalTitle}>Select Financiers</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowModelModal(false)}
              >
                <Ionicons name="close" size={24} color="#6C757D" />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.modelScrollView}
              showsVerticalScrollIndicator={false}
            >
              {/* Select All Option */}
              <TouchableOpacity
                style={[
                  styles.modelOption,
                  selectedFinanciers.length === financiers.length &&
                    styles.selectedModelOption,
                ]}
                onPress={() => {
                  if (selectedFinanciers.length === financiers.length) {
                    setSelectedFinanciers([]);
                    setCurrentFilters((prev) => ({
                      ...prev,
                      financierRef: [],
                    }));
                  } else {
                    const allIds = financiers.map((fin) => fin.id || fin._id);
                    setSelectedFinanciers(allIds);
                    setCurrentFilters((prev) => ({
                      ...prev,
                      financierRef: allIds,
                    }));
                  }
                }}
              >
                <Text
                  style={[
                    styles.modelOptionText,
                    selectedFinanciers.length === financiers.length &&
                      styles.selectedModelText,
                  ]}
                >
                  All
                </Text>
                {selectedFinanciers.length === financiers.length && (
                  <Ionicons
                    name="checkmark"
                    size={20}
                    color={COLORS.primaryBlue}
                  />
                )}
              </TouchableOpacity>

              {Array.isArray(financiers) && financiers.length > 0 ? (
                financiers.map((financier, index) => {
                  const financierId = financier.id || financier._id;
                  const isSelected = selectedFinanciers.includes(financierId);

                  return (
                    <TouchableOpacity
                      key={financierId || index}
                      style={[
                        styles.modelOption,
                        isSelected && styles.selectedModelOption,
                      ]}
                      onPress={() => {
                        console.log(
                          "Toggling financier:",
                          financier.name,
                          "ID:",
                          financierId,
                        );
                        setSelectedFinanciers((prev) => {
                          const newSelection = prev.includes(financierId)
                            ? prev.filter((id) => id !== financierId)
                            : [...prev, financierId];
                          setCurrentFilters((filters) => ({
                            ...filters,
                            financierRef: newSelection,
                          }));
                          return newSelection;
                        });
                      }}
                    >
                      <Text
                        style={[
                          styles.modelOptionText,
                          isSelected && styles.selectedModelText,
                        ]}
                      >
                        {financier.name}
                      </Text>
                      {isSelected && (
                        <Ionicons
                          name="checkmark"
                          size={20}
                          color={COLORS.primaryBlue}
                        />
                      )}
                    </TouchableOpacity>
                  );
                })
              ) : (
                <View style={{ padding: 20, alignItems: "center" }}>
                  <Text style={{ color: "#666", fontSize: 14 }}>
                    {financiers === null || financiers === undefined
                      ? "Loading financiers..."
                      : "No financiers available"}
                  </Text>
                </View>
              )}
            </ScrollView>
            <View style={styles.filterButtonContainer}>
              <TouchableOpacity
                style={[allStyles.btn, { marginBottom: responsiveWidth(2) }]}
                onPress={() => setShowModelModal(false)}
              >
                <Text style={allStyles.btnText}>Done</Text>
              </TouchableOpacity>
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
                maxDate={new Date().toISOString().split("T")[0]} // Today's date
                minDate={currentFilters.startDate || undefined} // Minimum date is start date if selected
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
    </SafeAreaView>
  );
}
