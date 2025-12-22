import React, { createContext, ReactNode, useContext, useState } from 'react';

// Document size configuration
export const documentSizeConfig = {
  FRONT: { maxSize: 390, fileType: 'PDF' },
  LEFT: { maxSize: 390, fileType: 'PDF' },
  RIGHT: { maxSize: 390, fileType: 'PDF' },
  BACK: { maxSize: 390, fileType: 'PDF' },
  ODOMETER: { maxSize: 390, fileType: 'PDF' },
  CHASSIS: { maxSize: 390, fileType: 'PDF' },
  'AADHAAR FRONT': { maxSize: 195, fileType: 'PDF' },
  'AADHAAR BACK': { maxSize: 195, fileType: 'PDF' },
  'PAN': { maxSize: 195, fileType: 'PDF' },
  Customer: { maxSize: 390, fileType: 'PDF' },
  'TAX INVOICE': { maxSize: 390, fileType: 'PDF' },
  INSURANCE: { maxSize: 390, fileType: 'PDF' },
  'HELMET INVOICE': { maxSize: 390, fileType: 'PDF' },
  'FORM 20 1ST PAGE': { maxSize: 130, fileType: 'PDF' },
  'FORM 20 2ND PAGE': { maxSize: 130, fileType: 'PDF' },
  'FORM 20 3RD PAGE': { maxSize: 130, fileType: 'PDF' },
  'FORM 21': { maxSize: 390, fileType: 'PDF' },
  'FORM 22': { maxSize: 390, fileType: 'PDF' },
  AFFIDAVIT: { maxSize: 390, fileType: 'PDF' },
  'OTHER 1': { maxSize: 390, fileType: 'PDF' },
  'OTHER 2': { maxSize: 390, fileType: 'PDF' },
};

// Types
export type DocumentName = keyof typeof documentSizeConfig;

export interface DownloadDocument {
  documentName: DocumentName;
  fileUrl: string;
  fileSize: number;
  fileType: 'PDF' | 'JPG';
}

export interface Delivery {
  id?: string;
  certificateRef?: string;
  userRef: string;
  isRenewal?: boolean;
  customerName: string;
  mobileNumber: string;
  chassisNo?: string;
  registrationNumber?: string;
  modelRef?: string;
  exShowAmount?: number;
  insuranceAmount?: number;
  rtoAmount?: number;
  accessoriesAmount?: number;
  rsaAmount?: number;
  others1?: number;
  others2?: number;
  others3?: number;
  others4?: number;
  others5?: number;
  discount?: number;
  loyalty?: number;
  totalAmount?: number;
  downloadDocuments?: DownloadDocument[];
  purchaseType?: string;
  financerRef?: string;
  financeAmount?: number;
  financierPlan1?: string;
  financierPlan2?: number;
  helmetAmount?: number;
  //   status?: 'pending' | 'delivered';
  rtoLocation?: string | null;
  //   updatedBy: string;
}

// Context types
interface DeliveryContextType {
  // Current delivery being edited/created
  currentDelivery: Delivery | null;
  setCurrentDelivery: (delivery: Delivery | null) => void;

  // All deliveries
  deliveries: Delivery[];
  setDeliveries: (deliveries: Delivery[]) => void;

  // Loading states
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;

  // Additional states
  deliveryId: string | null;
  setDeliveryId: (id: string | null) => void;
  isEdit: boolean;
  setIsEdit: (edit: boolean) => void;

  // Helper functions
  updateDeliveryField: (field: keyof Delivery, value: any) => void;
  resetCurrentDelivery: () => void;
  resetDeliveryId: () => void;
  resetIsEdit: () => void;
  addDocument: (document: DownloadDocument) => void;
  removeDocument: (documentName: DocumentName) => void;
  calculateTotalAmount: () => number;
}

