import React, { createContext, useContext, useState, ReactNode } from 'react';

// Model interface
export interface Model {
  id: string;
  name: string;
  makeId?: string;
  makeName?: string;
  category?: string;
  type?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: any; // Allow additional properties
}

// Context types
interface ModelsContextType {
  // Models array
  models: Model[];
  
  // Loading state
  isLoading: boolean;
  
  // Error state
  error: string | null;
  
  // Core functions
  setModels: (models: Model[]) => void;
  resetModels: () => void;
  clearModels: () => void;
  
  // Utility functions
  addModel: (model: Model) => void;
  removeModel: (modelId: string) => void;
  updateModel: (modelId: string, updatedModel: Partial<Model>) => void;
  getModelById: (modelId: string) => Model | undefined;
  getModelsByMake: (makeId: string) => Model[];
  
  // State management
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  
  // Search and filter functions
  searchModels: (searchTerm: string) => Model[];
  filterModelsByCategory: (category: string) => Model[];
  getActiveModels: () => Model[];
}

// Create context
const ModelsContext = createContext<ModelsContextType | undefined>(undefined);

// Provider component
interface ModelsProviderProps {
  children: ReactNode;
}

export const ModelsProvider: React.FC<ModelsProviderProps> = ({ children }) => {
  const [models, setModelsState] = useState<Model[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Core functions
  const setModels = (newModels: Model[]): void => {
    setModelsState(newModels);
    setError(null); // Clear error when setting new models
  };

  const resetModels = (): void => {
    setModelsState([]);
    setIsLoading(false);
    setError(null);
  };

  const clearModels = (): void => {
    setModelsState([]);
  };

  // Utility functions
  const addModel = (model: Model): void => {
    setModelsState(prevModels => [...prevModels, model]);
  };

  const removeModel = (modelId: string): void => {
    setModelsState(prevModels => prevModels.filter(model => model.id !== modelId));
  };

  const updateModel = (modelId: string, updatedModel: Partial<Model>): void => {
    setModelsState(prevModels =>
      prevModels.map(model =>
        model.id === modelId ? { ...model, ...updatedModel } : model
      )
    );
  };

  const getModelById = (modelId: string): Model | undefined => {
    return models.find(model => model.id === modelId);
  };

  const getModelsByMake = (makeId: string): Model[] => {
    return models.filter(model => model.makeId === makeId);
  };

  // State management
  const setLoading = (loading: boolean): void => {
    setIsLoading(loading);
  };

  const setErrorState = (errorMessage: string | null): void => {
    setError(errorMessage);
  };

  // Search and filter functions
  const searchModels = (searchTerm: string): Model[] => {
    if (!searchTerm.trim()) return models;
    
    const lowerSearchTerm = searchTerm.toLowerCase();
    return models.filter(model =>
      model.name.toLowerCase().includes(lowerSearchTerm) ||
      (model.makeName && model.makeName.toLowerCase().includes(lowerSearchTerm)) ||
      (model.category && model.category.toLowerCase().includes(lowerSearchTerm))
    );
  };

  const filterModelsByCategory = (category: string): Model[] => {
    return models.filter(model => model.category === category);
  };

  const getActiveModels = (): Model[] => {
    return models.filter(model => model.isActive !== false); // Include undefined as active
  };

  const contextValue: ModelsContextType = {
    // Models array
    models,
    
    // Loading state
    isLoading,
    
    // Error state
    error,
    
    // Core functions
    setModels,
    resetModels,
    clearModels,
    
    // Utility functions
    addModel,
    removeModel,
    updateModel,
    getModelById,
    getModelsByMake,
    
    // State management
    setLoading,
    setError: setErrorState,
    
    // Search and filter functions
    searchModels,
    filterModelsByCategory,
    getActiveModels,
  };

  return (
    <ModelsContext.Provider value={contextValue}>
      {children}
    </ModelsContext.Provider>
  );
};

// Hook to use the context
export const useModels = (): ModelsContextType => {
  const context = useContext(ModelsContext);
  if (!context) {
    throw new Error('useModels must be used within a ModelsProvider');
  }
  return context;
};

export default ModelsContext;
