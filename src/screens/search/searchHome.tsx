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

import { getAllSearchedData } from "@/src/api/search";
import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { useSearchContext } from "@/src/contexts/SearchContext";
import { useEffect, useState } from "react";
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
  const { 
  searchFilters, 
  updateSearchFilter, 
  searchResults, 
  setSearchResults,
  searchQuery,
  setSearchQuery,
  resetAll 
} = useSearchContext();
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showModelModal, setShowModelModal] = useState(false);
  // const [frameNumber, setFrameNumber] = useState("");
  // const [mobileNumber, setMobileNumber] = useState("");

 
const getData= async(query: string = searchQuery)=>{
 try {
   console.log("API call with query:", query);
   const response = await getAllSearchedData(query);
   setSearchResults(response as any);
 } catch (error) {
   console.error("Search API error:", error);
   Toast.show({
     type: "error",
     text1: "Search Error",
     text2: (error as any).message || "An error occurred while searching.",
   });
 }
};

const handleSearchChange = (text: string) => {
  setSearchQuery(text);
  
  // Call API only if search query length is greater than 5
  if (text.length > 5) {
    getData(text); // Pass the current text directly to avoid stale state
  } else if (text.length === 0) {
    // Clear results when search is empty
    setSearchResults([]);
  }
};
 useEffect(() => {
    // Cleanup function runs when component unmounts
    return () => {
      console.log("Cleaning up search screen...");
      resetAll();
      setSearchQuery("");
    };
  },[]);
  const renderCustomerCard = ({ item }: { item: any }) => (
      <View style={allStyles.customerCard}>
        <View style={allStyles.cardHeader}>
          <View style={allStyles.cardContent}>
            <View style={allStyles.avatar}>
              <Text style={allStyles.avatarText}>
                {item.firstName?.charAt(0)?.toUpperCase() || "A"}
              </Text>
            </View>
            <View style={allStyles.customerInfo}>
              <Text style={allStyles.customerName}>{item.firstName + " " + item.lastName}</Text>
              <Text style={allStyles.detailValue}>{item.vehicleModelRef?.name}</Text>
            </View>
          </View>
          <View style={allStyles.cardActions}>
              {/* <>
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
                    source={require("@/assets/icons/deleteIcon.png")}
                    style={{ width: 16, height: 16 }}
                    // width={20}
  
                    resizeMode="contain"
                  />
                </TouchableOpacity>
              </> */}
          </View>
        </View>
  
        <View style={allStyles.customerDetails}>
          <View style={allStyles.detailText}>
            <Text style={allStyles.detailLabel}>Frame Number</Text>
            <Text style={allStyles.detailValue}>{item.chassisNumber}</Text>
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
              {item.serviceStartDate ? new Date(item.serviceStartDate).toLocaleDateString('en-GB') : '02/11/2025'}
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
              placeholder="Enter last 6 digits of Frame Number"
              // placeholderTextColor={COLORS.black}
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoCorrect={false}
            />
            <TouchableOpacity style={styles.searchButton} activeOpacity={1}>
              <Image
                source={require("@/assets/icons/searchicon.png")}
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
        {searchResults.length !== 0 ? (
          <FlatList
            data={searchResults as any}
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