// Initial delivery state
const initialDelivery: Partial<Delivery> = {
  isRenewal: false,
  customerName: '',
  mobileNumber: '',
  chassisNo: '',
  registrationNumber: '',
  exShowAmount: undefined,
  insuranceAmount: undefined,
  rtoAmount: undefined,
  accessoriesAmount: undefined,
  helmetAmount: undefined,
  rsaAmount: undefined,
  others1: undefined,
  others2: undefined,
  others3: undefined,
  others4: undefined,
  others5: undefined,
  loyalty: undefined,
  discount: undefined,
  totalAmount: undefined,
  downloadDocuments: [],
  purchaseType: '',
  financeAmount: undefined,
  financierPlan1: '',
  financierPlan2: undefined,
  //   status: 'pending',
  rtoLocation: null,
};

// Create context
const DeliveryContext = createContext<DeliveryContextType | undefined>(undefined);

// Provider component
interface DeliveryProviderProps {
  children: ReactNode;
}

export const DeliveryProvider: React.FC<DeliveryProviderProps> = ({ children }) => {
  const [currentDelivery, setCurrentDelivery] = useState<Delivery | null>(null);
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryId, setDeliveryId] = useState<string | null>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const updateDeliveryField = (field: keyof Delivery, value: any) => {
    if (currentDelivery) {
      const updatedDelivery = { ...currentDelivery, [field]: value };
      setCurrentDelivery(updatedDelivery);
    }
  };

  const resetCurrentDelivery = () => {
    //console.log('Resetting delivery context to initial state:', initialDelivery);
    setCurrentDelivery(initialDelivery as Delivery);
  };

  const resetDeliveryId = () => {
    setDeliveryId(null);
  };

  const resetIsEdit = () => {
    setIsEdit(false);
  };

  const addDocument = (document: DownloadDocument) => {
    if (currentDelivery) {
      const existingDocuments = currentDelivery.downloadDocuments || [];
      const filteredDocuments = existingDocuments.filter(
        doc => doc.documentName !== document.documentName
      );
      const updatedDocuments = [...filteredDocuments, document];

      setCurrentDelivery({
        ...currentDelivery,
        downloadDocuments: updatedDocuments,
      });
    }
  };

  const removeDocument = (documentName: DocumentName) => {
    if (currentDelivery) {
      const existingDocuments = currentDelivery.downloadDocuments || [];
      const filteredDocuments = existingDocuments.filter(
        doc => doc.documentName !== documentName
      );

      setCurrentDelivery({
        ...currentDelivery,
        downloadDocuments: filteredDocuments,
      });
    }
  };

  const calculateTotalAmount = (): number => {
    if (!currentDelivery) return 0;

    const {
      exShowAmount = 0,
      insuranceAmount = 0,
      rtoAmount = 0,
      accessoriesAmount = 0,
      rsaAmount = 0,
      others1 = 0,
      others2 = 0,
      others3 = 0,
      others4 = 0,
      others5 = 0,
      discount = 0,
      loyalty = 0,
    } = currentDelivery;

    const total = exShowAmount + insuranceAmount + rtoAmount + accessoriesAmount +
      rsaAmount + others1 + others2 + others3 + others4 + others5 + loyalty - discount;
    return Math.max(0, total);
  };

  const contextValue: DeliveryContextType = {
    currentDelivery,
    setCurrentDelivery,
    deliveries,
    setDeliveries,
    isLoading,
    setIsLoading,
    deliveryId,
    setDeliveryId,
    isEdit,
    setIsEdit,
    updateDeliveryField,
    resetCurrentDelivery,
    resetDeliveryId,
    resetIsEdit,
    addDocument,
    removeDocument,
    calculateTotalAmount,
  };

  return (
    <DeliveryContext.Provider value={contextValue}>
      {children}
    </DeliveryContext.Provider>
  );
};

// Hook to use the context
export const useDeliveryContext = (): DeliveryContextType => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDeliveryContext must be used within a DeliveryProvider');
  }
  return context;
};

export default DeliveryContext;
