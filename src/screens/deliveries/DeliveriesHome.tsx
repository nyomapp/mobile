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
import Toast from "react-native-toast-message";

import {
  deleteDeliveryById,
  getDeliveriesData,
} from "@/src/api/deliveriesHome";
import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { COLORS } from "@/src/constants";
import { useDeliveryContext } from "@/src/contexts/DeliveryContext";
import { useDeliveryHomePageContext } from "@/src/contexts/DeliveryHomePageContext";
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
  const [activeTab, setActiveTab] = useState<"delivered" | "pending">(
    "delivered"
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [frameNumber, setFrameNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedDelivery, setSelectedDelivery] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    // Clear previous data when switching tabs to prevent showing wrong data
    resetData();
    getDeleverirsData(activeTab);
  }, [activeTab]);
  const getDeleverirsData = async (
    status: any,
    page: number = 1,
    isLoadMore: boolean = false
  ) => {
    try {
      if (isLoadMore) {
        setIsLoadingMore(true);
      }

      const response = (await getDeliveriesData(status, page)) as any;
      //console.log("API Response:", response);

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
      //console.log(`Loading more deliveries - Page ${nextPage}`);
      getDeleverirsData(activeTab, nextPage, true);
    }
  };

  const onRefresh = async () => {
    setIsRefreshing(true);
    await getDeleverirsData(activeTab, 1, false);
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

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilter = () => {
    // console.log("Applying filter:", {
    //   frameNumber,
    //   mobileNumber,
    //   selectedModel,
    // });
    setShowFilterModal(false);
    // Apply filter logic here
  };

  const handleResetFilter = () => {
    setFrameNumber("");
    setMobileNumber("");
    setSelectedModel("");
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

  const handleMoreOptions = (customerId: string) => {
    //console.log("More options for customer:", customerId);
    // Show options menu
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
                onPress={() => handleMoreOptions(item.id)}
              >
                <Image
                  source={require("@/assets/icons/PDFDownloadIcon.png")}
                  style={{
                    width: 22,
                    height: 22,
                  }}
                  resizeMode="contain"
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
                    source={require("@/assets/icons/EditIcon.png")}
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
                  source={require("@/assets/icons/DeleteIcon.png")}
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
              ? new Date(item.modelRef.createdAt).toLocaleDateString("en-GB")
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
              source={require("@/assets/icons/UploadWhiteIcon.png")}
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
              source={require("@/assets/icons/FilterIcon.png")}
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
                  // placeholderTextColor={COLORS.black}
                  value={frameNumber}
                  onChangeText={setFrameNumber}
                />

                <TextInput
                  style={globalStyles.input}
                  placeholder="Mobile Number"
                  // placeholderTextColor={COLORS.black}
                  value={mobileNumber}
                  onChangeText={setMobileNumber}
                  keyboardType="numeric"
                />

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
                    {selectedModel || "Select Model"}
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
                {models.map((model, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modelOption,
                      selectedModel === model && styles.selectedModelOption,
                    ]}
                    onPress={() => {
                      setSelectedModel(model);
                      setShowModelModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modelOptionText,
                        selectedModel === model && styles.selectedModelText,
                      ]}
                    >
                      {model}
                    </Text>
                    {selectedModel === model && (
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
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
}
