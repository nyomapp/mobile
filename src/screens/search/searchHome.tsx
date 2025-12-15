import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { COLORS } from "@/src/constants";
import { router } from "expo-router";
import { useState } from "react";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { allStyles } from "../../styles/global";
import { styles } from "../../styles/searchScreenStyles";

interface Customer {
  id: string;
  name: string;
  frameNumber: string;
  mobileNumber: string;
  model: string;
  status: "uploaded" | "pending";
  date: string;
}

export default function DeliveriesHome() {
  const [activeTab, setActiveTab] = useState<"delivery" | "pending">(
    "delivery"
  );
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  const [frameNumber, setFrameNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleBack = () => {
    router.back();
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
      date: "20-10-20215"
    },
    {
      id: "2",
      name: "Customer 1",
      frameNumber: "5555858665172",
      mobileNumber: "5555858665172",
      model: "Hero Splendor",
      status: "pending",
      date: "20-10-20215"
    },
    {
      id: "3",
      name: "Customer 1",
      frameNumber: "5555858665172",
      mobileNumber: "5555858665172",
      model: "Hero Splendor",
      status: "pending",
      date: "20-10-20215"
    },
    {
      id: "4",
      name: "Customer 1",
      frameNumber: "5555858665172",
      mobileNumber: "5555858665172",
      model: "Hero Splendor",
      status: "pending",
      date: "20-10-20215"
    },
  ];

  const handleEdit = (data: any) => {
    //console.log("Edit ",data);
  };

  const handleDelete = (data: any) => {
    //console.log("Delete ",data);
  };

  const renderCustomerCard = ({ item }: { item: Customer }) => (
      <View style={allStyles.customerCard}>
        <View style={allStyles.cardHeader}>
          <View style={allStyles.cardContent}>
            <View style={allStyles.avatar}>
              <Text style={allStyles.avatarText}>
                {item.name?.charAt(0)?.toUpperCase() || "A"}
              </Text>
            </View>
            <View style={allStyles.customerInfo}>
              <Text style={allStyles.customerName}>{item.name}</Text>
              <Text style={allStyles.detailValue}>{item.model}</Text>
            </View>
          </View>
          <View style={allStyles.cardActions}>
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
          </View>
        </View>
  
        <View style={allStyles.customerDetails}>
          <View style={allStyles.detailText}>
            <Text style={allStyles.detailLabel}>Frame Number</Text>
            <Text style={allStyles.detailValue}>{item.frameNumber}</Text>
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
              {item.date}
            </Text>
          </View>
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
            Search
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search customers..."
              placeholderTextColor={COLORS.black}
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Image
                source={require("@/assets/icons/SearchIcon.png")}
                style={{
                  width: 20,
                  height: 20,
                }}
                // width={10}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
        {customers.length !== 0 ? (
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
        ) : (
          <View style={styles.noResultsContainer}>
            <Text style={styles.noResultsText}>No results found</Text>
          </View>
        )}
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
}
