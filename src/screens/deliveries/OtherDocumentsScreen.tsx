import { updateDeliveryById } from "@/src/api/UploadDocument";
import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { useDeliveryContext } from "@/src/contexts/DeliveryContext";
import { useDocumentArray2 } from "@/src/contexts/DocumentArray2";
import { useDocumentUploadContext } from "@/src/contexts/DocumentUploadContext";
import { globalStyles } from "@/src/styles";
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
import { responsiveWidth } from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { styles } from "../../styles/deliveries/documentsStyles";
import { allStyles } from "../../styles/global";

export default function OtherDocumentsScreen() {
  const {
    currentDelivery,
    setCurrentDelivery,
    resetCurrentDelivery,
    isEdit,
    deliveryId,
    resetDeliveryId,
  } = useDeliveryContext();
  const {
    documentTypes,
    setIsOtherDocumentsUpload,
    resetDocuments,
    updateBulkDocuments,
  } = useDocumentArray2();
  const { setUploadingDocument, setIsTemp } = useDocumentUploadContext();
  const [finalUploadDocumentsArray, setFinalUploadDocumentsArray] = useState<
    any[]
  >([]);
  const handleBack = () => {
    resetDeliveryId();
    resetCurrentDelivery();
    resetDocuments();
    router.push("/(tabs)/deliveries");
  };
  useEffect(() => {
    setFinalUploadDocumentsArray(currentDelivery?.downloadDocuments || []);
    if (currentDelivery) {
      updateBulkDocuments(currentDelivery.downloadDocuments as any);
    }
  }, [currentDelivery?.downloadDocuments]);

  const handleNext = async () => {
    // Validate that all documents have been uploaded
    // const missingDocuments = documentTypes.filter(doc => !doc.fileUrl || doc.fileUrl.trim() === '');

    // if (missingDocuments.length > 0) {
    //   const missingDocNames = missingDocuments.map(doc => doc.documentName).join(', ');
    //   Toast.show({
    //     type: "error",
    //     text1: "Upload Required",
    //     text2: `Please upload all documents. Missing: ${missingDocNames}`,
    //   });
    //   return;
    // }

    // Navigate to next step

    // Transform documentTypes array to match DownloadDocument interface, but only include those with fileUrl
    const newDownloadDocuments = documentTypes
      .filter((doc) => doc.fileUrl && doc.fileUrl.trim() !== "")
      .map((doc) => ({
        documentName: doc.documentName as
          | "FRONT"
          | "LEFT"
          | "RIGHT"
          | "BACK"
          | "ODOMETER"
          | "CHASSIS"
          | "AADHAAR FRONT"
          | "AADHAAR BACK"
          | "Customer"
          | "TAX INVOICE"
          | "INSURANCE"
          | "HELMET INVOICE"
          | "FORM 20 1ST PAGE",
        fileUrl: doc.fileUrl,
        fileSize: doc.fileSize,
        fileType: doc.fileType as "PDF" | "JPG",
      }));
    console.log("newDownloadDocuments", newDownloadDocuments);

    // Merge previous documents with new ones
    // Remove duplicates: keep only documents NOT in newDownloadDocuments
    const existingDocs = finalUploadDocumentsArray || [];
    const filteredExisting = existingDocs.filter(
      (doc: any) =>
        !newDownloadDocuments.some(
          (newDoc: any) => newDoc.documentName === doc.documentName,
        ),
    );
    const mergedDocuments = [...filteredExisting, ...newDownloadDocuments];

    console.log("mergedDocuments", JSON.stringify(mergedDocuments, null, 2));
    // console.log("deliveryId", deliveryId);
    try {
      await updateDeliveryById(deliveryId, mergedDocuments);
      Toast.show({
        type: "success",
        text1: "Update Successful",
        text2: "Delivery documents have been updated successfully.",
      });
      resetDocuments();
      resetDeliveryId();
      setTimeout(() => {
        router.push("/(tabs)/deliveries");
      }, 1000);
    } catch (error) {
      Toast.show({
        type: "error",
        text1: "Update Failed",
        text2:
          (error as any).message ||
          "An error occurred while updating delivery documents.",
      });
    }
  };

  const handleDocumentUpload = (document: any) => {
    // console.log("=== Document object structure ===");
    // console.log("Full document:", JSON.stringify(document, null, 2));
    // console.log("Setting uploadingDocument to:", document?.documentName);

    setUploadingDocument(document);
    setIsOtherDocumentsUpload(true);
    setIsTemp(true);
    console.log("About to navigate to document-scanner");
    router.push("/document-scanner");
  };

  return (
    <SafeAreaView style={[allStyles.safeArea]} edges={["top"]}>
      <KeyboardAvoidingView
        style={allStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View
          style={[allStyles.pageHeader, { paddingTop: responsiveWidth(6) }]}
        >
          <View>
            {/* <Text style={allStyles.pageTitle}>
            <b>Add</b>
            {"\n"}Delivery
          </Text> */}
            <Text
              style={[allStyles.Title, { marginBottom: responsiveWidth(0) }]}
            >
              Documents
            </Text>
          </View>

          <HeaderIcon />
        </View>

        <ScrollView
          style={{ marginTop: responsiveWidth(4) }}
          showsVerticalScrollIndicator={false}
        >
          {/* Documents Title */}

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
                      ? require("@/assets/icons/documentspagetickicon.png")
                      : require("@/assets/icons/documentpageuplaodicon.png")
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
            //   { paddingHorizontal: responsiveWidth(4) },
          ]}
        >
          <TouchableOpacity style={allStyles.btn} onPress={handleNext}>
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
