import {
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import Toast from "react-native-toast-message";

import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { router } from "expo-router";
import { useState } from "react";
import {
  responsiveWidth
} from "react-native-responsive-dimensions";
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
            Search
          </Text>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Search customers..."
              placeholderTextColor="#9CA3AF"
              value={searchQuery}
              onChangeText={setSearchQuery}
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.searchButton}>
              <Image
                source={require("@/assets/icons/SearchIcon.png")}
                // style={styles.img}
                // width={10}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
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
      </KeyboardAvoidingView>
      <Toast />
    </SafeAreaView>
  );
}

