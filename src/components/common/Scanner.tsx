import { uploadDocument } from "@/src/api/UploadDocument";
import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import { useDeliveryContext } from "@/src/contexts/DeliveryContext";
import { useDocumentArray } from "@/src/contexts/DocumentArray1";
import { useDocumentArray2 } from "@/src/contexts/DocumentArray2";
import { useDocumentUploadContext } from "@/src/contexts/DocumentUploadContext";
import {
  compressPNGToTargetSize,
  convertImageToPdfAndCompress,
} from "@/src/utils/documentConversionUtils";
import { uploadQueue } from "@/src/utils/uploadQueue";
import { CameraView } from "expo-camera";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
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
import ImageCropper from "./ImageCropper";

interface DocumentScannerProps {
  documentType?: string;
}

type NativeCropPickerModule = {
  openCropper: (options: Record<string, any>) => Promise<{ path?: string }>;
};

const getNativeCropPicker = (): NativeCropPickerModule | null => {
  try {
    const cropPickerModule = require("react-native-image-crop-picker");
    return cropPickerModule?.default ?? cropPickerModule ?? null;
  } catch {
    return null;
  }
};

export default function DocumentScanner({}: DocumentScannerProps) {
  const {
    uploadingDocument,
    resetUploadingDocument,
    setUploadingDocument,
    isTemp,
    setIsTemp,
    resetIsTemp,
  } = useDocumentUploadContext();
  const { currentDelivery, setCurrentDelivery } = useDeliveryContext();
  const [capturedImage, setCapturedImage] = useState<any | null>(null);
  const [isOpeningImageEditor, setIsOpeningImageEditor] = useState(false);
  const [isFallbackEditorVisible, setIsFallbackEditorVisible] = useState(false);
  const [cameraReady, setCameraReady] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isUploading, setIsUploading] = useState(false); // Used only to prevent double tap in scanner
  const cameraRef = useRef<CameraView>(null);
  const { documentTypes, updateDocumentStatus, setDocumentUploading } =
    useDocumentArray();
  const {
    isOtherDocumentsUpload,
    setIsOtherDocumentsUpload,
    updateDocumentStatus: updateOtherDocumentStatus,
    setDocumentUploading: setOtherDocumentUploading,
  } = useDocumentArray2();

  const companionPhotoDocumentMap: Record<string, string> = {
    Customer: "Customer Photo",
    "AADHAAR FRONT": "AADHAAR FRONT Photo",
    "AADHAAR BACK": "AADHAAR BACK Photo",
  };
  const sequentialDocumentGroups: Record<string, string[]> = {
    "HELMET INVOICE": ["HELMET INVOICE", "HELMET INVOICE 1"],
    "HELMET INVOICE 1": ["HELMET INVOICE", "HELMET INVOICE 1"],
    "FORM 20 1ST PAGE": [
      "FORM 20 1ST PAGE",
      "FORM 20 2ND PAGE",
      "FORM 20 3RD PAGE",
    ],
    "FORM 20 2ND PAGE": [
      "FORM 20 1ST PAGE",
      "FORM 20 2ND PAGE",
      "FORM 20 3RD PAGE",
    ],
    "FORM 20 3RD PAGE": [
      "FORM 20 1ST PAGE",
      "FORM 20 2ND PAGE",
      "FORM 20 3RD PAGE",
    ],
    "RENT DOCUMENT 1": [
      "RENT DOCUMENT 1",
      "RENT DOCUMENT 2",
      "RENT DOCUMENT 3",
      "RENT DOCUMENT 4",
    ],
    "RENT DOCUMENT 2": [
      "RENT DOCUMENT 1",
      "RENT DOCUMENT 2",
      "RENT DOCUMENT 3",
      "RENT DOCUMENT 4",
    ],
    "RENT DOCUMENT 3": [
      "RENT DOCUMENT 1",
      "RENT DOCUMENT 2",
      "RENT DOCUMENT 3",
      "RENT DOCUMENT 4",
    ],
    "RENT DOCUMENT 4": [
      "RENT DOCUMENT 1",
      "RENT DOCUMENT 2",
      "RENT DOCUMENT 3",
      "RENT DOCUMENT 4",
    ],
  };

  const needsSequentialUpload = (documentType: string): boolean => {
    return documentType in sequentialDocumentGroups;
  };

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
        quality: 1.0, // Maximum quality - no compression at capture
        base64: false,
        exif: true,
        skipProcessing: true, // Important: Don't let the camera do any processing
      });

      if (photo) {
        console.log(`Photo captured - Size: ${photo.width}x${photo.height}`);
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
      quality: 1.0, // Maximum quality for gallery images too
      allowsMultipleSelection: false,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      console.log(`Gallery image selected - URI: ${imageUri}`);
      setCapturedImage(imageUri);
    }
  };

  const openImageEditor = async () => {
    if (!capturedImage || isOpeningImageEditor || isUploading) return;

    const isExpoGo =
      Constants.appOwnership === "expo" ||
      Constants.executionEnvironment === "storeClient";
    if (isExpoGo) {
      Toast.show({
        type: "info",
        text1: "Using In-App Editor",
        text2: "Native editor is unavailable in Expo Go.",
      });
      setIsFallbackEditorVisible(true);
      return;
    }

    const cropPicker = getNativeCropPicker();
    if (!cropPicker) {
      Toast.show({
        type: "info",
        text1: "Using In-App Editor",
        text2: "Native editor module not available in this build.",
      });
      setIsFallbackEditorVisible(true);
      return;
    }

    try {
      setIsOpeningImageEditor(true);

      const editedImage = await cropPicker.openCropper({
        path: capturedImage,
        mediaType: "photo",
        freeStyleCropEnabled: true,
        enableRotationGesture: true,
        showCropGuidelines: true,
        showCropFrame: true,
        hideBottomControls: false,
        compressImageQuality: 1,
        cropperToolbarTitle: "Edit Document",
      });

      if (editedImage?.path) {
        setCapturedImage(editedImage.path);
      }
    } catch (error) {
      const message = (error as Error)?.message?.toLowerCase() || "";
      const isCancelAction =
        message.includes("cancel") ||
        message.includes("cancelled") ||
        message.includes("canceled");

      if (!isCancelAction) {
        console.error("Image editor error:", error);
        Toast.show({
          type: "error",
          text1: "Editor Failed",
          text2: "Could not open image editor.",
        });
      }
    } finally {
      setIsOpeningImageEditor(false);
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

    // Prevent multiple uploads
    if (isUploading) {
      return;
    }

    setIsUploading(true); // Start loading

    try {
      const resolvedDocumentType =
        (uploadingDocument as any)?.documentName ||
        (uploadingDocument as any)?.title ||
        undefined;

      if (!resolvedDocumentType) {
        throw new Error(
          "Document type is missing. uploadingDocument: " +
            JSON.stringify(uploadingDocument),
        );
      }

      const frameNumber = isOtherDocumentsUpload
        ? (currentDelivery as any)?.certificateRef?.chassisNumber ||
          currentDelivery?.chassisNo
        : currentDelivery?.chassisNo;

      const companionPhotoDocumentType =
        companionPhotoDocumentMap[
          (uploadingDocument as any)?.documentName || ""
        ];

      const setActiveDocumentUploading = isOtherDocumentsUpload
        ? setOtherDocumentUploading
        : setDocumentUploading;

      setActiveDocumentUploading(resolvedDocumentType, true);
      if (companionPhotoDocumentType) {
        setActiveDocumentUploading(companionPhotoDocumentType, true);
      }

      const targetRoute = isOtherDocumentsUpload
        ? "/other-documents"
        : "/document-screen";

      // Fire-and-forget upload so the user can continue with other documents.
      const uploadTask = async () => {
        try {
          console.log(
            `Starting document processing for: ${resolvedDocumentType}`,
          );
          console.log(`Image URI: ${capturedImage}`);

          if (companionPhotoDocumentType) {
            console.log(
              `Processing ${companionPhotoDocumentType} - converting to PNG...`,
            );

            const processedCompanionImage = await compressPNGToTargetSize(
              capturedImage,
              500,
            );
            const imageResponse = await fetch(processedCompanionImage.uri);
            const imageBlob = await imageResponse.blob();

            const uploadResponse = await uploadDocument({
              fileName: `PHOTO_${companionPhotoDocumentType
                .toLowerCase()
                .replace(/\s+/g, "_")}_${frameNumber}.png`,
              contentType: "image/png",
              frameNumber: frameNumber,
              documentType: companionPhotoDocumentType,
            });

            const uploadResult = await fetch(
              (uploadResponse as any).uploadUrl,
              {
                method: "PUT",
                headers: {
                  "Content-Type": "image/png",
                },
                body: imageBlob,
              },
            );

            if (!uploadResult.ok) {
              throw new Error(
                `Upload failed with status ${uploadResult.status}`,
              );
            }

            const fileUrl = (uploadResponse as any).fileKey || "";

            if (isOtherDocumentsUpload) {
              updateOtherDocumentStatus(
                companionPhotoDocumentType,
                true,
                fileUrl,
              );
            } else {
              updateDocumentStatus(companionPhotoDocumentType, true, fileUrl);
            }
          }

          const processedDocument = await convertImageToPdfAndCompress(
            capturedImage,
            resolvedDocumentType,
            frameNumber,
            frameNumber,
          );

          if (!processedDocument) {
            throw new Error("Failed to process document for upload.");
          }

          const { fileUri, fileSize, ...finalObject } = processedDocument;

          if (!finalObject.documentType) {
            throw new Error("Document type is missing or invalid");
          }

          if (isTemp) {
            (finalObject as any).isTemp = false;
          }

          const response = await uploadDocument(finalObject);
          const fileResponse = await fetch(fileUri);
          const fileBlob = await fileResponse.blob();

          const finalUploadedResponse = await fetch(
            (response as any).uploadUrl,
            {
              method: "PUT",
              headers: {
                "Content-Type": finalObject.contentType,
              },
              body: fileBlob,
            },
          );

          if (!finalUploadedResponse.ok) {
            throw new Error(
              `Upload failed with status ${finalUploadedResponse.status}`,
            );
          }

          if (isOtherDocumentsUpload) {
            updateOtherDocumentStatus(
              (uploadingDocument as any)?.documentName,
              true,
              (response as any).fileKey,
            );
          } else {
            updateDocumentStatus(
              (uploadingDocument as any)?.documentName,
              true,
              (response as any).fileKey,
            );
          }

          Toast.show({
            type: "success",
            text1: "Success",
            text2: `${resolvedDocumentType} uploaded successfully`,
          });
        } catch (error) {
          console.error("Upload error:", error);
          Toast.show({
            type: "error",
            text1: "Upload Failed",
            text2: (error as Error).message || "Failed to upload document.",
          });
        } finally {
          setActiveDocumentUploading(resolvedDocumentType, false);
          if (companionPhotoDocumentType) {
            setActiveDocumentUploading(companionPhotoDocumentType, false);
          }
        }
      };

      if (needsSequentialUpload(resolvedDocumentType)) {
        uploadQueue.add(uploadTask, resolvedDocumentType);
      } else {
        void uploadTask();
      }

      Toast.show({
        type: "info",
        text1: "Upload Started",
        text2: "You can continue uploading other documents.",
      });

      setIsUploading(false);
      router.push(targetRoute);
    } catch (error) {
      console.error("Upload error:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: "Failed to process and upload document.",
      });
      setIsUploading(false);
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
    setIsFallbackEditorVisible(false);
  };

  const handleFallbackEditorCancel = () => {
    setIsFallbackEditorVisible(false);
  };

  const handleFallbackEditorComplete = (croppedUri: string) => {
    setCapturedImage(croppedUri);
    setIsFallbackEditorVisible(false);
  };

  if (isFallbackEditorVisible && capturedImage) {
    return (
      <SafeAreaView style={[allStyles.safeArea]} edges={["top"]}>
        <ImageCropper
          imageUri={capturedImage}
          onCancel={handleFallbackEditorCancel}
          onCropComplete={handleFallbackEditorComplete}
        />
      </SafeAreaView>
    );
  }

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
                  <TouchableOpacity
                    activeOpacity={0.9}
                    onPress={openImageEditor}
                    disabled={isOpeningImageEditor || isUploading}
                    style={{ width: "100%", height: "100%" }}
                  >
                    <Image
                      source={{ uri: capturedImage }}
                      style={styles.previewImage}
                      resizeMode="contain"
                    />
                    <View style={styles.tapToEditBadge}>
                      <Text style={styles.tapToEditText}>Tap to edit</Text>
                    </View>
                  </TouchableOpacity>
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

            {capturedImage && isOpeningImageEditor && (
              <View
                style={{
                  alignItems: "center",
                  marginBottom: responsiveWidth(3),
                }}
              >
                <ActivityIndicator size="small" color="#111827" />
                <Text style={{ marginTop: 6, color: "#111827" }}>
                  Opening editor...
                </Text>
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
              </View>
              <Image
                source={require("@/assets/icons/documentpageuplaodicon.png")}
                style={{ width: 24, height: 24 }}
                resizeMode="contain"
              />
            </TouchableOpacity>

            {/* Spacer to push buttons to bottom */}
            <View style={{ flex: 1 }} />

            {/* Action Buttons */}
            <View style={styles.bottomButtonsContainer}>
              <TouchableOpacity
                style={[allStyles.btn, isUploading && { opacity: 0.7 }]}
                onPress={handleUpload}
                disabled={isUploading}
              >
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
