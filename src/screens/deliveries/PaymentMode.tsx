import { getAllFinancierData, getAllMasterData } from "@/src/api/addDelivery";
import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { COLORS } from "@/src/constants";
import { useFinancierData, useMasterData } from "@/src/contexts";
import { useDeliveryContext } from "@/src/contexts/DeliveryContext";
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
import { responsiveWidth } from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { styles } from "../../styles/deliveries/paymentModeStyles";
import { allStyles } from "../../styles/global";

type PaymentMode = "cash" | "finance";

export default function PaymentMode() {
  const { currentDelivery, setCurrentDelivery } = useDeliveryContext();
  const {
    data: masterData,
    setData,
    updateField,
    updateMultipleFields,
    resetData,
    getField,
  } = useMasterData();
  const {
    data: financierData,
    setData: setFinancierData,
    addItem,
    resetData: resetFinancierData,
    clearData,
  } = useFinancierData();
  const [selectedPaymentMode, setSelectedPaymentMode] =
    useState<PaymentMode>("cash");
  const [financierName, setFinancierName] = useState("");
  const [financeAmount, setFinanceAmount] = useState("");
  const [financierPlan1, setFinancierPlan1] = useState("");
  const [financierPlan2, setFinancierPlan2] = useState("");
  const [showFinancierModal, setShowFinancierModal] = useState(false);
  const [showPlan1Modal, setShowPlan1Modal] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  // Initialize from context
  useEffect(() => {
    if (currentDelivery) {
      setSelectedPaymentMode(
        currentDelivery.purchaseType === "finance" ? "finance" : "cash"
      );
      setFinancierName(currentDelivery.financerRef || "");
      setFinanceAmount(currentDelivery.financeAmount?.toString() || "");
      setFinancierPlan1(currentDelivery.financierPlan1 || "");
      setFinancierPlan2(currentDelivery.financierPlan2?.toString() || "");
    }
  }, [currentDelivery]);

  useEffect(() => {
    //console.log("Master Data Context:", masterData);
    //console.log("Financier Data Context:", financierData);
    //console.log("Current Delivery Context:", currentDelivery);
  }, [financierData, masterData, currentDelivery]);
  useEffect(() => {
    if (selectedPaymentMode === "finance") {
      getFinacierData();
    }
  }, [selectedPaymentMode]);
  const getFinacierData = async () => {
    try {
      const response = await getAllMasterData();
      setData(response as any);
      const financierPlanData = await getAllFinancierData();
      setFinancierData(financierPlanData as any);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "error fetching financier data",
        text2: (error as any)?.message || "Unknown error",
      });
    }
  };

  const handleBack = () => {
    router.push("/amount");
  };

  const handleNext = () => {
    //console.log("Next pressed");

    const newErrors: { [key: string]: string } = {};

    // Validation for finance mode
    if (selectedPaymentMode === "finance") {
      if (!financierName.trim()) {
        newErrors.financierName = "Please select a financier";
      }
      if (!financeAmount.trim()) {
        newErrors.financeAmount = "Finance amount is required";
      }
      if (!financierPlan1.trim()) {
        newErrors.financierPlan1 = "Please select financier plan 1";
      }
      if (!financierPlan2.trim()) {
        newErrors.financierPlan2 = "Financier plan 2 is required";
      }
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

    // Update delivery context with payment data
    if (currentDelivery) {
      const paymentData = {
        ...currentDelivery,
        purchaseType: selectedPaymentMode,
        ...(selectedPaymentMode === "finance" && {
          financerRef: financierName.trim(),
          financeAmount: parseFloat(financeAmount) || 0,
          financierPlan1: financierPlan1.trim(),
          financierPlan2: parseFloat(financierPlan2) || 0,
        }),
      };

      setCurrentDelivery(paymentData);

      //console.log("Payment data stored in context:", paymentData);
    }

    router.push("/preview");
  };

  const financierOptions = [
    "HDFC Bank",
    "ICICI Bank",
    "SBI",
    "Axis Bank",
    "Kotak Mahindra",
  ];
  const plan1Options = ["Plan A", "Plan B", "Plan C", "Plan D"];

  return (
    <SafeAreaView style={[allStyles.safeArea]} edges={["top"]}>
      <KeyboardAvoidingView
        style={allStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={{ paddingTop: responsiveWidth(6) }}>
          <HeaderIcon />
        </View>
        <View style={allStyles.pageHeader}>
          <View>
            <Text style={allStyles.pageTitle}>
              <Text style={{ fontWeight: "bold" }}>Add</Text>
              {"\n"}
              <Text style={allStyles.headerSecondaryText}>Delivery</Text>
            </Text>
          </View>
        </View>

        <ScrollView
          style={[allStyles.scrollContent, { paddingTop: responsiveWidth(4) }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Payment Mode Selection */}
          <View style={styles.sectionContainer}>
            <Text style={allStyles.Title}>Payment Mode</Text>

            <View style={styles.radioRow}>
              {/* Cash Option */}
              <TouchableOpacity
                style={styles.radioContainer}
                onPress={() => setSelectedPaymentMode("cash")}
              >
                <View style={styles.radioButton}>
                  {selectedPaymentMode === "cash" && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.radioText}>Cash</Text>
              </TouchableOpacity>

              {/* Finance Option */}
              <TouchableOpacity
                style={styles.radioContainer}
                onPress={() => setSelectedPaymentMode("finance")}
              >
                <View style={styles.radioButton}>
                  {selectedPaymentMode === "finance" && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.radioText}>Finance</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Finance Fields - Only show when Finance is selected */}
          {selectedPaymentMode === "finance" && (
            <View style={styles.financeFieldsContainer}>
              {/* Financier Name Select */}
              <View style={styles.fieldContainer}>
                {/* <Text style={styles.fieldLabel}>Financier Name</Text> */}
                <TouchableOpacity
                  style={[
                    allStyles.dropdown,
                    errors.financierName
                      ? { borderColor: "red", borderWidth: 1 }
                      : {},
                  ]}
                  onPress={() => setShowFinancierModal(true)}
                >
                  <Text
                    style={[
                      allStyles.dropdownText,
                      !financierName && styles.placeholderText,
                    ]}
                  >
                    {financierName
                      ? financierData.find((f) => f._id === financierName)
                        ?.name || financierName
                      : "Select Financier"}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={COLORS.black}
                  />
                </TouchableOpacity>
              </View>

              {/* Finance Amount */}
              <View style={styles.fieldContainer}>
                {/* <Text style={styles.fieldLabel}>Finance Amount</Text> */}
                <View style={allStyles.formContainer}>
                  <TextInput
                    style={[
                      globalStyles.input,
                      errors.financeAmount
                        ? { borderColor: "red", borderWidth: 1 }
                        : {},
                    ]}
                    placeholder="Enter finance amount"
                    placeholderTextColor={COLORS.black}
                    value={financeAmount}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, "");
                      setFinanceAmount(numericValue);
                      if (errors.financeAmount) {
                        setErrors((prev) => ({ ...prev, financeAmount: "" }));
                      }
                    }}
                    keyboardType="numeric"
                    autoCorrect={false}
                  />
                </View>
              </View>

              {/* Financier Plan 1 Select */}
              <View style={styles.fieldContainer}>
                {/* <Text style={styles.fieldLabel}>Financier Plan 1</Text> */}
                <TouchableOpacity
                  style={[
                    allStyles.dropdown,
                    errors.financierPlan1
                      ? { borderColor: "red", borderWidth: 1 }
                      : {},
                  ]}
                  onPress={() => setShowPlan1Modal(true)}
                >
                  <Text
                    style={[
                      allStyles.dropdownText,
                      !financierPlan1 && styles.placeholderText,
                    ]}
                  >
                    {financierPlan1
                      ? masterData?.financierPlans?.find(
                        (p: any) => p._id === financierPlan1
                      )?.name || financierPlan1
                      : "Financier Plan 1"}
                  </Text>
                  <Ionicons
                    name="chevron-down"
                    size={20}
                    color={COLORS.black}
                  />
                </TouchableOpacity>
              </View>

              {/* Financier Plan 2 */}
              <View style={styles.fieldContainer}>
                {/* <Text style={styles.fieldLabel}>Financier Plan 2</Text> */}
                <View style={allStyles.formContainer}>
                  <TextInput
                    style={[
                      globalStyles.input,
                      errors.financierPlan2
                        ? { borderColor: "red", borderWidth: 1 }
                        : {},
                    ]}
                    placeholder="Financier Plan 2"
                    placeholderTextColor={COLORS.black}
                    value={financierPlan2}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, "");
                      setFinancierPlan2(numericValue);
                      if (errors.financierPlan2) {
                        setErrors((prev) => ({ ...prev, financierPlan2: "" }));
                      }
                    }}
                    keyboardType="numeric"
                    autoCorrect={false}
                  />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Financier Selection Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showFinancierModal}
          onRequestClose={() => setShowFinancierModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Financier</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowFinancierModal(false)}
                >
                  <Ionicons name="close" size={24} color="#6C757D" />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={styles.modalScrollView}
                showsVerticalScrollIndicator={false}
              >
                {financierData?.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modalOption,
                      financierName === option._id && styles.selectedOption,
                    ]}
                    onPress={() => {
                      setFinancierName(option._id);
                      setShowFinancierModal(false);
                      if (errors.financierName) {
                        setErrors((prev) => ({ ...prev, financierName: "" }));
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        financierName === option._id &&
                        styles.selectedOptionText,
                      ]}
                    >
                      {option.name}
                    </Text>
                    {financierName === option._id && (
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

        {/* Plan 1 Selection Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showPlan1Modal}
          onRequestClose={() => setShowPlan1Modal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Select Plan 1</Text>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setShowPlan1Modal(false)}
                >
                  <Ionicons name="close" size={24} color="#6C757D" />
                </TouchableOpacity>
              </View>
              <ScrollView
                style={styles.modalScrollView}
                showsVerticalScrollIndicator={false}
              >
                {masterData?.financierPlans?.map((option: any, index: any) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modalOption,
                      financierPlan1 === option._id && styles.selectedOption,
                    ]}
                    onPress={() => {
                      setFinancierPlan1(option._id);
                      setShowPlan1Modal(false);
                      if (errors.financierPlan1) {
                        setErrors((prev) => ({ ...prev, financierPlan1: "" }));
                      }
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        financierPlan1 === option._id &&
                        styles.selectedOptionText,
                      ]}
                    >
                      {option.name}
                    </Text>
                    {financierPlan1 === option._id && (
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
