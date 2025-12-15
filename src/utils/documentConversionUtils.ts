import * as ImageManipulator from "expo-image-manipulator";
import Toast from "react-native-toast-message";

export interface ProcessedDocument {
  fileName: string;
  contentType: string;
  frameNumber: string;
  documentType: string;
  fileUri: string;
  fileSize: number;
}

/**
 * Get max file size in KB based on document type
 */
const getMaxFileSizeByDocumentType = (documentType: string): number => {
  if (documentType === "Aadhaar Front" || documentType === "Aadhaar Back") {
    return 195; // 195KB
  } else if (
    documentType === "Form 20 - 1" ||
    documentType === "Form 20 - 2" ||
    documentType === "Form 20 - 3"
  ) {
    return 130; // 130KB
  } else {
    return 390; // 390KB for all others
  }
};

/**
 * Compress image based on document type
 */
export const convertImageToPdfAndCompress = async (
  imageUri: string,
  documentType: string,
  frameNumber: string,
  chassisNo: string
): Promise<ProcessedDocument | null> => {
  try {
    const maxSizeKB = getMaxFileSizeByDocumentType(documentType);

    // Step 1: Check current image size
    const imageResponse = await fetch(imageUri);
    const imageBlob = await imageResponse.blob();
    let imageSizeKB = imageBlob.size / 1024;

    console.log(
      `Original image size: ${imageSizeKB.toFixed(2)}KB (Max allowed: ${maxSizeKB}KB)`
    );

    let compressedImageUri = imageUri;
    let finalSizeKB = imageSizeKB;

    // Step 2: Compress image if needed
    if (imageSizeKB > maxSizeKB) {
      let quality = 0.8;
      let compressed = false;

      while (quality > 0.1) {
        const result = await ImageManipulator.manipulateAsync(
          imageUri,
          [],
          { compress: quality, format: ImageManipulator.SaveFormat.JPEG }
        );

        const response = await fetch(result.uri);
        const blob = await response.blob();
        finalSizeKB = blob.size / 1024;

        console.log(`Compressed at quality ${quality}: ${finalSizeKB.toFixed(2)}KB`);

        if (finalSizeKB <= maxSizeKB) {
          compressedImageUri = result.uri;
          compressed = true;
          break;
        }

        quality -= 0.1;
      }

      // If compression didn't work
      if (!compressed) {
        // Try one more time with lowest quality
        const finalResult = await ImageManipulator.manipulateAsync(
          imageUri,
          [],
          { compress: 0.1, format: ImageManipulator.SaveFormat.JPEG }
        );

        const finalResponse = await fetch(finalResult.uri);
        const finalBlob = await finalResponse.blob();
        finalSizeKB = finalBlob.size / 1024;

        if (finalSizeKB > maxSizeKB) {
          Toast.show({
            type: "error",
            text1: "Compression Failed",
            text2: `Image is ${finalSizeKB.toFixed(2)}KB. Cannot compress to ${maxSizeKB}KB limit.`,
          });
          return null;
        }

        compressedImageUri = finalResult.uri;
      }
    }

    // Step 3: Create processed document object
    const fileName = `${documentType.replace(/\s+/g, "_")}_${Date.now()}.pdf`;

    const processedDocument: ProcessedDocument = {
      fileName: fileName,
      contentType: "application/pdf",
      frameNumber: frameNumber || chassisNo,
      documentType: documentType,
      fileUri: compressedImageUri, // Use the compressed image URI
      fileSize: Math.round(finalSizeKB * 1024), // Size in bytes
    };

    console.log("Processed Document:", processedDocument);

    Toast.show({
      type: "success",
      text1: "Document Ready",
      text2: `${documentType} - ${finalSizeKB.toFixed(2)}KB`,
    });

    return processedDocument;
  } catch (error) {
    console.error("Error processing document:", error);
    Toast.show({
      type: "error",
      text1: "Error",
      text2: "Failed to process document. Please try again.",
    });
    return null;
  }
};

/**
 * Get size limit display text for document type
 */
export const getSizeLimitText = (documentType: string): string => {
  const maxSize = getMaxFileSizeByDocumentType(documentType);
  return `Max file size: ${maxSize}KB`;
};
