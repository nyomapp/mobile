import * as ImageManipulator from "expo-image-manipulator";
import Toast from "react-native-toast-message";
import * as FileSystem from "expo-file-system";
import { Image as RNImage, Platform } from "react-native";
import * as ImageManipulatorModule from "expo-image-manipulator";
import { PDFDocument } from 'pdf-lib';
/**
 * Create a minimal PDF with embedded JPEG image using base64
 */
// const createMinimalPDF = (base64Image: string, width: number, height: number): string => {
//   // Use original image dimensions directly as PDF points
//   // This prevents any scaling or aspect ratio issues
//   const pdfWidth = width;
//   const pdfHeight = height;

//   console.log(`Creating PDF with dimensions: ${pdfWidth}x${pdfHeight} points`);
//   console.log(`Original image dimensions: ${width}x${height} pixels`);
//   console.log(`Aspect ratio: ${(width/height).toFixed(2)}`);
//   console.log(`Base64 image length: ${base64Image.length} characters`);
//   console.log(`Content stream transformation: ${pdfWidth} 0 0 -${pdfHeight} 0 ${pdfHeight}`);

//   // Convert base64 back to binary for proper embedding
//   const binaryData = atob(base64Image);
//   const imageLength = binaryData.length;

//   // Create content stream with proper scaling to fill the page
//   // Scale image to match PDF page dimensions exactly
//   const contentStream = `q\n${pdfWidth} 0 0 ${pdfHeight} 0 0 cm\n/Im0 Do\nQ\n`;
//   const contentLength = contentStream.length;

//   // Build PDF structure
//   const pdfHeader = "%PDF-1.4\n";
  
//   // Calculate object positions for xref table
//   let position = pdfHeader.length;
//   const positions: number[] = [0]; // Object 0 is always 0
  
//   // Object 1: Catalog
//   positions.push(position);
//   const obj1 = `1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n`;
//   position += obj1.length;
  
//   // Object 2: Pages
//   positions.push(position);
//   const obj2 = `2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n`;
//   position += obj2.length;
  
//   // Object 3: Page (MediaBox matches exact image dimensions)
//   positions.push(position);
//   const obj3 = `3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pdfWidth} ${pdfHeight}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`;
//   position += obj3.length;
  
//   // Object 4: Image XObject  
//   positions.push(position);
//   const obj4Header = `4 0 obj\n<< /Type /XObject /Subtype /Image /Width ${width} /Height ${height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${imageLength} >>\nstream\n`;
//   const obj4Footer = `\nendstream\nendobj\n`;
//   const obj4 = obj4Header + binaryData + obj4Footer;
//   position += obj4.length;
  
//   // Object 5: Content stream
//   positions.push(position);
//   const obj5 = `5 0 obj\n<< /Length ${contentLength} >>\nstream\n${contentStream}endstream\nendobj\n`;
//   position += obj5.length;
  
//   // Build xref table
//   const xrefPosition = position;
//   const objectCount = positions.length;
//   let xref = `xref\n0 ${objectCount}\n`;
  
//   for (let i = 0; i < objectCount; i++) {
//     if (i === 0) {
//       xref += "0000000000 65535 f \n";
//     } else {
//       const pos = positions[i].toString().padStart(10, '0');
//       xref += `${pos} 00000 n \n`;
//     }
//   }
  
//   // Build trailer
//   const trailer = `trailer\n<< /Size ${objectCount} /Root 1 0 R >>\nstartxref\n${xrefPosition}\n%%EOF\n`;
  
//   // Combine all parts
//   const pdfContent = pdfHeader + obj1 + obj2 + obj3 + obj4 + obj5 + xref + trailer;
  
//   // Convert to base64 for file storage
//   const base64Pdf = btoa(pdfContent);
  
//   console.log(`Generated PDF size: ${pdfContent.length} bytes, base64 size: ${base64Pdf.length}`);
  
//   return base64Pdf;
// };


