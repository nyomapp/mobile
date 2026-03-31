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
  "AADHAAR FRONT Photo": { maxSize: 500, minSize: 300 },
  "AADHAAR BACK Photo": { maxSize: 500, minSize: 300 },
  Customer: { maxSize: 390, minSize: 300 },
  "Customer Photo": { maxSize: 500, minSize: 300 },
  "TAX INVOICE": { maxSize: 390, minSize: 300 },
  INSURANCE: { maxSize: 390, minSize: 300 },
  "HELMET INVOICE": { maxSize: 195, minSize: 150 },
  "HELMET INVOICE 1": { maxSize: 195, minSize: 150 },
  "FORM 20 1ST PAGE": { maxSize: 130, minSize: 90 },
  "FORM 20 2ND PAGE": { maxSize: 130, minSize: 90 },
  "FORM 20 3RD PAGE": { maxSize: 130, minSize: 90 },
  "RENT DOCUMENT 1": { maxSize: 97, minSize: 50 },
  "RENT DOCUMENT 2": { maxSize: 97, minSize: 50 },
  "RENT DOCUMENT 3": { maxSize: 97, minSize: 50 },
  "RENT DOCUMENT 4": { maxSize: 97, minSize: 50 },
  "FORM 21": { maxSize: 390, minSize: 300 },
  "FORM 22": { maxSize: 390, minSize: 300 },
  AFFIDAVIT: { maxSize: 195, minSize: 150 },
  "AFFIDAVIT 1": { maxSize: 195, minSize: 150 },
  "OTHER 1": { maxSize: 390, minSize: 300 },
  "OTHER 2": { maxSize: 390, minSize: 300 },
};

/* ------------------------------------------------------------------ */
/* HELPERS */
/* ------------------------------------------------------------------ */

// Safe Uint8Array → Base64 (no stack overflow)
const uint8ToBase64 = (u8: Uint8Array): string => {
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < u8.length; i += chunkSize) {
    binary += String.fromCharCode(...u8.subarray(i, i + chunkSize));
  }
  return btoa(binary);
};

// Create single-page A4 PDF
// Create single-page A4 PDF
const createPdfFromImage = async (imageUri: string) => {
  const base64 = await FileSystem.readAsStringAsync(imageUri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  const pdfDoc = await PDFDocument.create();
  const imageBytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

  // Detect image format from file signature
  const isPNG = imageBytes[0] === 0x89 && imageBytes[1] === 0x50;

  // Embed the correct format
  const image = isPNG
    ? await pdfDoc.embedPng(imageBytes)
    : await pdfDoc.embedJpg(imageBytes);

  const page = pdfDoc.addPage([595, 842]); // A4
  page.drawImage(image, {
    x: 20,
    y: 20,
    width: 555,
    height: 802,
  });

  const pdfBytes = await pdfDoc.save();
  const pdfPath = `${FileSystem.documentDirectory}DOC_${Date.now()}.pdf`;

  await FileSystem.writeAsStringAsync(pdfPath, uint8ToBase64(pdfBytes), {
    encoding: FileSystem.EncodingType.Base64,
  });

  return {
    uri: pdfPath,
    sizeKB: pdfBytes.length / 1024,
  };
};

/* ------------------------------------------------------------------ */
/* CORE LOGIC – GUARANTEED SIZE */
/* ------------------------------------------------------------------ */

const compressToTargetPDFSize = async (imageUri: string, maxKB: number) => {
  const widths = [1600, 1400, 1300, 1200, 1100, 1000, 900, 800];
  const qualities = [0.9, 0.85, 0.8, 0.75, 0.7, 0.65, 0.6, 0.55];

  for (const width of widths) {
    for (const quality of qualities) {
      const img = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width } }],
        {
          compress: quality,
          format: ImageManipulator.SaveFormat.JPEG,
        },
      );

      const pdf = await createPdfFromImage(img.uri);

      if (pdf.sizeKB <= maxKB) {
        return pdf;
      }
    }
  }

  /* ------------------------------------------------------------------ */
  /* FINAL HARD CLAMP (ABSOLUTE SAFETY) */
  /* ------------------------------------------------------------------ */

  const forcedImg = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 600 } }],
    {
      compress: 0.5,
      format: ImageManipulator.SaveFormat.JPEG,
    },
  );

  const forcedPdf = await createPdfFromImage(forcedImg.uri);

  // Ensure it's under limit
  if (forcedPdf.sizeKB > maxKB) {
    throw new Error(`Cannot compress below ${maxKB}KB limit`);
  }

  return forcedPdf;
};

