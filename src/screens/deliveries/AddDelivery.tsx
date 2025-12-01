import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { COLORS } from "@/src/constants";
import { globalStyles } from "@/src/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/deliveries/addDeliveryStyles";
import { allStyles } from "../../styles/global";

type DeliveryType = "New" | "Renew";

export default function AddDelivery() {
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("New");
  const [customerName, setCustomerName] = useState("");
  const [frameNumber, setFrameNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [showModelDropdown, setShowModelDropdown] = useState(false);

  // Debug log to track state
  console.log("AddDelivery render - Current deliveryType:", deliveryType);

  const models = [
    "Model A",
    "Model B", 
    "Model C",
    "Model D",
    "Model A",
    "Model B", 
    "Model C",
    "Model D"
  ];

  // Validation functions
  const validateFrameNumber = (text: string) => {
    // Allow only alphanumeric characters and limit to 17 characters
    const alphanumericOnly = text.replace(/[^a-zA-Z0-9]/g, '');
    return alphanumericOnly.slice(0, 17).toUpperCase();
  };

  const validateMobileNumber = (text: string) => {
    // Allow only numeric characters and limit to 10 digits
    const numericOnly = text.replace(/[^0-9]/g, '');
    return numericOnly.slice(0, 10);
  };

  const handleFrameNumberChange = (text: string) => {
    const validatedText = validateFrameNumber(text);
    setFrameNumber(validatedText);
  };

  const handleMobileNumberChange = (text: string) => {
    const validatedText = validateMobileNumber(text);
    setMobileNumber(validatedText);
  };

  const handleNext = () => {
    // Validation before proceeding
    // if (!customerName.trim()) {
    //   alert("Please enter customer name");
    //   return;
    // }
    
    // if (deliveryType === "New") {
    //   if (frameNumber.length !== 17) {
    //     alert("Frame number must be exactly 17 characters");
    //     return;
    //   }
    //   if (!selectedModel) {
    //     alert("Please select a model");
    //     return;
    //   }
    // }
    
    // if (deliveryType === "Renew" && !registrationNumber.trim()) {
    //   alert("Please enter registration number");
    //   return;
    // }
    
    // if (mobileNumber.length !== 10) {
    //   alert("Mobile number must be exactly 10 digits");
    //   return;
    // }
    
    // // Validate form and proceed to next step
    // console.log({
    //   deliveryType,
    //   customerName,
    //   frameNumber,
    //   mobileNumber,
    //   selectedModel,
    //   registrationNumber
    // });
    router.push("/document-screen");
  };

  const handleBack = () => {
    router.back();
  };

  const handleDeliveryTypeChange = (type: DeliveryType) => {
    console.log(`Changing delivery type to: ${type}`);
    setDeliveryType(type);
    // Clear form fields when switching types for better UX
    setCustomerName("");
    setFrameNumber("");
    setMobileNumber("");
    setSelectedModel("");
    setRegistrationNumber("");
    setShowModelDropdown(false);
    console.log(`Delivery type changed to: ${type}`);
  };

  return (
    <SafeAreaView style={[allStyles.safeArea]} edges={["top"]}>
      <KeyboardAvoidingView
        style={allStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={allStyles.pageHeader}>
          <View>
            <Text style={allStyles.pageTitle}><b>Add</b>{"\n"}Delivery</Text>
          </View>
          <HeaderIcon />
        </View>

        <ScrollView style={allStyles.formContainer} showsVerticalScrollIndicator={false}>
          {/* Toggle Buttons */}
          <View style={allStyles.toggleContainer}>
            <TouchableOpacity
              style={[
                allStyles.toggleButton,
                deliveryType === "New" && allStyles.toggleButtonActive,
                deliveryType === "New" && {
                  backgroundColor: COLORS.primaryBlue,
                  borderColor: COLORS.primaryBlue,
                }
              ]}
              onPress={() => {
                console.log("NEW button pressed, current state:", deliveryType);
                handleDeliveryTypeChange("New");
              }}
              activeOpacity={0.6}
            >
              <Text
                style={[
                  allStyles.toggleButtonText,
                  deliveryType === "New" && allStyles.toggleButtonTextActive,
                  deliveryType === "New" && { color: COLORS.white }
                ]}
              >
                New
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                allStyles.toggleButton,
                deliveryType === "Renew" && allStyles.toggleButtonActive,
                deliveryType === "Renew" && {
                  backgroundColor: COLORS.primaryBlue,
                  borderColor: COLORS.primaryBlue,
                }
              ]}
              onPress={() => {
                console.log("RENEW button pressed, current state:", deliveryType);
                handleDeliveryTypeChange("Renew");
              }}
              activeOpacity={0.6}
            >
              <Text
                style={[
                  allStyles.toggleButtonText,
                  deliveryType === "Renew" && allStyles.toggleButtonTextActive,
                  deliveryType === "Renew" && { color: COLORS.white }
                ]}
              >
                Renew
              </Text>
            </TouchableOpacity>
          </View>

          {/* Details Section */}
          <Text style={allStyles.Title}>Details</Text>

          {/* Form Fields */}
          <TextInput
            style={globalStyles.input}
            placeholder="Customer Name"
            placeholderTextColor="#6C757D"
            value={customerName}
            onChangeText={setCustomerName}
            autoCapitalize="words"
          />

          {deliveryType === "New" && (
            <TextInput
              style={globalStyles.input}
              placeholder="Frame Number (17 characters)"
              placeholderTextColor="#6C757D"
              value={frameNumber}
              onChangeText={handleFrameNumberChange}
              autoCapitalize="characters"
              maxLength={17}
            />
          )}

          <TextInput
            style={globalStyles.input}
            placeholder="Mobile Number (10 digits)"
            placeholderTextColor="#6C757D"
            value={mobileNumber}
            onChangeText={handleMobileNumberChange}
            keyboardType="numeric"
            maxLength={10}
          />

          {deliveryType === "Renew" && (
            <TextInput
              style={globalStyles.input}
              placeholder="Registration Number"
              placeholderTextColor="#6C757D"
              value={registrationNumber}
              onChangeText={setRegistrationNumber}
              keyboardType="default"
            />
          )}

          {/* Model Dropdown - Only for New deliveries */}
          {deliveryType === "New" && (
            <TouchableOpacity
              style={allStyles.dropdown}
              onPress={() => setShowModelDropdown(!showModelDropdown)}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  allStyles.dropdownText,
                  selectedModel ? { color: COLORS.black } : null
                ]}
              >
                {selectedModel || "Select Model"}
              </Text>
              <Ionicons
                name={showModelDropdown ? "chevron-up" : "chevron-down"}
                size={20}
                color="#6C757D"
              />
            </TouchableOpacity>
          )}

          {/* Dropdown Options - Only for New deliveries */}
          {deliveryType === "New" && showModelDropdown && (
            <View style={styles.dropdownOptions}>
              {models.map((model, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.dropdownOption}
                  onPress={() => {
                    setSelectedModel(model);
                    setShowModelDropdown(false);
                  }}
                >
                  <Text style={styles.dropdownOptionText}>{model}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </ScrollView>

        {/* Bottom Buttons */}
        <View style={allStyles.bottomContainer}>
          <TouchableOpacity style={allStyles.btn} onPress={handleNext}>
            <Text style={allStyles.btnText}>Next</Text>
          </TouchableOpacity>

          <TouchableOpacity style={allStyles.backButton} onPress={handleBack}>
            <Text style={allStyles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


