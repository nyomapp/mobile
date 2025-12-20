import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import * as ImagePicker from "expo-image-picker";
// import * as ImageManipulator from "expo-image-manipulator";
import { uploadDocument } from "@/src/api/UploadDocument";
import { useDeliveryContext } from "@/src/contexts/DeliveryContext";
import { useDocumentArray } from "@/src/contexts/DocumentArray1";
import { useDocumentArray2 } from "@/src/contexts/DocumentArray2";
import { useDocumentUploadContext } from "@/src/contexts/DocumentUploadContext";
import {
  convertImageToPdfAndCompress
} from "@/src/utils/documentConversionUtils";
import { CameraView } from "expo-camera";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
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
import { allStyles } from "../../styles/global";
import { styles } from "../../styles/ScannerStyles";
interface DocumentScannerProps {
  documentType?: string;
}

export default function DocumentScanner({}: // documentType = "Aadhaar Front",
DocumentScannerProps) {
  const { uploadingDocument, resetUploadingDocument, isTemp, setIsTemp, resetIsTemp } =
    useDocumentUploadContext();
  const { currentDelivery, setCurrentDelivery } = useDeliveryContext();
  const [capturedImage, setCapturedImage] = useState<any | null>(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const cameraRef = useRef<CameraView>(null);
  const { documentTypes, updateDocumentStatus } = useDocumentArray();
  const {
    isOtherDocumentsUpload,
    setIsOtherDocumentsUpload,
    updateDocumentStatus: updateOtherDocumentStatus,
  } = useDocumentArray2();

  // Debug: Log uploadingDocument on mount and when it changes
  // useEffect(() => {
  //   console.log("=== SCANNER COMPONENT MOUNTED ===");
  //   console.log("uploadingDocument:", uploadingDocument);
  //   console.log("uploadingDocument.documentName:", (uploadingDocument as any)?.documentName);
  //   console.log("isOtherDocumentsUpload:", isOtherDocumentsUpload);
  //   console.log("====================================");
  // }, [uploadingDocument, isOtherDocumentsUpload]);

  useEffect(() => {
    const requestCameraPermission = async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status === "granted") {
        setPermissionGranted(true);
      } else {
        setPermissionGranted(false);
        Toast.show({
          type: "error",
          text1: "Permission Required",
          text2:
            "Camera permission is required to take photos. Please enable it in settings.",
        });
      }
    };
    requestCameraPermission();
  }, []);

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission Required",
        text2: "Photo library permission is required to select photos.",
      });
      return false;
    }
    return true;
  };

  const takePhoto = async () => {
    if (!cameraRef.current) return;

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.7,
        base64: false,
      });

      if (photo) {
        setCapturedImage(photo.uri);
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to take photo. Please try again.",
      });
    }
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 0.7, // Reduced quality to help with file size
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setCapturedImage(imageUri);
    }
  };

  const handleUpload = async () => {
    if (!capturedImage) {
      Toast.show({
        type: "error",
        text1: "No Image Selected",
        text2: "Please take a photo or select from gallery first.",
      });
      return;
    }

    try {
      // console.log("=== DOCUMENT TYPE RESOLUTION ===");
      // console.log("uploadingDocument object:", JSON.stringify(uploadingDocument, null, 2));
      // console.log("uploadingDocument.documentName:", (uploadingDocument as any)?.documentName);
      // console.log("uploadingDocument.title:", (uploadingDocument as any)?.title);
      // console.log("==================================");

      // Use documentName if available, otherwise try title, otherwise throw error
      const resolvedDocumentType =
        (uploadingDocument as any)?.documentName ||
        (uploadingDocument as any)?.title ||
        undefined;

      if (!resolvedDocumentType) {
        throw new Error(
          "Document type is missing. uploadingDocument: " +
            JSON.stringify(uploadingDocument)
        );
      }
   const frameNumber = isOtherDocumentsUpload ? (currentDelivery as any)?.certificateRef?.chassisNumber || currentDelivery?.chassisNo : currentDelivery?.chassisNo;

      // Convert image to PDF and compress
      const processedDocument = await convertImageToPdfAndCompress(
        capturedImage,
        resolvedDocumentType,
        frameNumber,
        frameNumber
      );

      if (processedDocument) {
        console.log("Processed Document:", processedDocument);

        try {
          const { fileUri, fileSize, ...finalObject } = processedDocument;

          console.log("Full metadata:", JSON.stringify(finalObject, null, 2));

          if (!finalObject.documentType) {
            throw new Error("Document type is missing or invalid");
          }
          if( isTemp){
            (finalObject as any).isTemp = false;
          }
          // Step 1: Get upload URL from server
          const response = await uploadDocument(finalObject);
          console.log("Upload URL received:", (response as any).uploadUrl);
          
          // Step 2: Read the processed file from local fileUri
          console.log("Reading file for upload from URI:", fileUri);
          const fileResponse = await fetch(fileUri);
          const fileBlob = await fileResponse.blob();
          console.log(`File blob created. Size: ${fileBlob.size} bytes, Type: ${fileBlob.type}`);
          
          // Step 3: Upload the processed file to the presigned URL
          console.log(`Uploading with Content-Type: ${finalObject.contentType}`);
          const finalUploadedResponse = await fetch(
            (response as any).uploadUrl,
            {
              method: "PUT",
              headers: {
                "Content-Type": finalObject.contentType, // Use the content type from the processed document
              },
              body: fileBlob,
            }
          );

          if (!finalUploadedResponse.ok) {
            throw new Error(
              `Upload failed with status ${finalUploadedResponse.status}`
            );
          }

          // console.log("Document uploaded successfully", finalUploadedResponse);
          if (isOtherDocumentsUpload) {
            updateOtherDocumentStatus(
              (uploadingDocument as any)?.documentName,
              true,
              (response as any).fileKey
            );
          } else {
            updateDocumentStatus(
              (uploadingDocument as any)?.documentName,
              true,
              (response as any).fileKey
            );
          }

          Toast.show({
            type: "success",
            text1: "Success",
            text2: `${resolvedDocumentType} uploaded successfully`,
          });

          // Navigate back after successful upload
          setTimeout(() => {
            if (isOtherDocumentsUpload) {
              router.push("/other-documents");
            } else {
              router.push("/document-screen");
            }
          }, 1000);
        } catch (error) {
          console.error("Upload error:", error);
          Toast.show({
            type: "error",
            text1: "Upload Failed",
            text2: (error as Error).message || "Failed to upload document.",
          });
        }
      }
    } catch (error) {
      console.error("Upload error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to process and upload document.",
      });
    }
  };

  const handleBack = () => {
    if (isOtherDocumentsUpload) {
      router.push("/other-documents");
    } else {
      router.push("/document-screen");
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };

  return (
    <SafeAreaView style={[allStyles.safeArea]} edges={["top"]}>
      <KeyboardAvoidingView
        style={allStyles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View
          style={[allStyles.pageHeader, { paddingTop: responsiveWidth(4) }]}
        >
          <View>
            <Text style={styles.headerTitle}>
              {(uploadingDocument as any)?.title}
            </Text>
          </View>
          <HeaderIcon />
        </View>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={allStyles.scrollContent}
        >
          <View style={{ flex: 1, width: "100%" }}>
            {/* Camera/Preview Area */}
            {permissionGranted ? (
              <View
                style={[
                  styles.cameraContainer,
                  capturedImage ? styles.cameraContainerWithImage : null,
                  { width: "100%", marginHorizontal: 0, paddingHorizontal: 0 },
                ]}
              >
                {capturedImage ? (
                  /* Captured Image Preview */
                  <Image
                    source={{ uri: capturedImage }}
                    style={styles.previewImage}
                    resizeMode="contain"
                  />
                ) : (
                  /* Camera Feed */
                  <>
                    <CameraView
                      ref={cameraRef}
                      style={styles.previewImage}
                      onCameraReady={() => setCameraReady(true)}
                    />
                    {/* Corner Overlays */}
                    <View style={styles.cornerTopLeft} />
                    <View style={styles.cornerTopRight} />
                    <View style={styles.cornerBottomLeft} />
                    <View style={styles.cornerBottomRight} />
                  </>
                )}

                {/* Capture Button - Only show when no image is captured */}
                {!capturedImage && cameraReady && permissionGranted && (
                  <TouchableOpacity
                    style={styles.captureButton}
                    onPress={takePhoto}
                  >
                    <View style={styles.captureInner} />
                  </TouchableOpacity>
                )}
              </View>
            ) : (
              <View
                style={[
                  styles.cameraContainer,
                  { justifyContent: "center", alignItems: "center" },
                ]}
              >
                <Text
                  style={{ fontSize: 16, color: "#666", textAlign: "center" }}
                >
                  Camera permission denied. Please enable camera permission in
                  settings to use this feature.
                </Text>
              </View>
            )}

            {/* Retake Button - Show when image is captured */}
            {capturedImage && (
              <View style={styles.retakeButtonContainer}>
                <TouchableOpacity
                  style={styles.retakeButtonMain}
                  onPress={retakePhoto}
                >
                  <Text style={styles.retakeButtonMainText}>Retake</Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Upload from Phone Option */}
            <TouchableOpacity
              style={styles.uploadFromPhoneContainer}
              onPress={pickFromGallery}
            >
              <View style={{ flexDirection: "row" }}>
                <Text style={styles.uploadFromPhoneText}>
                  Upload from phone
                </Text>
                <Text style={styles.uploadFromPhoneSubtext}>
                  ( Max File Size - 300Kb )
                </Text>
              </View>
              <Image
                source={require("@/assets/icons/documentpageuplaodicon.png")}
                style={{ width: 24, height: 24 }}
                // width={24}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Spacer to push buttons to bottom */}
            <View style={{ flex: 1 }} />

            {/* Action Buttons */}
            <View style={styles.bottomButtonsContainer}>
              <TouchableOpacity style={allStyles.btn} onPress={handleUpload}>
                <Text style={allStyles.btnText}>Upload</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={allStyles.backButton}
                onPress={handleBack}
              >
                <Text style={allStyles.backButtonText}>← Back</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Toast />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
