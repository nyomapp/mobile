import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { globalStyles } from "@/src/styles";
import { router } from "expo-router";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/amountStyles";
import { allStyles } from "../../styles/global";

interface AmountField {
  id: string;
  label: string;
  value: string;
}

export default function AmountScreen() {
  const [amounts, setAmounts] = useState<AmountField[]>([
    { id: "exShowroom", label: "Ex-Showroom", value: "" },
    { id: "insurance", label: "Insurance", value: "" },
    { id: "rto", label: "RTO", value: "" },
    { id: "accessories", label: "Accessories", value: "" },
    { id: "helmet", label: "Helmet", value: "" },
    { id: "rsa", label: "RSA", value: "" },
    { id: "discount", label: "Discount", value: "" },
    { id: "other1", label: "Other 1", value: "" },
    { id: "other2", label: "Other 2", value: "" },
    { id: "other3", label: "Other 3", value: "" },
    
  ]);

  // Calculate total amount from all fields
  const calculateTotalAmount = () => {
    return amounts.reduce((total, item) => {
      const value = parseFloat(item.value) || 0;
      // Subtract discount, add all other amounts
      if (item.id === "discount") {
        return total - value;
      }
      return total + value;
    }, 0);
  };

  const handleAmountChange = (id: string, value: string) => {
    // Allow only numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, "");

    setAmounts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, value: numericValue } : item
      )
    );
  };

  const handleNext = () => {
    // Validate and proceed
    console.log("Amount data:", amounts);
    router.push("/payment-mode");
  };

  const handleBack = () => {
    router.back();
  };

  const handleSkip = () => {
    // Skip this step
    console.log("Skipping amount entry");
    // router.push("/next-screen");
  };

  return (
    <SafeAreaView style={[allStyles.safeArea]} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={allStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={[allStyles.pageHeader,{paddingTop:responsiveWidth(6)}]}>
          <View style={{paddingBottom:responsiveWidth(5)}}>
                      <Text style={allStyles.pageTitle}>
                        <Text style={{fontWeight: 'bold'}}>Add</Text>{"\n"}<Text style={allStyles.headerSecondaryText}>Delivery</Text>
                      </Text>
                    </View>
          <View
            style={{
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "flex-end",
              gap: responsiveWidth(5),
            }}
          >
            <HeaderIcon />
            {/* Total Amount Card */}

            <View style={styles.totalAmountCard}>
              <Text style={styles.totalAmountLabel}>{calculateTotalAmount() > 0
                    ? calculateTotalAmount().toLocaleString("en-IN")
                    : "Total Amount"}</Text>
              <View style={styles.totalAmountDisplay}/>
            </View>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Amount Fields */}
          <View style={styles.formSection}>
            {amounts.map((item, index) => (
              <View key={item.id} style={styles.amountRow}>
                <Text
                  style={[
                    styles.amountLabel,
                    item.id === "discount" && styles.discountLabel,
                  ]}
                >
                  {item.label}
                </Text>
                <TextInput
                  style={[globalStyles.input, styles.amountInput]}
                  placeholder="Amount"
                  placeholderTextColor="#9CA3AF"
                  value={item.value}
                  onChangeText={(value) => handleAmountChange(item.id, value)}
                  keyboardType="decimal-pad"
                />
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Navigation */}
        <View style={styles.bottomNavigation}>
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <Text style={allStyles.backButtonText}>← Back</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[allStyles.btn, styles.nextButton]}
            onPress={handleNext}
          >
            <Text style={allStyles.btnText}>Next</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.skipButton} onPress={handleSkip}>
            <Text style={styles.skipButtonText}>Skip →</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
