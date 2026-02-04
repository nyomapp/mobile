import {
  getDealerGraphData,
  getExecutives,
  getFinanciers,
} from "@/src/api/dealerHome";
import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { COLORS, FONTS } from "@/src/constants";
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
import { BarChart, PieChart } from "react-native-svg-charts";
import Toast from "react-native-toast-message";
import { useAuth } from "../../contexts/AuthContext";
import { allStyles } from "../../styles/global";
import { styles } from "../../styles/homeStyles";
const screenWidth = Dimensions.get("window").width;

export default function DealerHomeScreen() {
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
    executiveRef: string[];
    financierRef: string[];
    startDate: string;
    endDate: string;
    includingCash: boolean;
  }>({
    executiveRef: [],
    financierRef: [],
    startDate: "",
    endDate: "",
    includingCash: false,
  });

  // Reset all filters on initial mount
  useEffect(() => {
    setCurrentFilters({
      executiveRef: [],
      financierRef: [],
      startDate: "",
      endDate: "",
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
    setExecutives((response as any) || []);
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
    const emptyFilters = {
      executiveRef: [],
      financierRef: [],
      startDate: "",
      endDate: "",
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
  let colors = [
    COLORS.secondaryBlue,
    "#67E8F9",
    "#10B981",
    "#F59E0B",
    "#ecb3ff",
    "#8B5CF6",
    "#EF4444",
    "#F472B6",
    "#A78BFA",
    "#60A5FA",
    "#34D399",
    "#FBBF24",
    "#FB923C",
    "#F87171",
    "#FCA5A5",
    "#FDA4AF",
    "#C084FC",
    "#A3E635",
    "#4ADE80",
    "#2DD4BF",
    "#22D3EE",
    "#38BDF8",
    "#818CF8",
    "#E879F9",
    "#F9A8D4",
    "#FCD34D",
    "#FDE047",
    "#BEF264",
    "#86EFAC",
    "#6EE7B7",
    "#5EEAD4",
    "#7DD3FC",
    "#93C5FD",
    "#A5B4FC",
    "#C4B5FD",
    "#D8B4FE",
    "#F0ABFC",
    "#FBB6CE",
    "#FECACA",
    "#FED7AA",
    "#FEF3C7",
    "#FEF08A",
    "#D9F99D",
    "#BBF7D0",
    "#99F6E4",
    "#A5F3FC",
    "#BAE6FD",
    "#BFDBFE",
    "#C7D2FE",
    "#DDD6FE",
    "#E9D5FF",
    "#F5D0FE",
    "#FBCFE8",
    "#FECDD3",
    "#FED7D7",
    "#FFEDD5",
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#FFA07A",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E2",
    "#F8B88B",
    "#52B788",
    "#FFD93D",
    "#6BCF7F",
    "#95E1D3",
    "#F38181",
    "#AA96DA",
    "#FCBAD3",
    "#FFFFD2",
    "#A8D8EA",
    "#FFAAA6",
    "#FFD3B5",
    "#DCEDC2",
    "#FFC8C8",
    "#D4A5A5",
    "#9FE2BF",
    "#40E0D0",
    "#FFB6C1",
    "#DDA0DD",
    "#87CEEB",
    "#FF69B4",
    "#BA55D3",
    "#48D1CC",
    "#FF7F50",
    "#9370DB",
    "#3CB371",
    "#FF1493",
    "#00CED1",
    "#FF4500",
    "#DA70D6",
    "#32CD32",
    "#FF6347",
    "#9932CC",
    "#00FA9A",
    "#DC143C",
    "#8A2BE2",
    "#00FF7F",
    "#B22222",
    "#9400D3",
    "#7CFC00",
    "#CD5C5C",
    "#8B008B",
    "#ADFF2F",
    "#A52A2A",
    "#9966CC",
    "#7FFF00",
    "#D2691E",
    "#BA55D3",
    "#00FF00",
    "#FF8C00",
    "#DA70D6",
    "#32CD32",
    "#FF6347",
    "#DDA0DD",
    "#228B22",
    "#FF4500",
    "#EE82EE",
    "#6B8E23",
    "#FF0000",
    "#D8BFD8",
    "#9ACD32",
    "#DC143C",
    "#DDA0DD",
    "#00FA9A",
    "#C71585",
    "#EE82EE",
    "#00FF7F",
    "#FF1493",
    "#9370DB",
    "#3CB371",
    "#FFB6C1",
    "#7B68EE",
    "#2E8B57",
    "#FFC0CB",
    "#6A5ACD",
    "#8FBC8F",
    "#FF69B4",
    "#483D8B",
    "#66CDAA",
    "#DB7093",
    "#9370DB",
    "#20B2AA",
    "#C71585",
    "#BA55D3",
    "#48D1CC",
    "#FF1493",
    "#8B008B",
    "#40E0D0",
    "#8B4789",
    "#00CED1",
    "#7B3F8B",
    "#00FFFF",
    "#6B238E",
    "#E0FFFF",
    "#9B59B6",
    "#AFEEEE",
    "#8E44AD",
    "#7FFFD4",
    "#663399",
    "#5F9EA0",
    "#4B0082",
    "#4682B4",
    "#6A0DAD",
    "#00BFFF",
    "#8A2BE2",
    "#1E90FF",
    "#9966FF",
    "#87CEEB",
    "#7B68EE",
    "#87CEFA",
    "#6495ED",
    "#B0C4DE",
    "#4169E1",
    "#ADD8E6",
    "#0000FF",
    "#B0E0E6",
    "#0000CD",
    "#AFEEEE",
    "#00008B",
    "#E0FFFF",
    "#191970",
    "#7FFFD4",
    "#1C1C8E",
    "#40E0D0",
    "#3A3A98",
    "#48D1CC",
    "#5555AA",
    "#00CED1",
    "#7070BB",
    "#00FFFF",
    "#8B8BCC",
    "#E0FFFF",
    "#A6A6DD",
    "#AFEEEE",
    "#C1C1EE",
    "#00FA9A",
    "#9B59D6",
    "#00FF7F",
    "#B19CD9",
    "#3CB371",
    "#C8A2E0",
    "#2E8B57",
    "#DDA0DD",
    "#66CDAA",
    "#EE82EE",
    "#8FBC8F",
    "#DA70D6",
    "#20B2AA",
    "#D8BFD8",
    "#48D1CC",
    "#E6E6FA",
    "#5F9EA0",
    "#F8F8FF",
    "#4682B4",
    "#F0E68C",
    "#6495ED",
    "#FAFAD2",
    "#4169E1",
    "#FFFFE0",
    "#1E90FF",
    "#FFFACD",
    "#00BFFF",
    "#FFF8DC",
    "#87CEEB",
    "#FFEBCD",
    "#87CEFA",
    "#FFE4B5",
    "#B0C4DE",
    "#FFDEAD",
    "#ADD8E6",
    "#F5DEB3",
    "#B0E0E6",
    "#DEB887",
    "#AFEEEE",
    "#D2B48C",
    "#E0FFFF",
    "#BC8F8F",
    "#7FFFD4",
    "#F4A460",
    "#40E0D0",
    "#DAA520",
    "#48D1CC",
    "#B8860B",
    "#00CED1",
    "#CD853F",
    "#00FFFF",
    "#D2691E",
  ];

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
        value1: item.amount,
        value2: item.count,
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
    (dashBoardData as any)?.modelWiseData?.map((item: any, index: number) => ({
      name: item.name,
      value: item.count,
      color: colors[index],
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
      value1: (dashBoardData as any)?.rtoLocationData?.total?.amount,
      value2: (dashBoardData as any)?.rtoLocationData?.total?.count,
      color: COLORS.secondaryBlue,
    },
    {
      name: "Same City",
      value1: (dashBoardData as any)?.rtoLocationData?.sameCity?.amount,
      value2: (dashBoardData as any)?.rtoLocationData?.sameCity?.count,
      color: "#67E8F9",
    },
    {
      name: "Other City/Same State",
      value1: (dashBoardData as any)?.rtoLocationData?.sameState?.amount,
      value2: (dashBoardData as any)?.rtoLocationData?.sameState?.count,
      color: "#10B981",
    },
    {
      name: "Other State",
      value1: (dashBoardData as any)?.rtoLocationData?.otherState?.amount,
      value2: (dashBoardData as any)?.rtoLocationData?.otherState?.count,
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
        value1: item.count,
        value2: item.amount,
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
  // Donut Chart Component
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
        value: chartData_2[0].value1,
        svg: { fill: COLORS.secondaryBlue },
        key: "deliveries",
      },
      {
        value: chartData_2[1].value1,
        svg: { fill: "#67E8F9" },
        key: "accessories",
      },
    ];

    const total = chartData_2.reduce((sum, item) => sum + item.value1, 0);

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
        value: chartData_3[0].value1,
        svg: { fill: COLORS.secondaryBlue },
        key: "deliveries",
      },
      {
        value: chartData_3[1].value1,
        svg: { fill: "#67E8F9" },
        key: "accessories",
      },
    ];

    const total = chartData_3.reduce((sum, item) => sum + item.value1, 0);

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
        value: chartData_4[0].value1,
        svg: { fill: COLORS.secondaryBlue },
        key: "deliveries",
      },
      {
        value: chartData_4[1].value1,
        svg: { fill: "#67E8F9" },
        key: "accessories",
      },
    ];

    const total = chartData_4.reduce((sum, item) => sum + item.value1, 0);

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
    if (
      chartData_6.reduce((sum: any, item: any) => sum + item.value1, 0) <= 0 &&
      chartData_6.reduce((sum: any, item: any) => sum + item.value2, 0) <= 0
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

    // Flatten data to create grouped bars
    const chartDataForKit: any[] = [];
    chartData_6.forEach((item: any, index: number) => {
      chartDataForKit.push({
        value: item.value1,
        svg: { fill: COLORS.secondaryBlue },
        label: item.name,
        type: "count",
      });
      chartDataForKit.push({
        value: item.value2,
        svg: { fill: "#67E8F9" },
        label: item.name,
        type: "amount",
      });
    });

    const maxValue = Math.max(
      ...chartData_6.map((item: any) => Math.max(item.value1, item.value2)),
    );

    // Calculate dynamic width based on number of locations
    // Each location has 2 bars, so we need space for pairs
    const minBarWidth = 40; // Minimum width per bar
    const calculatedWidth = chartData_6.length * minBarWidth * 2 + 100; // 2 bars per location + padding
    const chartWidth = Math.max(screenWidth - 80, calculatedWidth);

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
          {/* Horizontal ScrollView for chart */}
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

              {/* Bottom labels - showing only unique location names */}
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
  const PieChart_5 = () => {
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

    const chartDataForKit = chartData_7.map((item: any, index: number) => ({
      value: item.value,
      svg: { fill: item.color },
      key: item.name,
    }));

    const total = chartData_7.reduce(
      (sum: any, item: any) => sum + item.value,
      0,
    );

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
            spacing={0}
          >
            {/* <Labels /> */}
          </PieChart>
        </View>
      </View>
    );
  };
  const BarChart_4 = () => {
    // Handle empty data
    if (
      chartData_8.reduce((sum: any, item: any) => sum + item.value1, 0) <= 0 &&
      chartData_8.reduce((sum: any, item: any) => sum + item.value2, 0) <= 0
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

    // Flatten data to create grouped bars
    const chartDataForKit: any[] = [];
    chartData_8.forEach((item: any, index: number) => {
      chartDataForKit.push({
        value: item.value1,
        svg: { fill: COLORS.secondaryBlue },
        label: item.name,
        type: "count",
      });
      chartDataForKit.push({
        value: item.value2,
        svg: { fill: "#67E8F9" },
        label: item.name,
        type: "amount",
      });
    });

    const maxValue = Math.max(
      ...chartData_8.map((item: any) => Math.max(item.value1, item.value2)),
    );

    // Calculate dynamic width based on number of locations
    // Each location has 2 bars, so we need space for pairs
    const minBarWidth = 40; // Minimum width per bar
    const calculatedWidth = chartData_8.length * minBarWidth * 2 + 100; // 2 bars per location + padding
    const chartWidth = Math.max(screenWidth - 80, calculatedWidth);

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
          {/* Horizontal ScrollView for chart */}
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

              {/* Bottom labels - showing only unique location names */}
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
      chartData_10.reduce((sum: any, item: any) => sum + item.value1, 0) <= 0 &&
      chartData_10.reduce((sum: any, item: any) => sum + item.value2, 0) <= 0
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

    // Flatten data to create grouped bars
    const chartDataForKit: any[] = [];
    chartData_10.forEach((item: any, index: number) => {
      chartDataForKit.push({
        value: item.value1,
        svg: { fill: COLORS.secondaryBlue },
        label: item.name,
        type: "total Deliveries",
      });
      chartDataForKit.push({
        value: item.value2,
        svg: { fill: "#67E8F9" },
        label: item.name,
        type: "amount",
      });
    });

    const maxValue = Math.max(
      ...chartData_10.map((item: any) => Math.max(item.value1, item.value2)),
    );

    // Calculate dynamic width based on number of locations
    // Each location has 2 bars, so we need space for pairs
    const minBarWidth = 40; // Minimum width per bar
    const calculatedWidth = chartData_10.length * minBarWidth * 2 + 100; // 2 bars per location + padding
    const chartWidth = Math.max(screenWidth - 80, calculatedWidth);

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
          {/* Horizontal ScrollView for chart */}
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

              {/* Bottom labels - showing only unique location names */}
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
        {/* filter button */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "flex-end",
            marginBottom: responsiveWidth(6),
          }}
        >
          <TouchableOpacity
            style={styles.filterButton}
            onPress={handleFilterPress}
          >
            <Image
              source={require("@/assets/icons/filtericon.png")}
              // width={24}
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
                  { backgroundColor: COLORS.lightBlue },
                ]}
              />
              <Text style={styles.legendText}>Amount</Text>
              {/* <Text style={styles.legendValue}>
                  {item.name == "Deliveries" ? item.value : `₹${item.value}`}
                </Text> */}
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#67E8F9" }]}
              />
              <Text style={styles.legendText}>Cash</Text>
              {/* <Text style={styles.legendValue}>
                  {item.name == "Deliveries" ? item.value : `₹${item.value}`}
                </Text> */}
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
          <ScrollView
            style={{ maxHeight: 120, marginBottom: responsiveWidth(3) }}
            contentContainerStyle={{
              flexDirection: "row",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: responsiveWidth(6),
            }}
            showsVerticalScrollIndicator={true}
          >
            {chartData_7.map((item: any, index: number) => (
              <View key={index} style={styles.legendItem}>
                <View
                  style={[styles.legendDot, { backgroundColor: item.color }]}
                />
                <Text style={styles.legendText}>{item.name}</Text>
                <Text style={styles.legendValue}>{item.value}</Text>
              </View>
            ))}
          </ScrollView>

          {/* Progress Chart4 */}
          <View style={styles.chartContainer}>
            <PieChart_5 />
          </View>
        </View>
        {/* Delivery RTO Location (Same City, Other City/Same State, Other State)  */}
        <View style={[allStyles.card, styles.deliveryCard]}>
          <View style={styles.deliveryHeader}>
            <Text style={styles.deliveryTitle}>Delivery RTO Location</Text>
          </View>

          {/* Legend */}
          <View style={styles.legendContainer}>
            {/* {chartData_8.map((item, index) => ( */}
            <View style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  { backgroundColor: COLORS.primaryBlue },
                ]}
              />
              <Text style={styles.legendText}>Amount</Text>
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#67E8F9" }]}
              />
              <Text style={styles.legendText}>Count</Text>
            </View>
            {/* ))} */}
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
                  { backgroundColor: COLORS.lightBlue },
                ]}
              />
              <Text style={styles.legendText}>Total Deliveries</Text>
              {/* <Text style={styles.legendValue}>
                  {item.name == "Deliveries" ? item.value : `₹${item.value}`}
                </Text> */}
            </View>
            <View style={styles.legendItem}>
              <View
                style={[styles.legendDot, { backgroundColor: "#67E8F9" }]}
              />
              <Text style={styles.legendText}>Amount</Text>
              {/* <Text style={styles.legendValue}>
                  {item.name == "Deliveries" ? item.value : `₹${item.value}`}
                </Text> */}
            </View>
          </View>

          {/* Progress Chart4 */}
          <View style={styles.chartContainer}>
            <BarChart_3 />
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
                      executiveRef: [],
                    }));
                  } else {
                    const allIds = executives.map(
                      (exec) => exec.id || exec._id,
                    );
                    setSelectedExecutives(allIds);
                    setCurrentFilters((prev) => ({
                      ...prev,
                      executiveRef: allIds,
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
                            executiveRef: newSelection,
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
