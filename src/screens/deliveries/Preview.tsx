import {
  createDelivery,
  getAllFinancierData,
  getAllMasterData,
} from "@/src/api/addDelivery";
import { updateDeliveryById } from "@/src/api/deliveriesHome";
import { getPdfUrl } from "@/src/api/preview";
import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { FONTS } from "@/src/constants";
import { useFinancierData, useMasterData } from "@/src/contexts";
import { useDeliveryContext } from "@/src/contexts/DeliveryContext";
import { useDocumentArray } from "@/src/contexts/DocumentArray1";
import { useModels } from "@/src/contexts/ModelsContext";
import { globalStyles } from "@/src/styles";
import * as FileSystem from "expo-file-system";
import { router } from "expo-router";
import * as Sharing from "expo-sharing";
import { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Linking,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  responsiveFontSize,
  responsiveWidth,
} from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { WebView } from "react-native-webview";
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
  const { documentTypes, updateBulkDocuments } = useDocumentArray();
  const { resetDocuments } = useDocumentArray();
  const { data: masterData, setData: setMasterData } = useMasterData();
  const { data: financierData, setData: setFinancierData } = useFinancierData();
  const { models: modelsData, setModels } = useModels();

  const [resolvedNames, setResolvedNames] = useState({
    modelName: "",
    financierName: "",
    financierPlan1Name: "",
  });
  const [pdfModalVisible, setPdfModalVisible] = useState(false);
  const [pdfUrl, setPdfUrl] = useState("");


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

const handleDownload = async(doc: any) => {
  try {
    Toast.show({
      type: "info",
      text1: "Downloading",
      text2: "Saving document...",
    });

    // Use fileUrl if available, otherwise try fileKey or documentName
    const fileIdentifier = doc.fileUrl || doc.fileKey || doc.documentName;
    
    if (!fileIdentifier) {
      throw new Error("No file identifier found in document");
    }

    const response = await getPdfUrl(fileIdentifier);
    const fileUrl = (response as any)?.data?.downloadUrl || (response as any)?.downloadUrl;

    if (!fileUrl) {
      throw new Error("No download URL received from server");
    }

    const fileName = `${doc.documentName || "document"}_${Date.now()}.pdf`;

    if (Platform.OS === "web") {
      // On web, download via fetch and blob
      const fetchResponse = await fetch(fileUrl);
      const blob = await fetchResponse.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } else {
      // On native, download to app directory first, then share
      const filePath = FileSystem.documentDirectory + fileName;
      const downloadResult = await FileSystem.downloadAsync(fileUrl, filePath);
      
      console.log('File downloaded to:', downloadResult.uri);
      
      // Check if sharing is available
      const canShare = await Sharing.isAvailableAsync();
      
      if (canShare) {
        // Open share dialog - user can save to downloads, share, etc.
        await Sharing.shareAsync(downloadResult.uri, {
          mimeType: 'application/pdf',
          dialogTitle: 'Save PDF Document',
        });
      } else {
        // Fallback: try to open with system apps
        const canOpen = await Linking.canOpenURL(downloadResult.uri);
        if (canOpen) {
          await Linking.openURL(downloadResult.uri);
        } else {
          throw new Error('Cannot save or open the document on this device');
        }
      }
    }

    Toast.show({
      type: "success",
      text1: "Downloaded",
      text2: "Use share menu to save to downloads",
    });

  } catch (error) {
    console.error('Download error:', error);
    Toast.show({
      type: "error",
      text1: "Download Error",
      text2: (error as any).message || "Download failed",
    });
  }
};



