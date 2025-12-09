import React, { createContext, ReactNode, useContext, useState } from 'react';

// Generic interface for array items
interface FinancierDataItem {
  [key: string]: any;
}

// Context types
interface FinancierDataContextType {
  // Current data array
  data: FinancierDataItem[];
  setData: (data: FinancierDataItem[]) => void;

  // Array management functions
  addItem: (item: FinancierDataItem) => void;
  removeItem: (index: number) => void;
  removeItemById: (id: string | number, idField?: string) => void;
  updateItem: (index: number, updatedItem: FinancierDataItem) => void;
  updateItemById: (id: string | number, updatedItem: FinancierDataItem, idField?: string) => void;
  clearData: () => void;
  resetData: (initialData?: FinancierDataItem[]) => void;

  // Utility functions
  getItem: (index: number) => FinancierDataItem | undefined;
  getItemById: (id: string | number, idField?: string) => FinancierDataItem | undefined;
  findItemIndex: (predicate: (item: FinancierDataItem) => boolean) => number;
  filterItems: (predicate: (item: FinancierDataItem) => boolean) => FinancierDataItem[];
  getDataLength: () => number;
  isDataEmpty: () => boolean;
}

// Initial empty array
const initialFinancierData: FinancierDataItem[] = [];

// Create context
const FinancierDataContext = createContext<FinancierDataContextType | undefined>(undefined);

// Provider component
interface FinancierDataProviderProps {
  children: ReactNode;
  initialData?: FinancierDataItem[];
}

export const FinancierDataProvider: React.FC<FinancierDataProviderProps> = ({
  children,
  initialData = initialFinancierData
}) => {
  const [data, setData] = useState<FinancierDataItem[]>(initialData || []);

  // Add new item to array
  const addItem = (item: FinancierDataItem) => {
    setData(prevData => [...prevData, item]);
    //console.log('FinancierData: Added item:', item);
  };

  // Remove item by index
  const removeItem = (index: number) => {
    setData(prevData => {
      const newData = [...prevData];
      newData.splice(index, 1);
      return newData;
    });
    //console.log(`FinancierData: Removed item at index ${index}`);
  };

  // Remove item by ID
  const removeItemById = (id: string | number, idField: string = 'id') => {
    setData(prevData => prevData.filter(item => item[idField] !== id));
    //console.log(`FinancierData: Removed item with ${idField}:`, id);
  };

  // Update item by index
  const updateItem = (index: number, updatedItem: FinancierDataItem) => {
    setData(prevData => {
      const newData = [...prevData];
      newData[index] = updatedItem;
      return newData;
    });
    //console.log(`FinancierData: Updated item at index ${index}:`, updatedItem);
  };

  // Update item by ID
  const updateItemById = (id: string | number, updatedItem: FinancierDataItem, idField: string = 'id') => {
    setData(prevData =>
      prevData.map(item =>
        item[idField] === id ? updatedItem : item
      )
    );
    //console.log(`FinancierData: Updated item with ${idField} ${id}:`, updatedItem);
  };

  // Clear all data
  const clearData = () => {
    setData([]);
    //console.log('FinancierData: Cleared all data');
  };

  // Reset data to initial state or provided data
  const resetData = (resetToData: FinancierDataItem[] = initialFinancierData) => {
    setData(resetToData);
    console.log('FinancierData: Reset data to:', resetToData);
  };

  // Get item by index
  const getItem = (index: number): FinancierDataItem | undefined => {
    return data ? data[index] : undefined;
  };

  // Get item by ID
  const getItemById = (id: string | number, idField: string = 'id'): FinancierDataItem | undefined => {
    return data ? data.find(item => item[idField] === id) : undefined;
  };

  // Find item index by predicate
  const findItemIndex = (predicate: (item: FinancierDataItem) => boolean): number => {
    return data ? data.findIndex(predicate) : -1;
  };

  // Filter items by predicate
  const filterItems = (predicate: (item: FinancierDataItem) => boolean): FinancierDataItem[] => {
    return data ? data.filter(predicate) : [];
  };

  // Get array length
  const getDataLength = (): number => {
    return data ? data.length : 0;
  };

  // Check if array is empty
  const isDataEmpty = (): boolean => {
    return !data || data.length === 0;
  };

  const contextValue: FinancierDataContextType = {
    data,
    setData,
    addItem,
    removeItem,
    removeItemById,
    updateItem,
    updateItemById,
    clearData,
    resetData,
    getItem,
    getItemById,
    findItemIndex,
    filterItems,
    getDataLength,
    isDataEmpty,
  };

  return (
    <FinancierDataContext.Provider value={contextValue}>
      {children}
    </FinancierDataContext.Provider>
  );
};

// Hook to use the context
export const useFinancierData = (): FinancierDataContextType => {
  const context = useContext(FinancierDataContext);
  if (!context) {
    throw new Error('useFinancierData must be used within a FinancierDataProvider');
  }
  return context;
};

// Export types for external use
export type { FinancierDataContextType, FinancierDataItem };

export default FinancierDataContext;