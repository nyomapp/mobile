import React, { createContext, useContext, useState, ReactNode } from 'react';

// Generic interface for any object structure
interface MasterDataObject {
  [key: string]: any;
}

// Context types
interface MasterDataContextType {
  // Current data object
  data: MasterDataObject;
  setData: (data: MasterDataObject) => void;
  
  // Helper functions
  updateField: (key: string, value: any) => void;
  updateMultipleFields: (updates: Partial<MasterDataObject>) => void;
  resetData: (initialData?: MasterDataObject) => void;
  getField: (key: string) => any;
  removeField: (key: string) => void;
  
  // Utility functions
  hasField: (key: string) => boolean;
  getAllKeys: () => string[];
  getDataSize: () => number;
  isDataEmpty: () => boolean;
}

// Initial empty state
const initialMasterData: MasterDataObject = {};

// Create context
const MasterDataContext = createContext<MasterDataContextType | undefined>(undefined);

// Provider component
interface MasterDataProviderProps {
  children: ReactNode;
  initialData?: MasterDataObject;
}

export const MasterDataProvider: React.FC<MasterDataProviderProps> = ({ 
  children, 
  initialData = initialMasterData 
}) => {
  const [data, setData] = useState<MasterDataObject>(initialData);

  // Update a single field
  const updateField = (key: string, value: any) => {
    setData(prevData => ({
      ...prevData,
      [key]: value
    }));
    console.log(`MasterData: Updated field '${key}' with value:`, value);
  };

  // Update multiple fields at once
  const updateMultipleFields = (updates: Partial<MasterDataObject>) => {
    setData(prevData => ({
      ...prevData,
      ...updates
    }));
    console.log('MasterData: Updated multiple fields:', updates);
  };

  // Reset data to initial state or provided data
  const resetData = (resetToData: MasterDataObject = initialMasterData) => {
    setData(resetToData);
    console.log('MasterData: Reset data to:', resetToData);
  };

  // Get a specific field value
  const getField = (key: string) => {
    return data[key];
  };

  // Remove a field from the data
  const removeField = (key: string) => {
    setData(prevData => {
      const newData = { ...prevData };
      delete newData[key];
      return newData;
    });
    console.log(`MasterData: Removed field '${key}'`);
  };

  // Check if a field exists
  const hasField = (key: string): boolean => {
    return key in data;
  };

  // Get all keys in the data object
  const getAllKeys = (): string[] => {
    return Object.keys(data);
  };

  // Get the number of fields in the data
  const getDataSize = (): number => {
    return Object.keys(data).length;
  };

  // Check if data is empty
  const isDataEmpty = (): boolean => {
    return Object.keys(data).length === 0;
  };

  const contextValue: MasterDataContextType = {
    data,
    setData,
    updateField,
    updateMultipleFields,
    resetData,
    getField,
    removeField,
    hasField,
    getAllKeys,
    getDataSize,
    isDataEmpty,
  };

  return (
    <MasterDataContext.Provider value={contextValue}>
      {children}
    </MasterDataContext.Provider>
  );
};

// Hook to use the context
export const useMasterData = (): MasterDataContextType => {
  const context = useContext(MasterDataContext);
  if (!context) {
    throw new Error('useMasterData must be used within a MasterDataProvider');
  }
  return context;
};

// Export types for external use
export type { MasterDataObject, MasterDataContextType };

export default MasterDataContext;
