import React, { createContext, ReactNode, useContext, useState } from "react";

export interface DocumentType {
  id: number;
  title: string;
  icon: any;
  uploaded: boolean;
  documentName: string;
  fileUrl: string;
  fileSize: number;
  fileType: "PDF" | "JPG";
}

interface DocumentArrayContextType {
  documentTypes: DocumentType[];
  updateDocumentStatus: (
    documentName: string,
    uploaded: boolean,
    fileUrl: string
  ) => void;
  updateBulkDocuments: (
    downloadDocuments: Array<{
      documentName: string;
      fileUrl: string;
      fileSize: number;
      fileType: "PDF" | "JPG";
    }>
  ) => void;
  resetDocuments: () => void;
  isOtherDocumentsUpload: boolean;
  setIsOtherDocumentsUpload: (value: boolean) => void;
  resetIsOtherDocumentsUpload: () => void;
}

const initialDocumentTypes: DocumentType[] = [
  {
    id: 1,
    title: "Invoice",
    icon: require("@/assets/icons/invoiceIcon.png"),
    uploaded: false,
    documentName: "TAX INVOICE",
    fileUrl: "",
    fileSize: 390,
    fileType: "PDF",
  },
  {
    id: 2,
    title: "Insurance",
    icon: require("@/assets/icons/insuranceIcon.png"),
    uploaded: false,
    documentName: "INSURANCE",
    fileUrl: "",
    fileSize: 390,
    fileType: "PDF",
  },
  {
    id: 3,
    title: "Helmet Invoice",
    icon: require("@/assets/icons/helmetInvoiceIcon.png"),
    uploaded: false,
    documentName: "HELMET INVOICE",
    fileUrl: "",
    fileSize: 390,
    fileType: "PDF",
  },
  {
    id: 4,
    title: "Form 20 - 1",
    icon: require("@/assets/icons/form 20 -1Icon.png"),
    uploaded: false,
    documentName: "FORM 20 1ST PAGE",
    fileUrl: "",
    fileSize: 130,
    fileType: "PDF",
  },
  {
    id: 5,
    title: "Form 20 - 2",
    icon: require("@/assets/icons/form 20 - 2Icon.png"),
    uploaded: false,
    documentName: "FORM 20 2ND PAGE",
    fileUrl: "",
    fileSize: 130,
    fileType: "PDF",
  },
  {
    id: 6,
    title: "Form 20 - 3",
    icon: require("@/assets/icons/form 20 - 3Icon.png"),
    uploaded: false,
    documentName: "FORM 20 3RD PAGE",
    fileUrl: "",
    fileSize: 130,
    fileType: "PDF",
  },
  {
    id: 7,
    title: "Form 21",
    icon: require("@/assets/icons/form 21 Icon.png"),
    uploaded: false,
    documentName: "FORM 21",
    fileUrl: "",
    fileSize: 390,
    fileType: "PDF",
  },
  {
    id: 8,
    title: "Form 22",
    icon: require("@/assets/icons/form 22Icon.png"),
    uploaded: false,
    documentName: "FORM 22",
    fileUrl: "",
    fileSize: 390,
    fileType: "PDF",
  },
  {
    id: 9,
    title: "AFFIDAVIT",
    icon: require("@/assets/icons/affidavitIcon.png"),
    uploaded: false,
    documentName: "AFFIDAVIT",
    fileUrl: "",
    fileSize: 390,
    fileType: "PDF",
  },
];

// Create context
const DocumentArray2Context = createContext<
  DocumentArrayContextType | undefined
>(undefined);

// Provider component
interface DocumentArrayProviderProps {
  children: ReactNode;
}

export const DocumentArray2Provider: React.FC<DocumentArrayProviderProps> = ({
  children,
}) => {
  const [documentTypes, setDocumentTypes] =
    useState<DocumentType[]>(initialDocumentTypes);
  const [isOtherDocumentsUpload, setIsOtherDocumentsUpload] =
    useState<boolean>(false);

  const updateDocumentStatus = (
    documentName: string,
    uploaded: boolean,
    fileUrl: string
  ) => {
    setDocumentTypes((prevDocs) =>
      prevDocs.map((doc) =>
        doc.documentName === documentName ? { ...doc, uploaded, fileUrl } : doc
      )
    );
  };

  const updateBulkDocuments = (
    downloadDocuments: Array<{ documentName: string; fileUrl: string; fileSize: number; fileType: 'PDF' | 'JPG' }>
  ) => {
    console.log('Updating bulk documents:', downloadDocuments);
    
    // Filter downloadDocuments to only include documents that exist in documentTypes
    const validDocumentNames = initialDocumentTypes.map(doc => doc.documentName);
    const filteredDownloadDocuments = downloadDocuments.filter(
      doc => validDocumentNames.includes(doc.documentName)
    );
    
    console.log('Filtered documents (only existing keys):', filteredDownloadDocuments);
    
    setDocumentTypes(prevDocs =>
      prevDocs.map(doc => {
        const matchingDoc = filteredDownloadDocuments.find(d => d.documentName === doc.documentName);
        if (matchingDoc) {
          const hasFileUrl = !!(matchingDoc.fileUrl && matchingDoc.fileUrl.trim() !== '');
          const newDoc: DocumentType = {
            ...doc,
            uploaded: hasFileUrl,
            fileUrl: hasFileUrl ? matchingDoc.fileUrl : '',
            fileSize: hasFileUrl ? matchingDoc.fileSize : doc.fileSize,
          };
          return newDoc;
        }
        return doc;
      })
    );
  };

  const resetDocuments = () => {
    console.log("Resetting documents to initial state");
    setDocumentTypes(initialDocumentTypes);
  };

  const resetIsOtherDocumentsUpload = () => {
    console.log("Resetting isOtherDocumentsUpload to false");
    setIsOtherDocumentsUpload(false);
  };

  const contextValue: DocumentArrayContextType = {
    documentTypes,
    updateDocumentStatus,
    updateBulkDocuments,
    resetDocuments,
    isOtherDocumentsUpload,
    setIsOtherDocumentsUpload,
    resetIsOtherDocumentsUpload,
  };

  return (
    <DocumentArray2Context.Provider value={contextValue}>
      {children}
    </DocumentArray2Context.Provider>
  );
};

// Hook to use the context
export const useDocumentArray2 = (): DocumentArrayContextType => {
  const context = useContext(DocumentArray2Context);
  if (!context) {
    throw new Error(
      "useDocumentArray2 must be used within a DocumentArray2Provider"
    );
  }
  return context;
};

export default DocumentArray2Context;
