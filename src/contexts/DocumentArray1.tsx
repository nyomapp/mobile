import React, { createContext, ReactNode, useContext, useState } from "react";

export interface DocumentType {
  id: number;
  title: string;
  icon: any;
  uploaded: boolean;
  documentName: string;
  fileUrl: string;
  fileSize: number;
  fileType: "PDF" | "JPG" | "PNG";
}

interface DocumentArrayContextType {
  documentTypes: DocumentType[];
  updateDocumentStatus: (
    documentName: string,
    uploaded: boolean,
    fileUrl: string,
  ) => void;
  updateBulkDocuments: (
    downloadDocuments: Array<{
      documentName: string;
      fileUrl: string;
      fileSize: number;
      fileType: "PDF" | "JPG" | "PNG";
    }>,
  ) => void;
  resetDocuments: () => void;
}

const initialDocumentTypes: DocumentType[] = [
  {
    id: 1,
    title: "Vehicle Front Image",
    icon: require("@/assets/icons/documentpagebikefrontsideicon.png"),
    uploaded: false,
    documentName: "FRONT",
    fileUrl: "",
    fileSize: 390,
    fileType: "PDF",
  },
  {
    id: 2,
    title: "Vehicle Side Image",
    icon: require("@/assets/icons/documentpagebikesidewiseicon.png"),
    uploaded: false,
    documentName: "LEFT",
    fileUrl: "",
    fileSize: 390,
    fileType: "PDF",
  },
  {
    id: 3,
    title: "Vehicle Frame Image",
    icon: require("@/assets/icons/documentpageframeicon.png"),
    uploaded: false,
    documentName: "CHASSIS",
    fileUrl: "",
    fileSize: 390,
    fileType: "PDF",
  },
  {
    id: 4,
    title: "Customer Photo",
    icon: require("@/assets/icons/documentpagecustomerphotoicon.png"),
    uploaded: false,
    documentName: "Customer",
    fileUrl: "",
    fileSize: 390,
    fileType: "PDF",
  },
  {
    id: 5,
    title: "Aadhaar Front",
    icon: require("@/assets/icons/documnetpageadhaarfronticon.png"),
    uploaded: false,
    documentName: "AADHAAR FRONT",
    fileUrl: "",
    fileSize: 195,
    fileType: "PDF",
  },
  {
    id: 6,
    title: "Aadhaar Back",
    icon: require("@/assets/icons/documnetpageadhaarbackicon.png"),
    uploaded: false,
    documentName: "AADHAAR BACK",
    fileUrl: "",
    fileSize: 195,
    fileType: "PDF",
  },
  {
    id: 7,
    title: "PAN Card",
    icon: require("@/assets/icons/documnetpageadhaarfronticon.png"),
    uploaded: false,
    documentName: "PAN",
    fileUrl: "",
    fileSize: 390,
    fileType: "PDF",
  },
  {
    id: 8,
    title: "Customer Photo",
    icon: require("@/assets/icons/rent doc 3.png"),
    uploaded: false,
    documentName: "Customer Photo",
    fileUrl: "",
    fileSize: 10000,
    fileType: "PNG",
  },
];

// Create context
const DocumentArrayContext = createContext<
  DocumentArrayContextType | undefined
>(undefined);

// Provider component
interface DocumentArrayProviderProps {
  children: ReactNode;
}

export const DocumentArrayProvider: React.FC<DocumentArrayProviderProps> = ({
  children,
}) => {
  const [documentTypes, setDocumentTypes] =
    useState<DocumentType[]>(initialDocumentTypes);

  const updateDocumentStatus = (
    documentName: string,
    uploaded: boolean,
    fileUrl: string,
  ) => {
    // console.log(`Updating document status: ${documentName} -> uploaded: ${uploaded}, fileUrl: ${fileUrl}`);
    setDocumentTypes((prevDocs) =>
      prevDocs.map((doc) =>
        doc.documentName === documentName ? { ...doc, uploaded, fileUrl } : doc,
      ),
    );
  };

  const updateBulkDocuments = (
    downloadDocuments: Array<{
      documentName: string;
      fileUrl: string;
      fileSize: number;
      fileType: "PDF" | "JPG" | "PNG";
    }>,
  ) => {
    console.log("Updating bulk documents:", downloadDocuments);

    // Filter downloadDocuments to only include documents that exist in documentTypes
    const validDocumentNames = initialDocumentTypes.map(
      (doc) => doc.documentName,
    );
    const filteredDownloadDocuments = downloadDocuments.filter((doc) =>
      validDocumentNames.includes(doc.documentName),
    );

    console.log(
      "Filtered documents (only existing keys):",
      filteredDownloadDocuments,
    );

    setDocumentTypes((prevDocs) =>
      prevDocs.map((doc) => {
        const matchingDoc = filteredDownloadDocuments.find(
          (d) => d.documentName === doc.documentName,
        );
        if (matchingDoc) {
          const hasFileUrl = !!(
            matchingDoc.fileUrl && matchingDoc.fileUrl.trim() !== ""
          );
          const newDoc: DocumentType = {
            ...doc,
            uploaded: hasFileUrl,
            fileUrl: hasFileUrl ? matchingDoc.fileUrl : "",
            fileSize: hasFileUrl ? matchingDoc.fileSize : doc.fileSize,
          };
          console.log(`Updated document ${doc.documentName}:`, newDoc);
          return newDoc;
        }
        return doc;
      }),
    );
  };

  const resetDocuments = () => {
    console.log("Resetting documents to initial state");
    setDocumentTypes(initialDocumentTypes);
  };

  const contextValue: DocumentArrayContextType = {
    documentTypes,
    updateDocumentStatus,
    updateBulkDocuments,
    resetDocuments,
  };

  return (
    <DocumentArrayContext.Provider value={contextValue}>
      {children}
    </DocumentArrayContext.Provider>
  );
};

// Hook to use the context
export const useDocumentArray = (): DocumentArrayContextType => {
  const context = useContext(DocumentArrayContext);
  if (!context) {
    throw new Error(
      "useDocumentArray must be used within a DocumentArrayProvider",
    );
  }
  return context;
};

export default DocumentArrayContext;