const createMinimalPDF = async (base64Image: string): Promise<string> => {
  const pdfDoc = await PDFDocument.create();
  
  const jpegImage = await pdfDoc.embedJpg(`data:image/jpeg;base64,${base64Image}`);
  const { width, height } = jpegImage.scale(1);
  
  const page = pdfDoc.addPage([width, height]);
  page.drawImage(jpegImage, {
    x: 0,
    y: 0,
    width: width,
    height: height,
  });
  
  const pdfBytes = await pdfDoc.save();
  
  // Fix: Convert Uint8Array to base64 without stack overflow
  let binary = '';
  const len = pdfBytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(pdfBytes[i]);
  }
  return btoa(binary);
};




export interface ProcessedDocument {
  fileName: string;
  contentType: string;
  frameNumber: string;
  documentType: string;
  fileUri: string;
  fileSize: number;
}

/**
 * Map document names to API-expected format
 */
const mapDocumentTypeToApiFormat = (documentType: string): string => {
  const documentTypeMap: { [key: string]: string } = {
    "AADHAAR FRONT": "AADHAAR FRONT",
    "AADHAAR BACK": "AADHAAR BACK",
    FRONT: "FRONT",
    LEFT: "LEFT",
    CHASSIS: "CHASSIS",
    Customer: "Customer",
    "TAX INVOICE": "TAX INVOICE",
    INSURANCE: "INSURANCE",
    "HELMET INVOICE": "HELMET INVOICE",
    "FORM 20 1ST PAGE": "FORM 20 1ST PAGE",
    "FORM 20 2ND PAGE": "FORM 20 2ND PAGE",
    "FORM 20 3RD PAGE": "FORM 20 3RD PAGE",
    "FORM 21": "FORM 21",
    "FORM 22": "FORM 22",
    AFFIDAVIT: "AFFIDAVIT",
  };
  return documentTypeMap[documentType] || documentType;
};

/**
 * Get max file size in KB based on document type
 */
const getMaxFileSizeByDocumentType = (documentType: string): number => {
  if (documentType === "AADHAAR FRONT" || documentType === "AADHAAR BACK") {
    return 195; // 195KB
  } else if (
    documentType === "FORM 20 1ST PAGE" ||
    documentType === "FORM 20 2ND PAGE" ||
    documentType === "FORM 20 3RD PAGE"
  ) {
    return 130; // 130KB
  } else {
    return 390; // 390KB for all others
  }
};