const handleView = async (doc: any) => {
  try {
    Toast.show({
      type: "info",
      text1: "Loading",
      text2: "Opening document...",
    });

    // Use fileUrl if available, otherwise try fileKey or documentName
    const fileIdentifier = doc.fileUrl || doc.fileKey || doc.documentName;
    
    if (!fileIdentifier) {
      throw new Error("No file identifier found in document");
    }

    const response = await getPdfUrl(fileIdentifier);
    const fileUrl = (response as any)?.data?.downloadUrl || (response as any)?.downloadUrl;

    if (!fileUrl) {
      throw new Error("No URL received from server");
    }

    console.log("PDF URL received:", fileUrl);

    if (Platform.OS === "web") {
      // On web, open in new tab
      window.open(fileUrl, '_blank');
      Toast.show({
        type: "success",
        text1: "Document Opened",
        text2: "PDF opened in new tab",
      });
    } else {
      // On native, use WebView modal for in-app viewing
      setPdfUrl(fileUrl);
      setPdfModalVisible(true);
      
      Toast.show({
        type: "success",
        text1: "Document Loaded",
        text2: "Displaying in PDF viewer",
      });
    }
    
  } catch (error) {
    console.error("View Error:", error);
    Toast.show({
      type: "error",
      text1: "View Error",
      text2: (error as any).message || "An error occurred while loading the document.",
    });
  }
};

  const handleEdit = (section: string) => () => {
    if(section === "Details") {
      router.push("/add-delivery");
    } else if(section === "Documents") {
      router.push("/document-screen");
    } else if(section === "More Details") {
      router.push("/amount");
    } else if(section === "Payment Details") {
      router.push("/payment-mode");
    }
  }
  const handleSubmit = async () => {
    console.log("Submitting delivery:", currentDelivery);
    console.log("deliveryId:", deliveryId);
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
      resetDocuments();
      // Reset context even on error to prevent stuck state
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
        <Text
          style={[
            allStyles.Title,
            { marginTop: 0, marginBottom: 0, fontSize: responsiveFontSize(3) },
          ]}
        >
          {title}
        </Text>
        <TouchableOpacity onPress={handleEdit(title)}>
          <Image
            source={require("@/assets/icons/previewpageediticon.png")}
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
            <Text style={[allStyles.pageTitle]}>Preview</Text>
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

          {/* Documents Section */}
          <View style={styles.section}>
            <View style={[styles.sectionHeader,{marginBottom:responsiveWidth(8)}]}>
              <Text style={[styles.sectionTitle]}>Documents</Text>
              <TouchableOpacity onPress={handleEdit("Documents")}>
                <Image
                  source={require("@/assets/icons/previewpageediticon.png")}
                  style={{
                    width: 27,
                    height: 27,
                  }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            {documentTypes.map((doc) => (
              <TouchableOpacity
                key={doc.id}
                style={[
                  globalStyles.input,
                  styles.documentCard,
                  doc.uploaded && styles.documentUploadedCard,
                ]}
                // onPress={() => handleDocumentUpload(doc)}

                activeOpacity={1}
              >
                <View style={styles.documentLeft}>
                  <View style={styles.iconContainer}>
                    <Image
                      source={doc.icon}
                      style={{ width: 32, height: 32 }}
                      resizeMode="contain"
                    />
                  </View>
                  <Text style={styles.documentPreviewTitle}>{doc.title}</Text>
                </View>
                <View style={styles.documentRightButtons}>
                  {doc.uploaded && (
                  <TouchableOpacity
                    //   style={styles.uploadButton}
                    onPress={() => handleView(doc)}
                  >
                    <Image
                      source={require("@/assets/icons/viewicon.png")}
                      style={{ width: 20, height: 20 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    //   style={styles.uploadButton}
                    onPress={() => handleDownload(doc)}
                  >
                    <Image
                      source={
                        doc.uploaded
                          ? require("@/assets/icons/dowmloadiconpreviewpage.png")
                          : require("@/assets/icons/documentpageuplaodicon.png")
                      }
                      style={{ width: 20, height: 20 }}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))}
          </View>

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



      {/* PDF Viewer Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={pdfModalVisible}
        onRequestClose={() => setPdfModalVisible(false)}
      >
        <SafeAreaView style={[allStyles.safeArea, { backgroundColor: "#f5f5f5" }]}>
          <View style={{ 
            flexDirection: "row", 
            justifyContent: "space-between", 
            alignItems: "center", 
            paddingHorizontal: responsiveWidth(4), 
            paddingVertical: responsiveWidth(3), 
            backgroundColor: "#fff",
            borderBottomWidth: 1,
            borderBottomColor: "#e0e0e0",
          }}>
            <Text style={{ fontSize: 18, color: "#333",fontFamily:FONTS.YellixMedium }}>PDF Viewer</Text>
            <TouchableOpacity 
              onPress={() => setPdfModalVisible(false)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 6,
                backgroundColor: "#ff4444",
                borderRadius: 6
              }}
            >
              <Text style={{ fontSize: 14, color: "#fff", fontFamily: FONTS.YellixThin }}>Close</Text>
            </TouchableOpacity>
          </View>
          <WebView
            source={{ 
              uri: `https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(pdfUrl)}` 
            }}
            style={{ 
              flex: 1, 
              backgroundColor: "#fff",
              marginTop: responsiveWidth(4),
              // marginHorizontal: responsiveWidth(2)
            }}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              console.log("WebView Error:", nativeEvent);
              Toast.show({
                type: "error",
                text1: "PDF Error",
                text2: "Failed to load PDF. Trying alternative viewer...",
              });
              // Fallback to direct PDF URL if Google viewer fails
              setTimeout(() => {
                setPdfUrl(pdfUrl);
              }, 2000);
            }}
            onLoadStart={() => {
              console.log("PDF loading started");
            }}
            onLoadEnd={() => {
              console.log("PDF loading completed");
            }}
            startInLoadingState={true}
            scalesPageToFit={Platform.OS === 'android'}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            allowsBackForwardNavigationGestures={false}
          />
        </SafeAreaView>
      </Modal>

      <Toast />
    </SafeAreaView>
  );
}
