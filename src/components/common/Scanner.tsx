import { HeaderIcon } from "@/src/components/common/HeaderIcon";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { responsiveWidth } from "react-native-responsive-dimensions";
import { SafeAreaView } from "react-native-safe-area-context";
import { allStyles } from "../../styles/global";
import { styles } from "../../styles/ScannerStyles";

interface DocumentScannerProps {
  documentType?: string;
}

export default function DocumentScanner({
  documentType = "Aadhaar Front",
}: DocumentScannerProps) {
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const requestCameraPermission = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Camera permission is required to take photos."
      );
      return false;
    }
    return true;
  };

  const requestMediaLibraryPermission = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Required",
        "Photo library permission is required to select photos."
      );
      return false;
    }
    return true;
  };

  const validateFileSize = async (imageUri: string): Promise<boolean> => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const fileSizeKB = blob.size / 1024; // Convert bytes to KB
      
      if (fileSizeKB > 300) {
        Alert.alert(
          "File Size Too Large",
          `The selected image is ${fileSizeKB.toFixed(1)}KB. Please select an image smaller than 300KB.`
        );
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error checking file size:", error);
      Alert.alert("Error", "Could not validate file size. Please try again.");
      return false;
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestCameraPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7, // Reduced quality to help with file size
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const isValidSize = await validateFileSize(imageUri);
      
      if (isValidSize) {
        setCapturedImage(imageUri);
      }
    }
  };

  const pickFromGallery = async () => {
    const hasPermission = await requestMediaLibraryPermission();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.7, // Reduced quality to help with file size
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      const isValidSize = await validateFileSize(imageUri);
      
      if (isValidSize) {
        setCapturedImage(imageUri);
      }
    }
  };

  const handleUpload = () => {
    if (capturedImage) {
      // Process the upload
      console.log("Uploading image:", capturedImage);
      
    } else {
      Alert.alert(
        "No Image",
        "Please take a photo or select from gallery first."
      );
    }
    router.back();
  };

  const handleBack = () => {
    router.back();
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
      <View style={[allStyles.pageHeader,{paddingTop:responsiveWidth(4)}]}>
        <View>
          <Text style={styles.headerTitle}>{documentType}</Text>
        </View>
        <HeaderIcon />
      </View>

      <View>
        {/* Camera/Preview Area */}
        <View style={[styles.cameraContainer, capturedImage ? styles.cameraContainerWithImage : null]}>
          {!capturedImage &&(
            <>
          {/* Corner Overlays */}
          <View style={styles.cornerTopLeft} />
          <View style={styles.cornerTopRight} />
          <View style={styles.cornerBottomLeft} />
          <View style={styles.cornerBottomRight} />
          </>)}

          {capturedImage ? (
            /* Captured Image Preview */
            <Image
              source={{ uri: capturedImage }}
              style={styles.previewImage}
              resizeMode="contain"
            />
          ) : (
            /* Document Placeholder */
            <View style={styles.sampleContainer}>
              <View style={styles.placeholderCard}>
                <Text style={styles.placeholderText}>
                  Position your {documentType} here
                </Text>
                <Text style={styles.placeholderSubtext}>
                  Make sure all corners are visible
                </Text>
              </View>
            </View>
          )}

          {/* Capture Button - Only show when no image is captured */}
          {!capturedImage && (
            <TouchableOpacity style={styles.captureButton} onPress={takePhoto}>
              <View style={styles.captureInner} />
            </TouchableOpacity>
          )}
        </View>

        {/* Retake Button - Show when image is captured */}
        {capturedImage && (
          <View style={styles.retakeButtonContainer}>
            <TouchableOpacity style={styles.retakeButtonMain} onPress={retakePhoto}>
              <Text style={styles.retakeButtonMainText}>Retake</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Upload from Phone Option */}
        <TouchableOpacity
          style={styles.uploadFromPhoneContainer}
          onPress={pickFromGallery}
        >
          <View style={{flexDirection:"row"}}>
          <Text style={styles.uploadFromPhoneText}>Upload from phone</Text>
          <Text style={styles.uploadFromPhoneSubtext}>
            ( Max File Size - 300Kb )
          </Text>
          </View>
          <Image
            source={require("@/assets/icons/DocumentPageUplaodIcon.png")}
            // style={styles.img}
            width={24}
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

          <TouchableOpacity style={allStyles.backButton} onPress={handleBack}>
            <Text style={allStyles.backButtonText}>← Back</Text>
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


