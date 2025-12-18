import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface UploadDocument {
  documentName: string;
  fileUrl?: string;
  fileSize?: number;
  fileType?: 'PDF' | 'JPG';
  localUri?: string; // For newly captured/selected images
}

interface DocumentUploadContextType {
  uploadingDocument: UploadDocument | null;
  setUploadingDocument: (document: UploadDocument | null) => void;
  resetUploadingDocument: () => void;
  isTemp: boolean;
  setIsTemp: (value: boolean) => void;
  resetIsTemp: () => void;
}

// Create context
const DocumentUploadContext = createContext<DocumentUploadContextType | undefined>(undefined);

// Provider component
interface DocumentUploadProviderProps {
  children: ReactNode;
}

export const DocumentUploadProvider: React.FC<DocumentUploadProviderProps> = ({ children }) => {
  const [uploadingDocument, setUploadingDocument] = useState<UploadDocument | null>(null);
  const [isTemp, setIsTemp] = useState<boolean>(false);

  const resetUploadingDocument = () => {
    console.log('Resetting uploading document context');
    setUploadingDocument(null);
  };

  const resetIsTemp = () => {
    console.log('Resetting isTemp to false');
    setIsTemp(false);
  };

  const contextValue: DocumentUploadContextType = {
    uploadingDocument,
    setUploadingDocument,
    resetUploadingDocument,
    isTemp,
    setIsTemp,
    resetIsTemp,
  };

  return (
    <DocumentUploadContext.Provider value={contextValue}>
      {children}
    </DocumentUploadContext.Provider>
  );
};

// Hook to use the context
export const useDocumentUploadContext = (): DocumentUploadContextType => {
  const context = useContext(DocumentUploadContext);
  if (!context) {
    throw new Error('useDocumentUploadContext must be used within a DocumentUploadProvider');
  }
  return context;
};

export default DocumentUploadContext;
