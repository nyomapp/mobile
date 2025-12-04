import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { COLORS } from "@/src/constants";
import { globalStyles } from "@/src/styles";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
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
import { styles } from "../../styles/deliveries/paymentModeStyles";
import { allStyles } from "../../styles/global";

type DeliveryType = "New" | "Renew";
type PaymentMode = "Cash" | "Finance";

export default function PaymentMode() {
  const [selectedPaymentMode, setSelectedPaymentMode] =
    useState<PaymentMode>("Cash");
  const [financierName, setFinancierName] = useState("");
  const [financeAmount, setFinanceAmount] = useState("");
  const [financierPlan1, setFinancierPlan1] = useState("");
  const [financierPlan2, setFinancierPlan2] = useState("");
  const [showFinancierModal, setShowFinancierModal] = useState(false);
  const [showPlan1Modal, setShowPlan1Modal] = useState(false);

  const handleBack = () => {
    router.back();
  };

  const handleNext = () => {
    console.log("Next pressed");
    // Handle next logic
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
              <Text style={{fontWeight: 'bold'}}>Add</Text>
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
                onPress={() => setSelectedPaymentMode("Cash")}
              >
                <View style={styles.radioButton}>
                  {selectedPaymentMode === "Cash" && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.radioText}>Cash</Text>
              </TouchableOpacity>

              {/* Finance Option */}
              <TouchableOpacity
                style={styles.radioContainer}
                onPress={() => setSelectedPaymentMode("Finance")}
              >
                <View style={styles.radioButton}>
                  {selectedPaymentMode === "Finance" && (
                    <View style={styles.radioSelected} />
                  )}
                </View>
                <Text style={styles.radioText}>Finance</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Finance Fields - Only show when Finance is selected */}
          {selectedPaymentMode === "Finance" && (
            <View style={styles.financeFieldsContainer}>
              {/* Financier Name Select */}
              <View style={styles.fieldContainer}>
                {/* <Text style={styles.fieldLabel}>Financier Name</Text> */}
                <TouchableOpacity
                  style={allStyles.dropdown}
                  onPress={() => setShowFinancierModal(true)}
                >
                  <Text
                    style={[
                      allStyles.dropdownText,
                      !financierName && styles.placeholderText,
                    ]}
                  >
                    {financierName || "Select Financier"}
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
                    style={globalStyles.input}
                    placeholder="Enter finance amount"
                    placeholderTextColor="#9CA3AF"
                    value={financeAmount}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, "");
                      setFinanceAmount(numericValue);
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
                  style={allStyles.dropdown}
                  onPress={() => setShowPlan1Modal(true)}
                >
                  <Text
                    style={[
                      allStyles.dropdownText,
                      !financierPlan1 && styles.placeholderText,
                    ]}
                  >
                    {financierPlan1 || "Financier Plan 1"}
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
                    style={globalStyles.input}
                    placeholder="Financier Plan 2"
                    placeholderTextColor="#9CA3AF"
                    value={financierPlan2}
                    onChangeText={(text) => {
                      const numericValue = text.replace(/[^0-9]/g, "");
                      setFinancierPlan2(numericValue);
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
                {financierOptions.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modalOption,
                      financierName === option && styles.selectedOption,
                    ]}
                    onPress={() => {
                      setFinancierName(option);
                      setShowFinancierModal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        financierName === option && styles.selectedOptionText,
                      ]}
                    >
                      {option}
                    </Text>
                    {financierName === option && (
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
                {plan1Options.map((option, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.modalOption,
                      financierPlan1 === option && styles.selectedOption,
                    ]}
                    onPress={() => {
                      setFinancierPlan1(option);
                      setShowPlan1Modal(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.modalOptionText,
                        financierPlan1 === option && styles.selectedOptionText,
                      ]}
                    >
                      {option}
                    </Text>
                    {financierPlan1 === option && (
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
    </SafeAreaView>
  );
}
