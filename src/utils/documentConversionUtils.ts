import * as FileSystem from "expo-file-system";
import * as ImageManipulator from "expo-image-manipulator";
import { PDFDocument } from "pdf-lib";
import Toast from "react-native-toast-message";
 
/* ------------------------------------------------------------------ */
/* CONFIG */
/* ------------------------------------------------------------------ */
 
export const DOCUMENT_SIZE_CONFIG = {
  FRONT: { maxSize: 390, minSize: 300 },
  LEFT: { maxSize: 390, minSize: 300 },
  RIGHT: { maxSize: 390, minSize: 300 },
  BACK: { maxSize: 390, minSize: 300 },
  ODOMETER: { maxSize: 390, minSize: 300 },
  CHASSIS: { maxSize: 390, minSize: 300 },
  PAN: { maxSize: 390, minSize: 300 },
  "AADHAAR FRONT": { maxSize: 195, minSize: 100 },
  "AADHAAR BACK": { maxSize: 195, minSize: 100 },
  Customer: { maxSize: 390, minSize: 300 },
  "TAX INVOICE": { maxSize: 390, minSize: 300 },
  INSURANCE: { maxSize: 390, minSize: 300 },
  "HELMET INVOICE": { maxSize: 390, minSize: 300 },
  "FORM 20 1ST PAGE": { maxSize: 130, minSize: 90 },
  "FORM 20 2ND PAGE": { maxSize: 130, minSize: 90 },
  "FORM 20 3RD PAGE": { maxSize: 130, minSize: 90 },
  "FORM 21": { maxSize: 390, minSize: 300 },
  "FORM 22": { maxSize: 390, minSize: 300 },
  AFFIDAVIT: { maxSize: 390, minSize: 300 },
  "OTHER 1": { maxSize: 390, minSize: 300 },
  "OTHER 2": { maxSize: 390, minSize: 300 },
};
 
/* ------------------------------------------------------------------ */
/* HELPERS */
/* ------------------------------------------------------------------ */
 
// image resize + high quality (NO over-compress)
const normalizeImage = async (uri: string, width: number) => {
  return ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width } }],
    {
      compress: 0.88,
      format: ImageManipulator.SaveFormat.JPEG,
    }
  );
};
 
// safe Uint8Array → base64 (NO stack overflow)
const uint8ToBase64 = (u8: Uint8Array): string => {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < u8.length; i += chunkSize) {
    binary += String.fromCharCode(
      ...u8.subarray(i, i + chunkSize)
    );
  }
  return btoa(binary);
};
 
// create single-page A4 PDF
const createPdfFromImage = async (imageUri: string) => {
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });
 
  const pdfDoc = await PDFDocument.create();
  const imageBytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
  const image = await pdfDoc.embedJpg(imageBytes);
 
  const page = pdfDoc.addPage([595, 842]); // A4
  page.drawImage(image, {
    x: 20,
    y: 20,
    width: 555,
    height: 802,
  });
 
  const pdfBytes = await pdfDoc.save();
  const pdfPath = `${FileSystem.documentDirectory}DOC_${Date.now()}.pdf`;
 
  await FileSystem.writeAsStringAsync(
    pdfPath,
    uint8ToBase64(pdfBytes),
    { encoding: FileSystem.EncodingType.Base64 }
  );
 
  return {
    uri: pdfPath,
    sizeKB: pdfBytes.length / 1024,
  };
};
 
/* ------------------------------------------------------------------ */
/* CORE LOGIC – AUTO FIT (NO ERROR EVER) */
/* ------------------------------------------------------------------ */
 
const compressToTargetPDFSize = async (
  imageUri: string,
  maxKB: number
) => {
  // 🔥 auto fallback widths (BEST → SAFE)
  const widths = [1600, 1400, 1300, 1200, 1100];
 
  let lastResult: { uri: string; sizeKB: number } | null = null;
 
  for (const w of widths) {
    const img = await normalizeImage(imageUri, w);
    const pdf = await createPdfFromImage(img.uri);
 
    lastResult = pdf;
 
    // ✅ accept first PDF under max limit
    if (pdf.sizeKB <= maxKB) {
      return pdf;
    }
  }
 
  // 🟡 worst-case fallback (still return PDF, no error)
  return lastResult!;
};
 
/* ------------------------------------------------------------------ */
/* PUBLIC API */
/* ------------------------------------------------------------------ */
 
export const compressAndConvertToPDF = async (
  imageUri: string,
  documentType: string
): Promise<{ uri: string; sizeKB: number } | null> => {
  try {
    const cfg =
      DOCUMENT_SIZE_CONFIG[documentType as keyof typeof DOCUMENT_SIZE_CONFIG];
 
    const maxKB = cfg?.maxSize ?? 390;
 
    console.log("🚀 === PROCESSING DOCUMENT ===");
    console.log("📋 Document Type:", documentType);
    console.log(`🎯 Target Max Size: ${maxKB}KB`);
 
    const result = await compressToTargetPDFSize(imageUri, maxKB);
 
    Toast.show({
      type: "success",
      text1: "Document Ready",
      text2: `${documentType} - ${result.sizeKB.toFixed(0)}KB`,
    });
 
    return result;
  } catch (error) {
    console.error("Error in compressAndConvertToPDF:", error);
    Toast.show({
      type: "error",
      text1: "Processing failed",
      text2: "Please try again",
    });
    return null;
  }
};
 
/* ------------------------------------------------------------------ */
/* FINAL WRAPPER (API FORMAT) */
/* ------------------------------------------------------------------ */
 
export interface ProcessedDocument {
  fileName: string;
  contentType: string;
  frameNumber: string;
  documentType: string;
  fileUri: string;
  fileSize: number;
}
 
export const convertImageToPdfAndCompress = async (
  imageUri: string,
  documentType: string,
  frameNumber: string,
  chassisNo: string
): Promise<ProcessedDocument | null> => {
  const result = await compressAndConvertToPDF(imageUri, documentType);
  if (!result) return null;
 
  return {
    fileName: `${documentType.replace(/\s+/g, "_")}_${Date.now()}.pdf`,
    contentType: "application/pdf",
    frameNumber: frameNumber || chassisNo,
    documentType,
    fileUri: result.uri,
    fileSize: Math.round(result.sizeKB * 1024),
  };
};
 
/* ------------------------------------------------------------------ */
/* UTILS */
/* ------------------------------------------------------------------ */
 
export const formatFileSize = (bytes: number): string => {
  if (!bytes) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
};
 
export const getSizeLimitText = (documentType: string): string => {
  const cfg =
    DOCUMENT_SIZE_CONFIG[documentType as keyof typeof DOCUMENT_SIZE_CONFIG];
  return `Max file size: ${cfg?.maxSize ?? 390}KB`;
};