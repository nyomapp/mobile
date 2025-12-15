import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { useDeliveryContext } from "@/src/contexts/DeliveryContext";
import { globalStyles } from "@/src/styles";
import { router } from "expo-router";
import { useEffect, useState } from "react";
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
  const { currentDelivery, deliveries, setCurrentDelivery } =
    useDeliveryContext();
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

  useEffect(() => {
    //console.log("Current delivery context:", currentDelivery);
    //console.log("All deliveries:", deliveries);
  }, [currentDelivery, deliveries]);

  // Initialize amounts from context if available
  useEffect(() => {
    if (currentDelivery) {
      // console.log("Initializing amounts from context:", {
      //   exShowAmount: currentDelivery.exShowAmount,
      //   insuranceAmount: currentDelivery.insuranceAmount,
      //   rtoAmount: currentDelivery.rtoAmount,
      //   accessoriesAmount: currentDelivery.accessoriesAmount,
      //   rsaAmount: currentDelivery.rsaAmount,
      //   others1: currentDelivery.others1,
      //   others2: currentDelivery.others2,
      //   others3: currentDelivery.others3,
      //   discount: currentDelivery.discount,
      //   helmetAmount: currentDelivery.helmetAmount,
      // });

      // Update local state with context values if they exist
      setAmounts((prev) =>
        prev.map((item) => {
          switch (item.id) {
            case "exShowroom":
              return {
                ...item,
                value: currentDelivery.exShowAmount?.toString() || "",
              };
            case "insurance":
              return {
                ...item,
                value: currentDelivery.insuranceAmount?.toString() || "",
              };
            case "rto":
              return {
                ...item,
                value: currentDelivery.rtoAmount?.toString() || "",
              };
            case "accessories":
              return {
                ...item,
                value: currentDelivery.accessoriesAmount?.toString() || "",
              };
            case "rsa":
              return {
                ...item,
                value: currentDelivery.rsaAmount?.toString() || "",
              };
            case "discount":
              return {
                ...item,
                value: currentDelivery.discount?.toString() || "",
              };
            case "other1":
              return {
                ...item,
                value: currentDelivery.others1?.toString() || "",
              };
            case "other2":
              return {
                ...item,
                value: currentDelivery.others2?.toString() || "",
              };
            case "other3":
              return {
                ...item,
                value: currentDelivery.others3?.toString() || "",
              };
            case "helmet":
              return {
                ...item,
                value: currentDelivery.helmetAmount?.toString() || "",
              };
            default:
              return item;
          }
        })
      );
    }
  }, [currentDelivery]);

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
    //console.log("Amount data:", amounts);

    // Convert amounts to delivery context format
    const amountData: any = {};
    amounts.forEach((item) => {
      const value = parseFloat(item.value) || 0;
      switch (item.id) {
        case "exShowroom":
          amountData.exShowAmount = value;
          break;
        case "insurance":
          amountData.insuranceAmount = value;
          break;
        case "rto":
          amountData.rtoAmount = value;
          break;
        case "accessories":
          amountData.accessoriesAmount = value;
          break;
        case "rsa":
          amountData.rsaAmount = value;
          break;
        case "helmet":
          amountData.helmetAmount = value;
          break;
        case "discount":
          amountData.discount = value;
          break;
        case "other1":
          amountData.others1 = value;
          break;
        case "other2":
          amountData.others2 = value;
          break;
        case "other3":
          amountData.others3 = value;
          break;
      }
    });

    // Update delivery context with amounts
    if (currentDelivery) {
      setCurrentDelivery({
        ...currentDelivery,
        ...amountData,
        totalAmount: calculateTotalAmount(),
      });
    }

    //console.log("Amount data stored in context:", amountData);
    // console.log("Updated delivery context:", {
    //   ...currentDelivery,
    //   ...amountData,
    // });
    router.push("/payment-mode");
  };

  const handleBack = () => {
    router.push("/document-screen");
  };

  const handleSkip = () => {
    // Skip this step

    //console.log("Skipping amount entry");
    router.push("/payment-mode");
    // router.push("/next-screen");
  };

  return (
    <SafeAreaView style={[allStyles.safeArea]} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={allStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View
         style={{ paddingTop: responsiveWidth(2) }}
         >
          <HeaderIcon />
        <View
          style={[allStyles.pageHeader]}
        >
          <View style={[{ paddingBottom: responsiveWidth(5) }]}>
            <Text style={[allStyles.pageTitle,allStyles.yellix_medium, {lineHeight:responsiveWidth(10)}]}>
              <Text>Add</Text>
              {"\n"}
              <Text style={[allStyles.headerSecondaryText, allStyles.yellix_thin]}>Delivery</Text>
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
            
            {/* Total Amount Card */}

            <View style={styles.totalAmountCard}>
              <Text style={styles.totalAmountLabel}>
                {calculateTotalAmount() > 0
                  ? calculateTotalAmount().toLocaleString("en-IN")
                  : "Total Amount"}
              </Text>
              <View style={styles.totalAmountDisplay} />
            </View>
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
                  placeholderTextColor="#BDB9BA"
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
