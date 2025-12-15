import {
  createDelivery,
  getAllFinancierData,
  getAllMasterData,
} from "@/src/api/addDelivery";
import { updateDeliveryById } from "@/src/api/deliveriesHome";
import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { FONTS } from "@/src/constants";
import { useFinancierData, useMasterData } from "@/src/contexts";
import { useDeliveryContext } from "@/src/contexts/DeliveryContext";
import { useModels } from "@/src/contexts/ModelsContext";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { responsiveFontSize, responsiveWidth } from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { allStyles } from "../../styles/global";
import { styles } from "../../styles/previewStyles";
interface DetailField {
  label: string;
  value: string;
}

interface DocumentItem {
  title: string;
  image: any; // You can replace with actual image imports
}

export default function PreviewScreen() {
  const {
    currentDelivery,
    resetCurrentDelivery,
    isEdit,
    deliveryId,
    resetDeliveryId,
    resetIsEdit,
  } = useDeliveryContext();
  const { data: masterData, setData: setMasterData } = useMasterData();
  const { data: financierData, setData: setFinancierData } = useFinancierData();
  const { models: modelsData, setModels } = useModels();

  const [resolvedNames, setResolvedNames] = useState({
    modelName: "",
    financierName: "",
    financierPlan1Name: "",
  });

  // Load API data and resolve names
  useEffect(() => {
    const loadAndResolveData = async () => {
      try {
        // Load master data and financier data if not already loaded
        if (!masterData || Object.keys(masterData).length === 0) {
          const masterResponse = await getAllMasterData();
          setMasterData(masterResponse as any);
        }

        if (!financierData || financierData.length === 0) {
          const financierResponse = await getAllFinancierData();
          setFinancierData(financierResponse as any);
        }
      } catch (error) {
        console.error("Error loading API data:", error);
      }
    };

    loadAndResolveData();
  }, []);

  // Resolve IDs to names when data is available
  useEffect(() => {
    if (currentDelivery && (masterData || financierData || modelsData)) {
      const resolved = {
        modelName:
          modelsData?.find((model) => model._id === currentDelivery.modelRef)
            ?.name ||
          currentDelivery.modelRef ||
          "N/A",
        financierName:
          financierData?.find((f) => f._id === currentDelivery.financerRef)
            ?.name ||
          currentDelivery.financerRef ||
          "N/A",
        financierPlan1Name:
          masterData?.financierPlans?.find(
            (p: any) => p._id === currentDelivery.financierPlan1
          )?.name ||
          currentDelivery.financierPlan1 ||
          "N/A",
      };

      setResolvedNames(resolved);
      //console.log("Resolved names:", resolved);
    }
  }, [currentDelivery, masterData, financierData, modelsData]);

  // Details data from delivery context with resolved names
  const detailsData: DetailField[] = [
    { label: "Customer Name:", value: currentDelivery?.customerName || "N/A" },
    {
      label: currentDelivery?.isRenewal
        ? "Registration Number:"
        : "Frame Number:",
      value: currentDelivery?.isRenewal
        ? currentDelivery?.registrationNumber || "N/A"
        : currentDelivery?.chassisNo || "N/A",
    },
    { label: "Mobile Number:", value: currentDelivery?.mobileNumber || "N/A" },
    { label: "Model:", value: resolvedNames.modelName || "N/A" },
    {
      label: "RTO Location:",
      value:
        currentDelivery?.rtoLocation
          ?.replace(/([A-Z])/g, " $1")
          .trim()
          .replace(/^./, (str) => str.toUpperCase()) || "N/A",
    },
  ];

  const moreDetailsData: DetailField[] = [
    {
      label: "Ex-Showroom",
      value: `₹${
        currentDelivery?.exShowAmount?.toLocaleString("en-IN") || "0"
      }`,
    },
    {
      label: "Insurance",
      value: `₹${
        currentDelivery?.insuranceAmount?.toLocaleString("en-IN") || "0"
      }`,
    },
    {
      label: "RTO",
      value: `₹${currentDelivery?.rtoAmount?.toLocaleString("en-IN") || "0"}`,
    },
    {
      label: "Accessories",
      value: `₹${
        currentDelivery?.accessoriesAmount?.toLocaleString("en-IN") || "0"
      }`,
    },
    {
      label: "RSA",
      value: `₹${currentDelivery?.rsaAmount?.toLocaleString("en-IN") || "0"}`,
    },
    {
      label: "Helmet",
      value: `₹${
        currentDelivery?.helmetAmount?.toLocaleString("en-IN") || "0"
      }`,
    },
    {
      label: "Other 1",
      value: `₹${currentDelivery?.others1?.toLocaleString("en-IN") || "0"}`,
    },
    {
      label: "Other 2",
      value: `₹${currentDelivery?.others2?.toLocaleString("en-IN") || "0"}`,
    },
    {
      label: "Other 3",
      value: `₹${currentDelivery?.others3?.toLocaleString("en-IN") || "0"}`,
    },
    {
      label: "Discount",
      value: `₹${currentDelivery?.discount?.toLocaleString("en-IN") || "0"}`,
    },
    {
      label: "Total Amount",
      value: `₹${currentDelivery?.totalAmount?.toLocaleString("en-IN") || "0"}`,
    },
  ];

  // Documents data from delivery context
  const documentsData: DocumentItem[] =
    currentDelivery?.downloadDocuments?.map((doc) => ({
      title: doc.documentName
        .replace(/_/g, " ")
        .toLowerCase()
        .replace(/\b\w/g, (l) => l.toUpperCase()),
      image: null, // Image URL would be doc.fileUrl in real implementation
    })) || [];
  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await updateDeliveryById(deliveryId, currentDelivery);
        resetIsEdit();
        resetDeliveryId();
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Delivery updated successfully!",
        });
      } else {
        await createDelivery(currentDelivery);
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Delivery created successfully!",
        });
      }

      // Reset context after successful submission
      resetCurrentDelivery();

      // Add delay to allow toast to be visible before navigation
      setTimeout(() => {
        router.push("/(tabs)/deliveries");
      }, 1000);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Submission Error",
        text2:
          (error as any).message ||
          "An error occurred while submitting the delivery.",
      });
      console.error("Error creating delivery:", error);
      // Reset context even on error to prevent stuck state
      resetCurrentDelivery();
      return;
    }
  };
  const handleBack = () => {
    // Navigate back to the previous screen
    //console.log("Back button pressed");
    router.push("/payment-mode");
  };
  const renderDetailSection = (
    title: string,
    data: DetailField[],
    showAsInputs: boolean = false
  ) => (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={[allStyles.Title, { marginTop:0,marginBottom:0,fontSize:responsiveFontSize(3) }]}>
          {title}
        </Text>
        <TouchableOpacity>
          <Image
            source={require("@/assets/icons/previewPageEditIcon.png")}
            style={{
              width: 27,
              height: 27,
            }}
            resizeMode="contain"
          />
        </TouchableOpacity>
      </View>
      {data.map((item, index) => (
        <View
          key={index}
          style={showAsInputs ? styles.detailRowSpaced : styles.detailRow}
        >
          <Text
            style={[
              styles.detailLabel,
              showAsInputs ? { fontFamily: FONTS.YellixThin } : null,
            ]}
          >
            {item.label}
          </Text>
          {showAsInputs ? (
            <View style={styles.amountInputBox}>
              <Text style={styles.amountPlaceholder}>{item.value}</Text>
            </View>
          ) : (
            <Text style={styles.detailValue}>{item.value}</Text>
          )}
        </View>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={allStyles.safeArea} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={allStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.headerContainer}>
          <HeaderIcon />
        </View>
        <View style={[allStyles.pageHeader]}>
          <View>
            <Text style={[allStyles.pageTitle]}>
              Preview
            </Text>
          </View>
        </View>

        {/* Scrollable Content */}
        <ScrollView
          style={[allStyles.scrollContent, { marginTop: responsiveWidth(4) }]}
          showsVerticalScrollIndicator={false}
          //   contentContainerStyle={styles.scrollContent}
        >
          {/* Details Section */}
          {renderDetailSection("Details", detailsData)}

          {/* More Details Section */}
          {renderDetailSection("More Details", moreDetailsData, true)}

          {/* Payment Mode Section - Only show if finance */}

          {currentDelivery?.purchaseType === "finance" &&
            renderDetailSection("Payment Details", [
              { label: "Payment Mode:", value: "Finance" },
              {
                label: "Financier:",
                value: resolvedNames.financierName || "N/A",
              },
              {
                label: "Finance Amount:",
                value: `₹${
                  currentDelivery?.financeAmount?.toLocaleString("en-IN") || "0"
                }`,
              },
              {
                label: "Financier Plan 1:",
                value: resolvedNames.financierPlan1Name || "N/A",
              },
              {
                label: "Financier Plan 2:",
                value: currentDelivery?.financierPlan2?.toString() || "N/A",
              },
            ])}

          {currentDelivery?.purchaseType === "cash" &&
            renderDetailSection("Payment Details", [
              { label: "Payment Mode:", value: "Cash" },
            ])}

          {/* Documents Section */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Documents</Text>
              <TouchableOpacity>
                <Image
                  source={require("@/assets/icons/previewPageEditIcon.png")}
                  style={{
                    width: 27,
                    height: 27,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            {documentsData.map((doc, index) => (
              <View key={index} style={styles.documentItem}>
                <Text style={styles.documentTitle}>{doc.title}</Text>
                <View style={styles.documentImageContainer}>
                  {doc.image ? (
                    <Image source={doc.image} style={styles.documentImage} />
                  ) : (
                    <View style={styles.placeholderImage}>
                      <View style={styles.placeholderContent}>
                        <View style={styles.placeholderHeader}>
                          <View style={styles.placeholderFlag} />
                          <Text style={styles.placeholderText}>
                            GOVERNMENT OF INDIA
                          </Text>
                        </View>
                        <View style={styles.placeholderBody}>
                          <View style={styles.placeholderPhoto} />
                          <View style={styles.placeholderInfo}>
                            <View style={styles.placeholderLine} />
                            <View style={styles.placeholderLine} />
                            <View style={styles.placeholderLineShort} />
                          </View>
                        </View>
                        <View style={styles.placeholderQR} />
                      </View>
                    </View>
                  )}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Bottom Buttons */}
        <View
          style={[
            allStyles.bottomContainer,
            // { paddingHorizontal: responsiveWidth(4) },
          ]}
        >
          <TouchableOpacity style={allStyles.btn} onPress={handleSubmit}>
            <Text style={allStyles.btnText}>Submit</Text>
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