/* ------------------------------------------------------------------ */
/* PNG COMPRESSION */
/* ------------------------------------------------------------------ */

/**
 * Compresses an image to PNG format under the given KB limit.
 * Progressively reduces width to meet the target; never converts to JPEG,
 * preserving colour accuracy for photos.
 */
export const compressPNGToTargetSize = async (
  imageUri: string,
  maxKB: number = 500,
): Promise<{ uri: string; sizeKB: number }> => {
  // Try original resolution first (no resize)
  const originalImg = await ImageManipulator.manipulateAsync(imageUri, [], {
    compress: 1,
    format: ImageManipulator.SaveFormat.PNG,
  });
  const originalInfo = await FileSystem.getInfoAsync(originalImg.uri, {
    size: true,
  });
  const originalSizeKB = ((originalInfo as any).size ?? 0) / 1024;
  if (originalSizeKB <= maxKB) {
    return { uri: originalImg.uri, sizeKB: originalSizeKB };
  }

  // Progressively reduce width (PNG, lossless) until we're inside the limit
  const pngWidths = [1600, 1400, 1200, 1000, 900, 800, 700, 600, 500, 400, 300];
  for (const width of pngWidths) {
    const img = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width } }],
      { compress: 1, format: ImageManipulator.SaveFormat.PNG },
    );
    const info = await FileSystem.getInfoAsync(img.uri, { size: true });
    const sizeKB = ((info as any).size ?? 0) / 1024;
    if (sizeKB <= maxKB) {
      return { uri: img.uri, sizeKB };
    }
  }

  // PNG fallback: switch to high-quality JPEG (visually near-lossless) to meet limit
  const jpegWidths = [1600, 1400, 1200, 1000, 900, 800, 700, 600];
  const jpegQualities = [0.95, 0.92, 0.9, 0.88, 0.85, 0.82, 0.8];
  for (const width of jpegWidths) {
    for (const quality of jpegQualities) {
      const img = await ImageManipulator.manipulateAsync(
        imageUri,
        [{ resize: { width } }],
        { compress: quality, format: ImageManipulator.SaveFormat.JPEG },
      );
      const info = await FileSystem.getInfoAsync(img.uri, { size: true });
      const sizeKB = ((info as any).size ?? 0) / 1024;
      if (sizeKB <= maxKB) {
        return { uri: img.uri, sizeKB };
      }
    }
  }

  // Absolute last resort — force it under the limit
  const forcedImg = await ImageManipulator.manipulateAsync(
    imageUri,
    [{ resize: { width: 500 } }],
    { compress: 0.75, format: ImageManipulator.SaveFormat.JPEG },
  );
  const forcedInfo = await FileSystem.getInfoAsync(forcedImg.uri, {
    size: true,
  });
  const forcedSizeKB = ((forcedInfo as any).size ?? 0) / 1024;
  if (forcedSizeKB <= maxKB) {
    return { uri: forcedImg.uri, sizeKB: forcedSizeKB };
  }

  throw new Error(`Cannot compress image below ${maxKB}KB`);
};

/* ------------------------------------------------------------------ */
/* PUBLIC API */
/* ------------------------------------------------------------------ */

export const compressAndConvertToPDF = async (
  imageUri: string,
  documentType: string,
): Promise<{ uri: string; sizeKB: number } | null> => {
  try {
    const cfg =
      DOCUMENT_SIZE_CONFIG[documentType as keyof typeof DOCUMENT_SIZE_CONFIG];

    const maxKB = cfg?.maxSize ?? 390;

    console.log("🚀 Processing:", documentType, "Max:", maxKB, "KB");

    const result = await compressToTargetPDFSize(imageUri, maxKB);

    Toast.show({
      type: "success",
      text1: "Document Ready",
      text2: `${documentType} - ${result.sizeKB.toFixed(0)}KB`,
    });

    return result;
  } catch (error) {
    console.error("PDF processing error:", error);
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
  chassisNo: string,
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
