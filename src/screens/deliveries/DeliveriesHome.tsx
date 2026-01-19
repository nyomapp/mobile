import * as FileSystem from "expo-file-system";
import * as Sharing from "expo-sharing";
import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Toast from "react-native-toast-message";

import { getModalsData } from "@/src/api/addDelivery";
import {
  deleteDeliveryById,
  downloadCombineAadhaar,
  downloadCombineForm20,
  downloadCombineRentDocuments,
  downloadCombineZip,
  generatePdfUrl,
  getAllUsers,
  getDeliveriesData,
} from "@/src/api/deliveriesHome";
import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { COLORS } from "@/src/constants";
import { useAuth } from "@/src/contexts/AuthContext";
import { useDeliveryContext } from "@/src/contexts/DeliveryContext";
import { useDeliveryHomePageContext } from "@/src/contexts/DeliveryHomePageContext";
import { useModels } from "@/src/contexts/ModelsContext";
import { useUsersData } from "@/src/contexts/UsersDataContext";
import { globalStyles } from "@/src/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/deliveries/deliveryHomeStyles";
import { allStyles } from "../../styles/global";

export default function DeliveriesHome() {
  const {
    currentDelivery,
    deliveryId,
    isEdit,
    setCurrentDelivery,
    setDeliveryId,
    setIsEdit,
    resetDeliveryId,
    resetIsEdit,
  } = useDeliveryContext();
  const {
    data: deliveriesData,
    resetData,
    setData,
  } = useDeliveryHomePageContext();
  const { user, updateUser } = useAuth();
  const {
    models: modelsData,
    setModels,
    resetModels,
    // isLoading,
    setLoading,
  } = useModels();
  const { users, setUsers, resetUsers } = useUsersData();
  const [activeTab, setActiveTab] = useState<"delivered" | "pending">(
    "delivered",
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [frameNumber, setFrameNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<string>(""); // Keep as string for display
  const [endDate, setEndDate] = useState<string>("");
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [dateValidationError, setDateValidationError] = useState<string>("");
  const [selectedUser, setSelectedUser] = useState<string>("");
  const [showUserModal, setShowUserModal] = useState(false);
  // Add current filters state to track applied filters
  const [currentFilters, setCurrentFilters] = useState<{
    frameNumber?: string;
    mobileNumber?: string;
    userRef?: string;
    modelRef?: string;
    startDate?: string;
    endDate?: string;
  }>();

  // Reset all filters on initial mount
  useEffect(() => {
    setFrameNumber("");
    setMobileNumber("");
    setSelectedModel("");
    setSelectedUser("");
    setStartDate("");
    setEndDate("");
    setDateValidationError("");
    setCurrentFilters({});
  }, []);
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
    setStartDate(day.dateString); // Store in YYYY-MM-DD format
    setShowStartDatePicker(false);

    // Clear validation error when user selects a date
    if (dateValidationError) {
      setDateValidationError("");
    }
  };

  const handleEndDateSelect = (day: any) => {
    setEndDate(day.dateString); // Store in YYYY-MM-DD format
    setShowEndDatePicker(false);

    // Clear validation error when user selects a date
    if (dateValidationError) {
      setDateValidationError("");
    }
  };

  useEffect(() => {
    setIsLoading(true);
    // Clear previous data when switching tabs to prevent showing wrong data
    resetData();
    getDeleverirsData(activeTab, 1, false, currentFilters);
  }, [activeTab]);
  useEffect(() => {
    if (user) {
      // console.log('User is available, fetching models...');
      getAllModels();
    } else {
      //console.log("User is null, skipping model fetch");
    }
  }, [user]);
  const getAllModels = async () => {
    // console.log('COMPONENT: getAllModels function called', { user });

    let oemRef = "";

    try {
      if (user?.userType === "main_dealer") {
        oemRef = (user as any)?.oemRef?._id;
      } else {
        oemRef = (user as any)?.mainDealerRef?.oemRef?._id;
      }

      //console.log("COMPONENT: OEM Ref:", oemRef);

      if (!oemRef) {
        //console.log("COMPONENT: No OEM reference found in user data");
        Toast.show({
          type: "error",
          text1: "Configuration Error",
          text2: "OEM reference not found in user profile",
          visibilityTime: 3000,
        });
        return;
      }

      const response = await getModalsData(oemRef);
      setModels(response as any[]);

      // Toast.show({
      //   type: "success",
      //   text1: "Success",
      //   text2: "Models loaded successfully",
      //   visibilityTime: 2000,
      // });
    } catch (error) {
      console.error("COMPONENT: Error in getAllModels:", error);

      Toast.show({
        type: "error",
        text1: "API Error",
        text2: `Failed to load models: ${(error as Error).message}`,
        visibilityTime: 3000,
      });
    }
  };
  const getDeleverirsData = async (
    status: any,
    page: number = 1,
    isLoadMore: boolean = false,
    filters?: {
      frameNumber?: string;
      mobileNumber?: string;
      userRef?: string;
      modelRef?: string;
      startDate?: string;
      endDate?: string;
    },
  ) => {
    console.log("Fetching deliveries with filters:", filters);
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      }

      const response = (await getDeliveriesData(
        status,
        page,
        10,
        filters,
      )) as any;
      // console.log("API Response with filters:", response);

      if (isLoadMore && page > 1) {
        // Append new results to existing ones
        const currentData = deliveriesData;
        const newData = {
          ...response,
          results: [
            ...(currentData.results || []),
            ...(response.results || []),
          ],
        };
        setData(newData);
      } else {
        // Replace all data (first load or refresh)
        setData(response);
      }

      setIsLoadingMore(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error fetching deliveries:", error);
      setIsLoadingMore(false);
      setIsLoading(false);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          (error as any).message ||
          "An error occurred while fetching deliveries.",
      });
    }
  };

  const loadMoreDeliveries = () => {
    if (!isLoadingMore && deliveriesData.page < deliveriesData.totalPages) {
      const nextPage = deliveriesData.page + 1;
      console.log(
        `Loading more deliveries - Page ${nextPage} with filters:`,
        currentFilters,
      );
      getDeleverirsData(activeTab, nextPage, true, currentFilters);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await getDeleverirsData(activeTab, 1, false, currentFilters);
    setIsRefreshing(false);
  };

  const handleEndReached = () => {
    loadMoreDeliveries();
  };

  const models = [
    "Hero Splendor",
    "Honda Activa",
    "Bajaj Pulsar",
    "TVS Apache",
    "Yamaha FZ",
    "Royal Enfield",
    "KTM Duke",
    "Suzuki Access",
  ];

  const handleBack = () => {
    router.back();
  };

  const handleFilterPress = async () => {
    setShowFilterModal(true);
    try {
      await getAllModels();
      if (
        user?.userType === "main_dealer" ||
        (deliveriesData as any)?.isRtoDelarAdmin
      ) {
        const response = await getAllUsers();
        // console.log("Users fetched:", response);
        setUsers((response as any).results || []);
      }
    } catch (error) {
      console.error("Error loading users:", error);

      setUsers([]); // Ensure users is always an array
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
    const dateError = validateDateRange(startDate, endDate);
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

    console.log("Applying filter:", {
      frameNumber,
      mobileNumber,
      selectedModel,
      startDate,
      endDate,
    });

    // Create filters object with only non-empty values
    const filters: {
      frameNumber?: string;
      mobileNumber?: string;
      modelRef?: string;
      userRef?: string;
      startDate?: string;
      endDate?: string;
    } = {};

    if (frameNumber && frameNumber.trim()) {
      filters.frameNumber = frameNumber.trim();
    }
    if (mobileNumber && mobileNumber.trim()) {
      filters.mobileNumber = mobileNumber.trim();
    }
    if (selectedModel && selectedModel.trim()) {
      filters.modelRef = selectedModel.trim();
    }
    if (selectedUser && selectedUser.trim()) {
      filters.userRef = selectedUser.trim();
    }
    if (startDate) {
      filters.startDate = startDate; // Already in YYYY-MM-DD format
    }
    if (endDate) {
      filters.endDate = endDate; // Already in YYYY-MM-DD format
    }

    // Store current filters
    setCurrentFilters(filters);

    // Close modal
    setShowFilterModal(false);

    // Reset data and fetch with filters
    resetData();
    setIsLoading(true);
    getDeleverirsData(activeTab, 1, false, filters);

    Toast.show({
      type: "success",
      text1: "Filter Applied",
      text2: "Deliveries filtered successfully",
    });
  };

  const handleResetFilter = () => {
    setFrameNumber("");
    setMobileNumber("");
    setSelectedModel("");
    setSelectedUser("");
    setStartDate("");
    setEndDate("");
    setDateValidationError("");
    setCurrentFilters({});

    // Close modal
    setShowFilterModal(false);

    // Reset data and fetch without filters
    resetData();
    setIsLoading(true);
    getDeleverirsData(activeTab, 1, false, {});

    Toast.show({
      type: "success",
      text1: "Filter Reset",
      text2: "All filters cleared",
    });
  };

  const handleUpload = (data: any) => {
    // Clean the data before setting to context
    const {
      id: _id,
      updatedBy: _updatedBy,
      status: _status,
      modelRef,
      financerRef,
      ...restData
    } = data;

    const cleanedData = {
      ...restData,
      // Extract model ID from modelRef object
      modelRef: modelRef?._id || modelRef?.id || "",
      financerRef: financerRef?._id || financerRef?.id || "",
      // Ensure userRef is set (required field)
      userRef: data.userRef?._id || data.userRef?.id || "",
    };

    console.log("Cleaned Data for Context:", cleanedData);

    setCurrentDelivery(cleanedData as any);
    setDeliveryId(data.id);
    router.push("/other-documents");
    // Navigate to upload screen or show upload modal
  };

  const handleMoreOptions = (item: any) => {
    setSelectedDelivery(item);
    setShowDocsModal(true);
  };

  const closeDocsModal = () => {
    setShowDocsModal(false);
    setSelectedDelivery(null);
  };

  const handleEdit = (data: any) => {
    //console.log("Edit Raw Data:", data);

    // Clean the data before setting to context
    const {
      id: _id,
      updatedBy: _updatedBy,
      status: _status,
      modelRef,
      financerRef,
      ...restData
    } = data;

    const cleanedData = {
      ...restData,
      // Extract model ID from modelRef object
      modelRef: modelRef?._id || modelRef?.id || "",
      financerRef: financerRef?._id || financerRef?.id || "",
      // Ensure userRef is set (required field)
      userRef: data.userRef?._id || data.userRef?.id || "",
    };

    console.log("Cleaned Data for Context:", cleanedData);

    setCurrentDelivery(cleanedData as any);
    setDeliveryId(data.id);
    setIsEdit(true);
    router.push("/add-delivery");
  };

  const handleDelete = (data: any) => {
    //console.log("Delete ", data);
    setSelectedDelivery(data);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Delete the delivery from database
      await deleteDeliveryById(selectedDelivery.id);

      // Refresh the data by calling API again to get latest data
      await getDeleverirsData(activeTab, 1, false);

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Delivery deleted successfully.",
      });

      setShowDeleteModal(false);
      setSelectedDelivery(null);
    } catch (error) {
      console.error("Error deleting delivery:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          (error as any).message ||
          "An error occurred while deleting the delivery.",
      });
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setSelectedDelivery(null);
  };

  const renderLoadingFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={{ padding: 20, alignItems: "center" }}>
        <Text style={{ color: "#666", fontSize: 14 }}>
          Loading more deliveries...
        </Text>
      </View>
    );
  };

  // Helper to save and share a blob
  const saveAndShareBlob = async (
    blob: Blob,
    fileName: string,
    mimeType: string,
  ) => {
    try {
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          const base64 = (reader.result as string).split(",")[1];
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
      const base64 = await base64Promise;
      const fileUri = FileSystem.cacheDirectory + fileName;
      await FileSystem.writeAsStringAsync(fileUri, base64, {
        encoding: FileSystem.EncodingType.Base64,
      });
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(fileUri, { mimeType });
      } else {
        Toast.show({ type: "info", text1: "File downloaded", text2: fileUri });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Download Error",
        text2:
          error instanceof Error ? error.message : "Failed to download file.",
      });
    }
  };

  const handleDownloadCombinedForm20 = async (document: any) => {
    try {
      const response = await downloadCombineForm20(
        document?.certificateRef?.chassisNumber,
      );
      if (response instanceof Blob) {
        await saveAndShareBlob(
          response,
          "Combined_Form20.pdf",
          "application/pdf",
        );
      } else {
        Toast.show({ type: "error", text1: "No file to download" });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          (error as any).message ||
          "An error occurred while downloading the combined Form 20.",
      });
    }
  };

  const handleDownloadCombinedRentDocuments = async (document: any) => {
    try {
      const response = await downloadCombineRentDocuments(
        document?.certificateRef?.chassisNumber,
      );
      if (response instanceof Blob) {
        await saveAndShareBlob(
          response,
          "Combined_Rent_Documents.pdf",
          "application/pdf",
        );
      } else {
        Toast.show({ type: "error", text1: "No file to download" });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          (error as any).message ||
          "An error occurred while downloading the combined Rent Documents.",
      });
    }
  };

  const handleDownloadAll = async (document: any) => {
    try {
      console.log("Downloading all documents for chassis number:", document);
      const response = await downloadCombineZip(
        document?.certificateRef?.chassisNumber,
        document?.customerName,
        document?.createdAt,
      );
      if (response instanceof Blob) {
        await saveAndShareBlob(
          response,
          "All_Documents.zip",
          "application/zip",
        );
      } else {
        Toast.show({ type: "error", text1: "No file to download" });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          (error as any).message ||
          "An error occurred while downloading the combined ZIP.",
      });
    }
  };

  const handleDownloadCombinedAadhaar = async (document: any) => {
    try {
      console.log(
        "Downloading combined Aadhaar for chassis number:",
        document?.certificateRef?.chassisNumber,
      );
      const response = await downloadCombineAadhaar(
        document?.certificateRef?.chassisNumber,
      );
      if (response instanceof Blob) {
        await saveAndShareBlob(
          response,
          "Combined_Aadhaar.pdf",
          "application/pdf",
        );
      } else {
        Toast.show({ type: "error", text1: "No file to download" });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          (error as any).message ||
          "An error occurred while downloading the combined Aadhaar.",
      });
    }
  };
  const handleDownloadDocument = async (document: any) => {
    console.log("Downloading document:", document);
    try {
      const response = await generatePdfUrl(document?.fileUrl);
      const downloadUrl = (response as any)?.downloadUrl;
      if (!downloadUrl) {
        Toast.show({ type: "error", text1: "No download URL found" });
        return;
      }

      // Determine if document is PNG or PDF
      const isPng = document?.documentName === "Customer Photo";
      const fileExtension = isPng ? ".png" : ".pdf";
      const mimeType = isPng ? "image/png" : "application/pdf";

      const fileName =
        (document?.documentName || "Document").replace(/\s+/g, "_") +
        fileExtension;
      const fileUri = FileSystem.cacheDirectory + fileName;
      const downloadRes = await FileSystem.downloadAsync(downloadUrl, fileUri);
      if (downloadRes && downloadRes.status === 200) {
        if (await Sharing.isAvailableAsync()) {
          await Sharing.shareAsync(downloadRes.uri, {
            mimeType: mimeType,
          });
        } else {
          Toast.show({
            type: "info",
            text1: "File downloaded",
            text2: downloadRes.uri,
          });
        }
      } else {
        Toast.show({ type: "error", text1: "Download failed" });
      }
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2:
          (error as any).message ||
          "An error occurred while downloading the document.",
      });
    }
  };

  const renderCustomerCard = (item: any) => (
    <View style={allStyles.customerCard}>
      <View style={allStyles.cardHeader}>
        <View style={allStyles.cardContent}>
          <View style={allStyles.avatar}>
            <Text style={allStyles.avatarText}>
              {item.customerName?.charAt(0)?.toUpperCase() || "A"}
            </Text>
          </View>
          <View style={allStyles.customerInfo}>
            <Text style={allStyles.customerName}>{item.customerName}</Text>
            <Text style={allStyles.detailValue}>{item.modelRef?.name}</Text>
          </View>
        </View>
        <View style={allStyles.cardActions}>
          {activeTab === "delivered" ? (
            <>
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => handleMoreOptions(item)}
              >
                <Ionicons
                  name="ellipsis-horizontal"
                  size={22}
                  color={COLORS.primaryBlue || "#007AFF"}
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                style={{ alignItems: "center" }}
                onPress={() => handleEdit(item)}
              >
                <View
                //  style={styles.uploadIcon}
                >
                  <Image
                    source={require("@/assets/icons/editicon.png")}
                    style={{
                      width: 22,
                      height: 22,
                    }}
                    // width={20}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                // style={styles.moreButton}
                onPress={() => handleDelete(item)}
              >
                <Image
                  source={require("@/assets/icons/deleteicon.png")}
                  style={{ width: 16, height: 16 }}
                  // width={20}

                  resizeMode="contain"
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={allStyles.customerDetails}>
        <View style={allStyles.detailText}>
          <Text style={allStyles.detailLabel}>Frame Number</Text>
          <Text style={allStyles.detailValue}>{item.chassisNo}</Text>
        </View>
        <View style={allStyles.verticalLine}></View>
        <View style={allStyles.detailText}>
          <Text style={allStyles.detailLabel}>Mobile Number</Text>
          <Text style={allStyles.detailValue}>{item.mobileNumber}</Text>
        </View>
        <View style={allStyles.verticalLine}></View>
        <View style={allStyles.detailText}>
          <Text style={allStyles.detailLabel}>Date</Text>
          <Text style={allStyles.detailValue}>
            {item.modelRef?.createdAt
              ? new Date(item.createdAt).toLocaleDateString("en-GB")
              : "N/A"}
          </Text>
        </View>
      </View>
      {activeTab === "delivered" ? (
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={() => handleUpload(item)}
        >
          <Text style={styles.uploadButtonText}>Upload</Text>
          <View style={styles.uploadIcon}>
            <Image
              source={require("@/assets/icons/uploadwhiteicon.png")}
              style={{ width: 15, height: 15 }}
              // width={20}
              resizeMode="contain"
            />
          </View>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <SafeAreaView style={allStyles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={allStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View
          style={[allStyles.headerContainer, { justifyContent: "flex-end" }]}
        >
          {/* <TouchableOpacity
            onPress={handleBack}
            style={[allStyles.backButton, allStyles.backButtonBackgroundStyle]}
          >
            <Text style={allStyles.backButtonText}>← Back</Text>
          </TouchableOpacity> */}
          <HeaderIcon />
        </View>

        <View style={styles.titleContainer}>
          <Text
            style={[allStyles.pageTitle, { paddingTop: responsiveWidth(0) }]}
          >
            Deliveries
          </Text>
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

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "delivered" && styles.activeTab]}
            onPress={() => setActiveTab("delivered")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "delivered" && styles.activeTabText,
              ]}
            >
              Delivery
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === "pending" && styles.activeTab]}
            onPress={() => setActiveTab("pending")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "pending" && styles.activeTabText,
              ]}
            >
              Pending Delivery
            </Text>
          </TouchableOpacity>
        </View>

        {/* Customer List */}
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 16, color: "#666" }}>
              Loading deliveries...
            </Text>
          </View>
        ) : deliveriesData &&
          deliveriesData.results &&
          deliveriesData.results.length > 0 ? (
          <FlatList
            data={deliveriesData.results}
            renderItem={({ item }) => renderCustomerCard(item)}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            style={[
              allStyles.scrollContent,
              { paddingHorizontal: responsiveWidth(0.5) },
            ]}
            // Pagination props
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.1}
            ListFooterComponent={renderLoadingFooter}
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            // Performance optimization
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            windowSize={10}
          />
        ) : (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <Text style={{ fontSize: 16, color: "#666" }}>
              No deliveries found
            </Text>
          </View>
        )}

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
                <TextInput
                  style={globalStyles.input}
                  placeholder="Frame Number"
                  value={frameNumber}
                  onChangeText={setFrameNumber}
                  maxLength={17}
                />

                <TextInput
                  style={globalStyles.input}
                  placeholder="Mobile Number"
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  keyboardType="numeric"
                  maxLength={10}
                />

                {/* Start Date Picker */}
                <TouchableOpacity
                  style={[globalStyles.input, styles.dropdownButton]}
                  onPress={() => setShowStartDatePicker(true)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      allStyles.dropdownText,
                      startDate ? { color: COLORS.black } : null,
                    ]}
                  >
                    {startDate ? formatDateForDisplay(startDate) : "Start Date"}
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
                      endDate ? { color: COLORS.black } : null,
                    ]}
                  >
                    {endDate ? formatDateForDisplay(endDate) : "End Date"}
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

                {/* User Dropdown */}
                {(user?.userType === "main_dealer" ||
                  (deliveriesData as any)?.isRtoDelarAdmin) && (
                  <>
                    <TouchableOpacity
                      style={[globalStyles.input, styles.dropdownButton]}
                      onPress={() => setShowUserModal(true)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          allStyles.dropdownText,
                          selectedUser ? { color: COLORS.black } : null,
                        ]}
                      >
                        {selectedUser
                          ? users.find(
                              (user) => (user.id || user._id) === selectedUser,
                            )?.name || "Select User"
                          : "Select User "}
                      </Text>
                      <Ionicons name="chevron-down" size={20} color="#6C757D" />
                    </TouchableOpacity>
                  </>
                )}

                {/* Model Dropdown */}
                <TouchableOpacity
                  style={[globalStyles.input, styles.dropdownButton]}
                  onPress={() => setShowModelModal(true)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      allStyles.dropdownText,
                      selectedModel ? { color: COLORS.black } : null,
                    ]}
                  >
                    {selectedModel
                      ? modelsData.find((model) => model._id === selectedModel)
                          ?.name || selectedModel
                      : "Select Model"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#6C757D" />
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
        {/* Model Selection User - Center of screen */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showUserModal}
          onRequestClose={() => setShowUserModal(false)}
        >
          <View style={styles.modelModalOverlay}>
            <View style={styles.modelModalContent}>
              <View style={styles.modelModalHeader}>
                <Text style={styles.modelModalTitle}>Select User</Text>
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
                {Array.isArray(users) && users.length > 0 ? (
                  users.map((user, index) => {
                    const userId = user.id || user._id;
                    const isSelected = selectedUser === userId;

                    return (
                      <TouchableOpacity
                        key={userId || index}
                        style={[
                          styles.modelOption,
                          isSelected && styles.selectedModelOption,
                        ]}
                        onPress={() => {
                          console.log(
                            "Selected user:",
                            user.name,
                            "ID:",
                            userId,
                          );
                          setSelectedUser(userId);
                          setShowUserModal(false);
                        }}
                      >
                        <Text
                          style={[
                            styles.modelOptionText,
                            isSelected && styles.selectedModelText,
                          ]}
                        >
                          {user.name}
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
                      {users === null || users === undefined
                        ? "Loading users..."
                        : "No users available"}
                    </Text>
                  </View>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
        {/* Model Selection Modal - Center of screen */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showModelModal}
          onRequestClose={() => setShowModelModal(false)}
        >
          <View style={styles.modelModalOverlay}>
            <View style={styles.modelModalContent}>
              <View style={styles.modelModalHeader}>
                <Text style={styles.modelModalTitle}>Select Model</Text>
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
                {modelsData.map((model, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modelOption,
                      selectedModel === model._id && styles.selectedModelOption,
                    ]}
                    onPress={() => {
                      setSelectedModel(model._id);
                      setShowModelModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modelOptionText,
                        selectedModel === model._id && styles.selectedModelText,
                      ]}
                    >
                      {model.name}
                    </Text>
                    {selectedModel === model._id && (
                      <Ionicons
                        name="checkmark"
                        size={20}
                        color={COLORS.primaryBlue}
                      />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* Delete Confirmation Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showDeleteModal}
          onRequestClose={cancelDelete}
        >
          <View style={styles.modelModalOverlay}>
            <View
              style={[
                styles.modelModalContent,
                { width: "80%", maxHeight: "auto" },
              ]}
            >
              <View style={styles.modelModalHeader}>
                <Text style={styles.modelModalTitle}>Confirm Delete</Text>
              </View>

              <View style={{ padding: responsiveWidth(5) }}>
                <Text
                  style={{
                    fontSize: 16,
                    color: "#333",
                    textAlign: "center",
                    marginBottom: responsiveWidth(2),
                  }}
                >
                  Are you sure you want to delete this delivery?
                </Text>

                {selectedDelivery && (
                  <View
                    style={{
                      backgroundColor: "#f8f9fa",
                      padding: responsiveWidth(3),
                      borderRadius: responsiveWidth(2),
                      marginBottom: responsiveWidth(5),
                    }}
                  >
                    <Text style={{ fontSize: 14, color: "#666" }}>
                      Customer: {selectedDelivery.customerName}
                    </Text>
                    <Text style={{ fontSize: 14, color: "#666" }}>
                      Frame Number: {selectedDelivery.chassisNo}
                    </Text>
                  </View>
                )}

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    gap: responsiveWidth(3),
                  }}
                >
                  <TouchableOpacity
                    style={[
                      allStyles.btn,
                      {
                        flex: 1,
                        backgroundColor: "#6c757d",
                        marginBottom: 0,
                      },
                    ]}
                    onPress={cancelDelete}
                  >
                    <Text style={allStyles.btnText}>Cancel</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[
                      allStyles.btn,
                      {
                        flex: 1,
                        backgroundColor: "#dc3545",
                        marginBottom: 0,
                      },
                    ]}
                    onPress={confirmDelete}
                  >
                    <Text style={allStyles.btnText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </Modal>
        {/* Documents Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showDocsModal}
          onRequestClose={() => setShowDocsModal(false)}
        >
          <View style={allStyles.modalOverlay}>
            <View style={allStyles.modalContent}>
              <View style={allStyles.modalHeader}>
                <Text style={allStyles.modalTitle}>Select Document</Text>
                <TouchableOpacity
                  style={allStyles.closeButton}
                  onPress={() => setShowDocsModal(false)}
                >
                  <Ionicons name="close" size={24} color="#6C757D" />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={allStyles.modalScrollView}
                showsVerticalScrollIndicator={false}
              >
                <TouchableOpacity
                  style={[allStyles.modalOption]}
                  onPress={() => {
                    handleDownloadAll(selectedDelivery);
                    setShowDocsModal(false);
                  }}
                >
                  <Text style={[allStyles.modalOptionText]}>All</Text>
                </TouchableOpacity>

                {/* Show Combined Aadhaar button only if both AADHAAR FRONT and AADHAAR BACK are present */}
                {(() => {
                  const docs = selectedDelivery?.downloadDocuments || [];
                  const hasAadhaarFront = docs.some(
                    (d: any) => d.documentName === "AADHAAR FRONT",
                  );
                  const hasAadhaarBack = docs.some(
                    (d: any) => d.documentName === "AADHAAR BACK",
                  );
                  if (hasAadhaarFront || hasAadhaarBack) {
                    return (
                      <TouchableOpacity
                        style={[allStyles.modalOption]}
                        onPress={() => {
                          handleDownloadCombinedAadhaar(selectedDelivery);
                          setShowDocsModal(false);
                        }}
                      >
                        <Text style={[allStyles.modalOptionText]}>
                          Combined Aadhaar
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  return null;
                })()}

                {/* Show Combined Form 20 button only if all three FORM 20 pages are present */}
                {(() => {
                  const docs = selectedDelivery?.downloadDocuments || [];
                  const hasForm20_1 = docs.some(
                    (d: any) => d.documentName === "FORM 20 1ST PAGE",
                  );
                  const hasForm20_2 = docs.some(
                    (d: any) => d.documentName === "FORM 20 2ND PAGE",
                  );
                  const hasForm20_3 = docs.some(
                    (d: any) => d.documentName === "FORM 20 3RD PAGE",
                  );
                  if (hasForm20_1 || hasForm20_2 || hasForm20_3) {
                    return (
                      <TouchableOpacity
                        style={[allStyles.modalOption]}
                        onPress={() => {
                          handleDownloadCombinedForm20(selectedDelivery);
                          setShowDocsModal(false);
                        }}
                      >
                        <Text style={[allStyles.modalOptionText]}>
                          Combined Form 20
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  return null;
                })()}

                {/* Show Combined Form 20 button only if all three FORM 20 pages are present */}
                {(() => {
                  const docs = selectedDelivery?.downloadDocuments || [];
                  const hasRentDocument1 = docs.some(
                    (d: any) => d.documentName === "RENT DOCUMENT 1",
                  );
                  const hasRentDocument2 = docs.some(
                    (d: any) => d.documentName === "RENT DOCUMENT 2",
                  );
                  const hasRentDocument3 = docs.some(
                    (d: any) => d.documentName === "RENT DOCUMENT 3",
                  );
                  if (
                    hasRentDocument1 ||
                    hasRentDocument2 ||
                    hasRentDocument3
                  ) {
                    return (
                      <TouchableOpacity
                        style={[allStyles.modalOption]}
                        onPress={() => {
                          handleDownloadCombinedRentDocuments(selectedDelivery);
                          setShowDocsModal(false);
                        }}
                      >
                        <Text style={[allStyles.modalOptionText]}>
                          Combined Rent Documents
                        </Text>
                      </TouchableOpacity>
                    );
                  }
                  return null;
                })()}

                {selectedDelivery?.downloadDocuments?.map(
                  (document: any, index: any) => (
                    <TouchableOpacity
                      key={index}
                      style={[allStyles.modalOption]}
                      onPress={() => {
                        handleDownloadDocument(document);
                        setShowDocsModal(false);
                      }}
                    >
                      <Text style={[allStyles.modalOptionText]}>
                        {document.documentName === "FRONT"
                          ? "Vehicle Front Image"
                          : document.documentName === "LEFT"
                            ? "Vehicle Side Image"
                            : document.documentName === "CHASSIS"
                              ? "Vehicle Frame Image"
                              : document.documentName === "Customer"
                                ? "Customer Image"
                                : document.documentName === "Customer Photo"
                                  ? "Customer Image Png"
                                  : document.documentName === "AADHAAR FRONT"
                                    ? "Adhaar Front Image"
                                    : document.documentName === "AADHAAR BACK"
                                      ? "Aadhaar Back Image"
                                      : document.documentName === "PAN"
                                        ? "Pan Card Image"
                                        : document.documentName ===
                                            "TAX INVOICE"
                                          ? "Tax Invoice Image"
                                          : document.documentName ===
                                              "INSURANCE"
                                            ? "Insurance Image"
                                            : document.documentName ===
                                                "HELMET INVOICE"
                                              ? "Helmet Invoice Image"
                                              : document.documentName ===
                                                  "FORM 20 1ST PAGE"
                                                ? "Form 20 1st Page Image"
                                                : document.documentName ===
                                                    "FORM 20 2ND PAGE"
                                                  ? "Form 20 2nd Page Image"
                                                  : document.documentName ===
                                                      "FORM 20 3RD PAGE"
                                                    ? "Form 20 3rd Page Image"
                                                    : document.documentName ===
                                                        "FORM 21"
                                                      ? "Form 21 Image"
                                                      : document.documentName ===
                                                          "FORM 22"
                                                        ? "Form 22 Image"
                                                        : document.documentName ===
                                                            "AFFIDAVIT"
                                                          ? "Affidavit Image"
                                                          : document.documentName}
                      </Text>
                    </TouchableOpacity>
                  ),
                )}
              </ScrollView>
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
                    [startDate]: {
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
                    [endDate]: {
                      selected: true,
                      selectedColor: COLORS.primaryBlue || "#007AFF",
                    },
                  }}
                  maxDate={new Date().toISOString().split("T")[0]} // Today's date
                  minDate={startDate || undefined} // Minimum date is start date if selected
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
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
}
