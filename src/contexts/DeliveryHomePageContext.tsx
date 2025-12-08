import React, { createContext, useContext, useState, ReactNode } from 'react';

// Define the structure matching API response
export interface DeliveryHomePageData {
  results: any[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
}

// Default state matching API response structure
const defaultState: DeliveryHomePageData = {
  results: [],
  page: 1,
  limit: 10,
  totalPages: 1,
  totalResults: 0,
};

// Context type definition
interface DeliveryHomePageContextType {
  data: DeliveryHomePageData;
  
  // Simple functions
  setData: (newData: DeliveryHomePageData) => void;
  resetData: () => void;
}

// Create the context
const DeliveryHomePageContext = createContext<DeliveryHomePageContextType | undefined>(undefined);

// Provider component
interface DeliveryHomePageProviderProps {
  children: ReactNode;
}

export const DeliveryHomePageProvider: React.FC<DeliveryHomePageProviderProps> = ({ children }) => {
  const [data, setDataState] = useState<DeliveryHomePageData>(defaultState);

  // Set entire data object
  const setData = (newData: DeliveryHomePageData) => {
    setDataState(newData);
  };

  // Reset all data to default
  const resetData = () => {
    setDataState(defaultState);
  };

  const contextValue: DeliveryHomePageContextType = {
    data,
    setData,
    resetData,
  };

  return (
    <DeliveryHomePageContext.Provider value={contextValue}>
      {children}
    </DeliveryHomePageContext.Provider>
  );
};

// Custom hook to use the context
export const useDeliveryHomePageContext = () => {
  const context = useContext(DeliveryHomePageContext);
  if (context === undefined) {
    throw new Error('useDeliveryHomePageContext must be used within a DeliveryHomePageProvider');
  }
  return context;
};

// Export the context for advanced usage
export default DeliveryHomePageContext;