import { updateDeliveryById } from "@/src/api/UploadDocument";
import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { useDeliveryContext } from "@/src/contexts/DeliveryContext";
import { useDocumentArray } from '@/src/contexts/DocumentArray1';
import { useDocumentArray2 } from "@/src/contexts/DocumentArray2";
import { useDocumentUploadContext } from '@/src/contexts/DocumentUploadContext';
import { globalStyles } from "@/src/styles";
import { router } from "expo-router";
import { useEffect, useMemo, useRef } from "react";
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
export default function DocumentsScreen() {
  const { currentDelivery, setCurrentDelivery, isEdit,deliveryId, } = useDeliveryContext();
  
  const { setUploadingDocument, setIsTemp } = useDocumentUploadContext();
  const { documentTypes, updateBulkDocuments } = useDocumentArray();
  const {setIsOtherDocumentsUpload } = useDocumentArray2();
  const syncInProgress = useRef(false);
  
  // On mount, if in edit mode and documents exist, populate the context
  useEffect(() => {
    if (isEdit && currentDelivery?.downloadDocuments && currentDelivery.downloadDocuments.length > 0) {
      console.log("Edit mode detected. Loading existing documents:", currentDelivery.downloadDocuments);
      updateBulkDocuments(currentDelivery.downloadDocuments as any);
    }
  }, [isEdit, currentDelivery?.downloadDocuments]);

  // Memoize the document data to avoid unnecessary updates
  const currentDocumentData = useMemo(() => {
    return documentTypes
      .filter(doc => doc.uploaded && doc.fileUrl)
      .map(doc => ({
        documentName: doc.documentName,
        fileUrl: doc.fileUrl,
        fileSize: doc.fileSize,
        fileType: doc.fileType
      }));
  }, [documentTypes]);

  // Sync DocumentArray1 changes back to DeliveryContext (only in edit mode)
  useEffect(() => {
    if (!isEdit || !currentDelivery || syncInProgress.current) {
      return;
    }

    // Check if the document data has actually changed
    const existingDocs = currentDelivery.downloadDocuments || [];
    const hasChanges = currentDocumentData.length !== existingDocs.length ||
      currentDocumentData.some(newDoc => {
        const existingDoc = existingDocs.find(existing => existing.documentName === newDoc.documentName);
        return !existingDoc || existingDoc.fileUrl !== newDoc.fileUrl;
      });

    if (hasChanges) {
      syncInProgress.current = true;
      
      const updatedDownloadDocuments = currentDocumentData.map(doc => ({
        documentName: doc.documentName as "FRONT" | "LEFT" | "RIGHT" | "BACK" | "ODOMETER" | "CHASSIS" | "AADHAAR FRONT" | "AADHAAR BACK" | "Customer" | "TAX INVOICE" | "INSURANCE" | "HELMET INVOICE" | "FORM 20 1ST PAGE",
        fileUrl: doc.fileUrl,
        fileSize: doc.fileSize,
        fileType: doc.fileType as 'PDF' | 'JPG'
      }));

      setCurrentDelivery({
        ...currentDelivery,
        downloadDocuments: updatedDownloadDocuments
      });

      console.log("Synced DocumentArray1 changes to DeliveryContext:", updatedDownloadDocuments);
      
      // Reset the flag after a short delay
      setTimeout(() => {
        syncInProgress.current = false;
      }, 100);
    }
  }, [currentDocumentData, isEdit]); // Remove currentDelivery from dependencies to prevent loop

  const handleBack = () => {
    router.push("/add-delivery");
  };

  const handleNext = async() => {
    // Check if all required documents are uploaded
    // const requiredDocuments = documentTypes.filter(
    //   doc => doc.documentName !== "AADHAAR BACK" // Aadhaar Back is optional
    // );

    // const missingDocuments = requiredDocuments.filter(doc => !doc.fileUrl || doc.fileUrl.trim() === "");

    // if (missingDocuments.length > 0) {
    //   const missingNames = missingDocuments.map(doc => doc.title).join(", ");
    //   Toast.show({
    //     type: "error",
    //     text1: "Missing Documents",
    //     text2: `Please upload: ${missingNames}`,
    //   });
    //   return;
    // }

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

    console.log("Documents stored in context:", downloadDocuments);
    
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "All documents uploaded successfully",
    });
    
     if(isEdit){
      try {
          await updateDeliveryById(deliveryId, downloadDocuments);
          Toast.show({
            type: "success",
            text1: "Update Successful",
            text2: "Delivery documents have been updated successfully.",
          });
        } catch (error) {
          Toast.show({
            type: "error",
            text1: "Update Failed",
            text2:
              (error as any).message ||
              "An error occurred while updating delivery documents.",
          });
          return;
        }
     }
     
    
    router.push("/amount");
  };

  const handleDocumentUpload = (document: any) => {
    setUploadingDocument(document)
    setIsTemp(false);
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
