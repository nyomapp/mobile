import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { useDeliveryContext } from "@/src/contexts/DeliveryContext";
import { globalStyles } from "@/src/styles";
import { router } from "expo-router";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { styles } from "../../styles/deliveries/documentsStyles";
import { allStyles } from "../../styles/global";
import { useDocumentUploadContext } from '@/src/contexts/DocumentUploadContext';
import { useDocumentArray } from '@/src/contexts/DocumentArray1';
import Toast from "react-native-toast-message";
import { useEffect } from "react";
import { useDocumentArray2 } from "@/src/contexts/DocumentArray2";

export default function DocumentsScreen() {
  const { currentDelivery, setCurrentDelivery, isEdit } = useDeliveryContext();
  const { setUploadingDocument } = useDocumentUploadContext();
  const { documentTypes, updateBulkDocuments } = useDocumentArray();
    const {setIsOtherDocumentsUpload } = useDocumentArray2();
  // On mount, if in edit mode and documents exist, populate the context
  useEffect(() => {
    if (isEdit && currentDelivery?.downloadDocuments && currentDelivery.downloadDocuments.length > 0) {
      console.log("Edit mode detected. Loading existing documents:", currentDelivery.downloadDocuments);
      updateBulkDocuments(currentDelivery.downloadDocuments as any);
    }
  }, [isEdit, currentDelivery?.downloadDocuments]);

  const handleBack = () => {
    router.push("/add-delivery");
  };

  const handleNext = () => {
    // Check if all required documents are uploaded
    const requiredDocuments = documentTypes.filter(
      doc => doc.documentName !== "AADHAAR BACK" // Aadhaar Back is optional
    );

    const missingDocuments = requiredDocuments.filter(doc => !doc.fileUrl || doc.fileUrl.trim() === "");

    if (missingDocuments.length > 0) {
      const missingNames = missingDocuments.map(doc => doc.title).join(", ");
      Toast.show({
        type: "error",
        text1: "Missing Documents",
        text2: `Please upload: ${missingNames}`,
      });
      return;
    }

    // Transform documentTypes array to match DownloadDocument interface
    const downloadDocuments = documentTypes.map(doc => ({
      documentName: doc.documentName as "FRONT" | "LEFT" | "RIGHT" | "BACK" | "ODOMETER" | "CHASSIS" | "AADHAAR FRONT" | "AADHAAR BACK" | "Customer" | "TAX INVOICE" | "INSURANCE" | "HELMET INVOICE" | "FORM 20 1ST PAGE",
      fileUrl: doc.fileUrl,
      fileSize: doc.fileSize,
      fileType: doc.fileType as 'PDF' | 'JPG'
    }));

    // Store documents in DeliveryContext - ensure we don't lose existing data
    if (currentDelivery) {
      setCurrentDelivery({
        ...currentDelivery,
        downloadDocuments: downloadDocuments
      });
    }

    // console.log("Documents stored in context:", downloadDocuments);
    // console.log("Full delivery context after documents:", currentDelivery);
    
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "All documents uploaded successfully",
    });
    
    router.push("/amount");
  };

  const handleDocumentUpload = (document: any) => {
    // console.log("=== Document object structure ===");
    // console.log("Full document:", JSON.stringify(document, null, 2));
    // console.log("documentName:", document?.documentName);
    // console.log("title:", document?.title);
    // console.log("id:", document?.id);
    // console.log("================================");
    setUploadingDocument(document)
    setIsOtherDocumentsUpload(false);
    router.push("/document-scanner");
  };

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
            <Text style={[allStyles.pageTitle, { lineHeight:responsiveWidth(10) }]}>
              <Text style={[allStyles.yellix_medium]}>Add</Text>
              {"\n"}
              <Text style={[allStyles.headerSecondaryText, allStyles.yellix_thin]}>Delivery</Text>
            </Text>
          </View>
        </View>

        <ScrollView
          style={[allStyles.scrollContent, { paddingTop: responsiveWidth(4) }, { paddingHorizontal: responsiveWidth(1) }]}
          showsVerticalScrollIndicator={false}
        >
          {/* Documents Title */}
          <Text style={allStyles.Title}>Documents</Text>

          {/* Document Upload Cards */}
          {documentTypes.map((doc) => (
            <TouchableOpacity
              key={doc.id}
              style={[
                globalStyles.input,
                styles.documentCard,
                doc.uploaded && styles.documentUploadedCard,
              ]}
              onPress={() => handleDocumentUpload(doc)}
              activeOpacity={0.7}
            >
              <View style={styles.documentLeft}>
                <View style={styles.iconContainer}>
                  <Image
                    source={doc.icon}
                    style={{ width: 32, height: 32 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.documentTitle}>{doc.title}</Text>
              </View>
              <TouchableOpacity
                //   style={styles.uploadButton}
                onPress={() => handleDocumentUpload(doc)}
              >
                <Image
                  source={
                    doc.uploaded
                      ? require("@/assets/icons/DocumentsPageTickIcon.png")
                      : require("@/assets/icons/DocumentPageUplaodIcon.png")
                  }
                  style={{ width: 25, height: 25 }}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Bottom Buttons */}
        <View
          style={[
            allStyles.bottomContainer,
            // { paddingHorizontal: responsiveWidth(4) },
          ]}
        >
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