const getImageDimensions = (
  uri: string
): Promise<{ width: number; height: number }> =>
  new Promise((resolve, reject) => {
    RNImage.getSize(
      uri,
      (width, height) => resolve({ width, height }),
      (error) => reject(error)
    );
  });

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
      `Original image size: ${imageSizeKB.toFixed(
        2
      )}KB (Max allowed: ${maxSizeKB}KB)`
    );

    let compressedImageUri = imageUri;
    let finalSizeKB = imageSizeKB;

    // Step 2: Always process image to strip EXIF data (which can cause rotation)
    // Then compress if needed
    const processedResult = await ImageManipulator.manipulateAsync(imageUri, [], {
      compress: 1.0, // No compression initially, just strip EXIF
      format: ImageManipulator.SaveFormat.JPEG,
    });
    compressedImageUri = processedResult.uri;

    // Check size after EXIF stripping
    const processedResponse = await fetch(compressedImageUri);
    const processedBlob = await processedResponse.blob();
    finalSizeKB = processedBlob.size / 1024;
    
    console.log(`After EXIF stripping: ${finalSizeKB.toFixed(2)}KB`);

    // Step 3: Compress image if needed
    if (finalSizeKB > maxSizeKB) {
      let quality = 0.8;
      let compressed = false;

      while (quality > 0.1) {
        const result = await ImageManipulator.manipulateAsync(compressedImageUri, [], {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
        });

        const response = await fetch(result.uri);
        const blob = await response.blob();
        finalSizeKB = blob.size / 1024;

        console.log(
          `Compressed at quality ${quality}: ${finalSizeKB.toFixed(2)}KB`
        );

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
          compressedImageUri,
          [],
          { compress: 0.1, format: ImageManipulator.SaveFormat.JPEG }
        );

        const finalResponse = await fetch(finalResult.uri);
        const finalBlob = await finalResponse.blob();
        finalSizeKB = finalBlob.size / 1024;

        if (finalSizeKB > maxSizeKB) {
          console.log(
            `Image is ${finalSizeKB.toFixed(
              2
            )}KB. Cannot compress to ${maxSizeKB}KB limit.`
          );
          Toast.show({
            type: "error",
            text1: "Compression Failed",
            text2: `Image is ${finalSizeKB.toFixed(
              2
            )}KB. Cannot compress to ${maxSizeKB}KB limit.`,
          });
          return null;
        }

        compressedImageUri = finalResult.uri;
      }
    }

    // Step 3: Convert compressed image to PDF
    let finalFileUri = compressedImageUri;
    let finalContentType = "image/jpeg"; // default until PDF is built
    let pdfGenerated = false;

    try {
      console.log("Attempting to convert to PDF...");

      const { width, height } = await getImageDimensions(compressedImageUri);
      console.log(`Image dimensions: ${width}x${height}`);
      console.log(`Image is ${width > height ? 'landscape' : 'portrait'} orientation`);

      // Fetch the image and convert to base64
      const imageResponse = await fetch(compressedImageUri);
      const imageBlob = await imageResponse.blob();
      console.log(`Image blob size: ${imageBlob.size} bytes, type: ${imageBlob.type}`);

      // Convert blob to base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.includes(",") ? result.split(",")[1] : result;
          console.log(`Base64 conversion complete, length: ${base64.length}`);
          resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(imageBlob);
      });

      const base64Image = await base64Promise;

      // Create a minimal PDF structure with embedded image
      console.log("Creating PDF with base64 image...");
      const pdfContent = await createMinimalPDF(base64Image);
      console.log(`PDF creation complete, base64 length: ${pdfContent.length}`);

      const pdfFileName = `PDF_${Date.now()}.pdf`;
      let pdfFileSize = 0;

      // Handle web vs native differently
      if (Platform.OS === "web") {
        // On web, convert base64 to blob and create data URL
        const binaryString = atob(pdfContent);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
          bytes[i] = binaryString.charCodeAt(i);
        }
        const pdfBlob = new Blob([bytes], { type: "application/pdf" });
        pdfFileSize = pdfBlob.size;
        
        // Create object URL for web
        const objectUrl = URL.createObjectURL(pdfBlob);
        finalFileUri = objectUrl;
        finalContentType = "application/pdf";
        pdfGenerated = true;
        
        console.log(`Generated PDF (web) size: ${(pdfFileSize / 1024).toFixed(2)}KB`);
        finalSizeKB = pdfFileSize / 1024;
      } else {
        // On native, save to file system
        const pdfPath = `${FileSystem.documentDirectory}${pdfFileName}`;

        await FileSystem.writeAsStringAsync(pdfPath, pdfContent, {
          encoding: FileSystem.EncodingType.Base64,
        });

        finalFileUri = pdfPath.startsWith("file://") ? pdfPath : `file://${pdfPath}`;
        finalContentType = "application/pdf";
        pdfGenerated = true;

        const pdfInfo = await FileSystem.getInfoAsync(finalFileUri);
        if (pdfInfo.exists && pdfInfo.size) {
          finalSizeKB = pdfInfo.size / 1024;
          console.log(`Generated PDF (native) size: ${finalSizeKB.toFixed(2)}KB`);
        }
      }
    } catch (pdfError) {
      console.error("Could not convert to PDF.", pdfError);
      Toast.show({
        type: "error",
        text1: "PDF Conversion Failed",
        text2: "The document could not be converted to PDF.",
      });
      return null;
    }

    // Step 4: Create processed document object
    const apiFormattedDocumentType = mapDocumentTypeToApiFormat(documentType);
    const fileName = `${apiFormattedDocumentType.replace(/\s+/g, "_")}_${Date.now()}${pdfGenerated ? ".pdf" : ".jpeg"}`;

    const processedDocument: ProcessedDocument = {
      fileName,
      contentType: finalContentType,
      frameNumber: frameNumber || chassisNo,
      documentType: apiFormattedDocumentType,
      fileUri: finalFileUri,
      fileSize: Math.round(finalSizeKB * 1024),
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
