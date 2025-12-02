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
  View
} from "react-native";
import Toast from "react-native-toast-message";

import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { COLORS } from "@/src/constants";
import { globalStyles } from "@/src/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  responsiveWidth
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/deliveries/deliveryHomeStyles";
import { allStyles } from "../../styles/global";

interface Customer {
  id: string;
  name: string;
  frameNumber: string;
  mobileNumber: string;
  model: string;
  status: "uploaded" | "pending";
}

export default function DeliveriesHome() {
  const [activeTab, setActiveTab] = useState<"delivery" | "pending">(
    "delivery"
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [frameNumber, setFrameNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  
  const models = [
    "Hero Splendor",
    "Honda Activa",
    "Bajaj Pulsar",
    "TVS Apache",
    "Yamaha FZ",
    "Royal Enfield",
    "KTM Duke",
    "Suzuki Access"
  ];

  const handleBack = () => {
    router.back();
  };

  const handleFilterPress = () => {
    setShowFilterModal(true);
  };

  const handleApplyFilter = () => {
    console.log("Applying filter:", { frameNumber, mobileNumber, selectedModel });
    setShowFilterModal(false);
    // Apply filter logic here
  };

  const handleResetFilter = () => {
    setFrameNumber("");
    setMobileNumber("");
    setSelectedModel("");
  };

  const handleUpload = (customerId: string) => {
    console.log("Upload for customer:", customerId);
    router.push("/other-documents");
    // Navigate to upload screen or show upload modal
  };

  const handleMoreOptions = (customerId: string) => {
    console.log("More options for customer:", customerId);
    // Show options menu
  };

  // Sample data
  const customers: Customer[] = [
    {
      id: "1",
      name: "Customer 1",
      frameNumber: "5555858665172",
      mobileNumber: "5555858665172",
      model: "Hero Splendor",
      status: "pending",
    },
    {
      id: "2",
      name: "Customer 1",
      frameNumber: "5555858665172",
      mobileNumber: "5555858665172",
      model: "Hero Splendor",
      status: "pending",
    },
    {
      id: "3",
      name: "Customer 1",
      frameNumber: "5555858665172",
      mobileNumber: "5555858665172",
      model: "Hero Splendor",
      status: "pending",
    },
    {
      id: "4",
      name: "Customer 1",
      frameNumber: "5555858665172",
      mobileNumber: "5555858665172",
      model: "Hero Splendor",
      status: "pending",
    },
  ];

  const handleEdit = (data:any) => {
      console.log("Edit ",data);
  };

  const handleDelete = (data:any) => {
      console.log("Delete ",data);
  };

  const renderCustomerCard = ({ item }: { item: Customer }) => (
    <View style={styles.customerCard}>
      <View style={styles.cardHeader}>
        <Text style={styles.customerName}>{item.name}</Text>
        <View style={styles.cardActions}>
          {activeTab === "delivery" ? (
            <>
              <TouchableOpacity
                style={styles.uploadButton}
                onPress={() => handleUpload(item.id)}
              >
                <Text style={styles.uploadButtonText}>Upload</Text>
                <View style={styles.uploadIcon}>
                  <Image
                    source={require("@/assets/icons/UploadWhiteColoricon.png")}
                    // style={styles.img}
                    width={20}
                    resizeMode="contain"
                  />
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.moreButton}
                onPress={() => handleMoreOptions(item.id)}
              >
                <Image
                  source={require("@/assets/icons/importIcon.png")}
                  // style={styles.img}
                  width={20}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                // style={styles.uploadButton}
                onPress={() => handleEdit(item)}
              >

                <View
                //  style={styles.uploadIcon}
                 >
                  <Image
                    source={require("@/assets/icons/EditFilledIcon.png")}
                    // style={styles.img}
                    width={20}
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
                  // style={styles.img}
                  width={20}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </View>

      <View style={styles.customerDetails}>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Frame Number: </Text>
          <Text style={styles.detailValue}>{item.frameNumber}</Text>
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Mobile Number: </Text>
          <Text style={styles.detailValue}>{item.mobileNumber}</Text>
        </Text>
        <Text style={styles.detailText}>
          <Text style={styles.detailLabel}>Model: </Text>
          <Text style={styles.detailValue}>{item.model}</Text>
        </Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={allStyles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={allStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={allStyles.headerContainer}>
          <TouchableOpacity
            onPress={handleBack}
            style={[allStyles.backButton, allStyles.backButtonBackgroundStyle]}
          >
            <Text style={allStyles.backButtonText}>← Back</Text>
          </TouchableOpacity>
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
              width={24}
              style={styles.filterIcon}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "delivery" && styles.activeTab]}
            onPress={() => setActiveTab("delivery")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "delivery" && styles.activeTabText,
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
        <FlatList
          data={customers}
          renderItem={renderCustomerCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          style={[
            allStyles.scrollContent,
            { paddingHorizontal: responsiveWidth(0.5) },
          ]}
        />

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
              <ScrollView style={styles.filterForm} showsVerticalScrollIndicator={false}>
                <TextInput
                  style={globalStyles.input}
                  placeholder="Frame Number"
                  placeholderTextColor="#9CA3AF"
                  value={frameNumber}
                  onChangeText={setFrameNumber}
                />

                <TextInput
                  style={globalStyles.input}
                  placeholder="Mobile Number"
                  placeholderTextColor="#9CA3AF"
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
                      styles.dropdownText,
                      selectedModel ? { color: COLORS.black } : null
                    ]}
                  >
                    {selectedModel || "Select Model"}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color="#6C757D"
                  />
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
              <ScrollView style={styles.modelScrollView} showsVerticalScrollIndicator={false}>
                {models.map((model, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modelOption,
                      selectedModel === model && styles.selectedModelOption
                    ]}
                    onPress={() => {
                      setSelectedModel(model);
                      setShowModelModal(false);
                    }}
                  >
                    <Text style={[
                      styles.modelOptionText,
                      selectedModel === model && styles.selectedModelText
                    ]}>
                      {model}
                    </Text>
                    {selectedModel === model && (
                      <Ionicons name="checkmark" size={20} color={COLORS.primaryBlue} />
                    )}
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
}

