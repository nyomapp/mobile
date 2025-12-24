import { getModalsData } from "@/src/api/addDelivery";
import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { COLORS } from "@/src/constants";
import { useAuth } from "@/src/contexts";
import { useDeliveryContext } from "@/src/contexts/DeliveryContext";
import { useDocumentArray } from "@/src/contexts/DocumentArray1";
import { useModels } from "@/src/contexts/ModelsContext";
import { globalStyles } from "@/src/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { styles } from "../../styles/deliveries/addDeliveryStyles";
import { styles as paymentStyles } from "../../styles/deliveries/paymentModeStyles";
import { allStyles } from "../../styles/global";

type DeliveryType = "New" | "Renew";
type RTOLocationType = string | null;

export default function AddDelivery() {
  const {
    currentDelivery,
    setCurrentDelivery,
    updateDeliveryField,
    resetCurrentDelivery,
  } = useDeliveryContext();
  const { user, updateUser } = useAuth();
  const {
    models: modelsData,
    setModels,
    resetModels,
    isLoading,
    setLoading,
  } = useModels();
   const { resetDocuments } = useDocumentArray();
  const [deliveryType, setDeliveryType] = useState<DeliveryType>("New");
  const [customerName, setCustomerName] = useState("");
  const [frameNumber, setFrameNumber] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [selectedRTOLocation, setSelectedRTOLocation] =
    useState<RTOLocationType>(null);
  const [showModelModal, setShowModelModal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Initialize context on component mount
  useEffect(() => {
    //console.log("AddDelivery mounted - currentDelivery:", currentDelivery);
    if (!currentDelivery) {
      //console.log("No currentDelivery found, resetting to initial state");
      resetCurrentDelivery();
    }
  }, []);

  // Initialize form fields from context data (similar to PaymentMode)
  useEffect(() => {
    if (currentDelivery) {
      // console.log(
      //   "Initializing AddDelivery form from context:",
      //   currentDelivery
      // );

      // Set delivery type based on context
      setDeliveryType(currentDelivery.isRenewal ? "Renew" : "New");

      // Set common fields
      setCustomerName(currentDelivery.customerName || "");
      setMobileNumber(currentDelivery.mobileNumber || "");

      // Set fields specific to delivery type
      if (currentDelivery.isRenewal) {
        setRegistrationNumber(currentDelivery.registrationNumber || "");
      } else {
        setFrameNumber(currentDelivery.chassisNo || "");
        setSelectedModel(currentDelivery.modelRef || "");
      }

      // Set RTO location
      setSelectedRTOLocation(currentDelivery.rtoLocation || "null");
    }
  }, [currentDelivery]);

  // Track currentDelivery changes
  useEffect(() => {
    //console.log("AddDelivery - currentDelivery updated:", currentDelivery);
    
  }, [currentDelivery]);

  // Only call getAllModels when user is available
  useEffect(() => {
    if (user) {
      // console.log('User is available, fetching models...');
      getAllModels();
    } else {
      //console.log("User is null, skipping model fetch");
    }
  }, [user]);
  useEffect(() => {
    //console.log("Models data updated:", modelsData);
  }, [modelsData]);
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

  // Debug log to track state
  // console.log("AddDelivery render - Current deliveryType:", deliveryType);

  // Validation functions
  const validateFrameNumber = (text: string) => {
    // Allow only alphanumeric characters and limit to 17 characters
    const alphanumericOnly = text.replace(/[^a-zA-Z0-9]/g, "");
    return alphanumericOnly.slice(0, 17).toUpperCase();
  };

  const validateMobileNumber = (text: string) => {
    // Allow only numeric characters and limit to 10 digits
    const numericOnly = text.replace(/[^0-9]/g, "");
    return numericOnly.slice(0, 10);
  };

  const handleFrameNumberChange = (text: string) => {
    const validatedText = validateFrameNumber(text);
    setFrameNumber(validatedText);
    if (errors.frameNumber) {
      setErrors((prev) => ({ ...prev, frameNumber: "" }));
    }
  };

  const handleMobileNumberChange = (text: string) => {
    const validatedText = validateMobileNumber(text);
    setMobileNumber(validatedText);
    if (errors.mobileNumber) {
      setErrors((prev) => ({ ...prev, mobileNumber: "" }));
    }
  };

  const handleNext = () => {
    const newErrors: { [key: string]: string } = {};

    // Common validations for both New and Renew
    if (!customerName.trim()) {
      newErrors.customerName = "Customer name is required";
    }

    if (!mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required";
    } else if (mobileNumber.length !== 10) {
      newErrors.mobileNumber = "Mobile number must be exactly 10 digits";
    }

    // Validations specific to New delivery
    if (deliveryType === "New") {
      if (!frameNumber.trim()) {
        newErrors.frameNumber = "Frame number is required";
      } else if (frameNumber.length !== 6) {
        newErrors.frameNumber = "Frame number must be exactly 6 characters";
      }

      if (!selectedModel.trim()) {
        newErrors.selectedModel = "Please select a model";
      }
    }

    // Validations specific to Renew delivery
    if (deliveryType === "Renew") {
      if (!registrationNumber.trim()) {
        newErrors.registrationNumber = "Registration number is required";
      }
    }
    if (!selectedRTOLocation || selectedRTOLocation === "null" || selectedRTOLocation === "" ) {
      newErrors.selectedRTOLocation = "Please select an RTO location";
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // Show first error message using Toast
      const firstError = Object.values(newErrors)[0];
      if (firstError) {
        Toast.show({
          type: "error",
          text1: "Validation Error",
          text2: firstError,
          visibilityTime: 3000,
        });
      }
      return;
    }

    // Store form data in context
    const deliveryData = {
      ...currentDelivery,
      isRenewal: deliveryType === "Renew",
      customerName: customerName.trim(),
      mobileNumber: mobileNumber.trim(),
      ...(deliveryType === "New" && {
        chassisNo: frameNumber.trim(),
        modelRef: selectedModel, // In real app, this would be model ID
      }),
      ...(deliveryType === "Renew" && {
        registrationNumber: registrationNumber.trim(),
      }),
      rtoLocation: selectedRTOLocation,
      userRef: user ? user.id : "",
    };

    setCurrentDelivery(deliveryData);

    //console.log("Form validated and stored in context:", deliveryData);
    router.push("/document-screen");
  };

  const handleBack = () => {
    resetCurrentDelivery();
    resetDocuments();
    router.back();
  };

  const handleDeliveryTypeChange = (type: DeliveryType) => {
    // console.log(`Changing delivery type to: ${type}`);
    setDeliveryType(type);
    // Clear form fields when switching types for better UX
    setCustomerName("");
    setFrameNumber("");
    setMobileNumber("");
    setSelectedModel("");
    setRegistrationNumber("");
    setSelectedRTOLocation(null); // Reset to default
    setShowModelModal(false);
    setErrors({}); // Clear all errors when switching types

    // Reset context state when switching delivery types
    resetCurrentDelivery();

    // console.log(`Delivery type changed to: ${type} and context state reset`);
  };

  return (
    <SafeAreaView style={[allStyles.safeArea]} edges={["top"]}>
      <KeyboardAvoidingView
        style={allStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View
         style={{ paddingTop: responsiveWidth(2) }}
         >
          <HeaderIcon />
        </View>
        <View style={allStyles.pageHeader}>
          <View>
            <Text style={[allStyles.pageTitle, { lineHeight:responsiveWidth(10) }]}>
              <Text style={[allStyles.yellix_medium]}>Add</Text>
              {"\n"}
              <Text style={[allStyles.headerSecondaryText, allStyles.yellix_thin]}>Delivery</Text>
            </Text>
          </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
            }}
          >
            {/* Toggle Buttons */}
            <View style={allStyles.toggleContainer}>
              <TouchableOpacity
                style={[
                  allStyles.toggleButton,
                  deliveryType === "New" && allStyles.toggleButtonActive,
                  deliveryType === "New" && {
                    backgroundColor: COLORS.primaryBlue,
                    borderColor: COLORS.primaryBlue,
                  },
                ]}
                onPress={() => {
                  // console.log("NEW button pressed, current state:", deliveryType);
                  handleDeliveryTypeChange("New");
                }}
                activeOpacity={0.6}
              >
                <Text
                  style={[
                    allStyles.toggleButtonText,
                    deliveryType === "New" && allStyles.toggleButtonTextActive,
                    deliveryType === "New" && { color: COLORS.white },
                    allStyles.yellix_thin,
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
                  },
                ]}
                onPress={() => {
                  // console.log("RENEW button pressed, current state:", deliveryType);
                  handleDeliveryTypeChange("Renew");
                }}
                activeOpacity={0.6}
              >
                <Text
                  style={[
                    allStyles.toggleButtonText,
                    deliveryType === "Renew" &&
                    allStyles.toggleButtonTextActive,
                    deliveryType === "Renew" && { color: COLORS.white },
                    allStyles.yellix_thin,
                  ]}
                >
                  Renew
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <ScrollView
          style={[
            allStyles.scrollContent,
            {
              paddingTop: responsiveWidth(4),
              paddingHorizontal: responsiveWidth(1),
            },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Details Section */}
          <Text style={allStyles.Title}>Details</Text>

          {/* Form Fields */}
          <TextInput
            style={[
              globalStyles.input,
              errors.customerName ? { borderColor: "red", borderWidth: 1 } : {},
            ]}
            placeholder="Customer Name *"
            // placeholderTextColor={COLORS.black}
            value={customerName}
            onChangeText={(text) => {
              setCustomerName(text);
              if (errors.customerName) {
                setErrors((prev) => ({ ...prev, customerName: "" }));
              }
            }}
            autoCapitalize="words"
          />

          {deliveryType === "New" && (
            <TextInput
              style={[
                globalStyles.input,
                errors.frameNumber
                  ? { borderColor: "red", borderWidth: 1 }
                  : {},
              ]}
              placeholder="Frame Number (Last 6 characters) *"
              // placeholderTextColor={COLORS.black}
              value={frameNumber}
              onChangeText={handleFrameNumberChange}
              autoCapitalize="characters"
              maxLength={6}
            />
          )}

          <TextInput
            style={[
              globalStyles.input,
              errors.mobileNumber ? { borderColor: "red", borderWidth: 1 } : {},
            ]}
            placeholder="Mobile Number (10 digits) *"
            // placeholderTextColor={COLORS.black}
            value={mobileNumber}
            onChangeText={handleMobileNumberChange}
            keyboardType="numeric"
            maxLength={10}
          />

          {deliveryType === "Renew" && (
            <TextInput
              style={[
                globalStyles.input,
                errors.registrationNumber
                  ? { borderColor: "red", borderWidth: 1 }
                  : {},
              ]}
              placeholder="Registration Number *"
              // placeholderTextColor={COLORS.black}
              value={registrationNumber}
              onChangeText={(text) => {
                setRegistrationNumber(text);
                if (errors.registrationNumber) {
                  setErrors((prev) => ({ ...prev, registrationNumber: "" }));
                }
              }}
              keyboardType="default"
            />
          )}

          {/* Model Dropdown - Only for New deliveries */}
          {deliveryType === "New" && (
            <TouchableOpacity
              style={[
                allStyles.dropdown,
                errors.selectedModel
                  ? { borderColor: "red", borderWidth: 1 }
                  : {},
              ]}
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
                  : "Select Model *"}
              </Text>
              <Ionicons name="chevron-down" size={20} color="#6C757D" />
            </TouchableOpacity>
          )}

          {/* RTO Location Selection - Only for New deliveries */}
          {/* {deliveryType === "New" && ( */}
          <View style={paymentStyles.sectionContainer}>
            <Text
              style={[allStyles.Title, { fontSize: responsiveFontSize(3) }]}
            >
              RTO Location
            </Text>

            <View style={styles.radioRow}>
              {/* Same City Option */}
              <TouchableOpacity
                style={styles.radioContainer}
                onPress={() => setSelectedRTOLocation("sameCity")}
              >
                <View style={styles.radioButton}>
                  {selectedRTOLocation === "sameCity" && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.radioText}>Same City & Same State</Text>
              </TouchableOpacity>

              {/* Same State Option */}
              <TouchableOpacity
                style={styles.radioContainer}
                onPress={() => setSelectedRTOLocation("sameState")}
              >
                <View style={styles.radioButton}>
                  {selectedRTOLocation === "sameState" && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.radioText}>Other City & Same State</Text>
              </TouchableOpacity>

              {/* Other State Option */}
              <TouchableOpacity
                style={styles.radioContainer}
                onPress={() => setSelectedRTOLocation("otherState")}
              >
                <View style={styles.radioButton}>
                  {selectedRTOLocation === "otherState" && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.radioText}>Other State</Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* )} */}

          {/* Model Selection Modal */}
          <Modal
            animationType="fade"
            transparent={true}
            visible={showModelModal}
            onRequestClose={() => setShowModelModal(false)}
          >
            <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                <View style={styles.modalHeader}>
                  <Text style={styles.modalTitle}>Select Model</Text>
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setShowModelModal(false)}
                  >
                    <Ionicons name="close" size={24} color="#6C757D" />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  style={styles.modalScrollView}
                  showsVerticalScrollIndicator={false}
                >
                  {modelsData.map((model, index) => (
                    <TouchableOpacity
                      key={index}
                      style={[
                        styles.modalOption,
                        selectedModel === model._id && styles.selectedOption,
                      ]}
                      onPress={() => {
                        setSelectedModel(model._id);
                        setShowModelModal(false);
                        if (errors.selectedModel) {
                          setErrors((prev) => ({ ...prev, selectedModel: "" }));
                        }
                      }}
                    >
                      <Text
                        style={[
                          styles.modalOptionText,
                          selectedModel === model._id &&
                          styles.selectedOptionText,
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
      <Toast />
    </SafeAreaView>
  );
}
