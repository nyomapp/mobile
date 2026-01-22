import React, { createContext, ReactNode, useContext, useState } from "react";

// Define the Executive interface
export interface Executive {
  id: string;
  name: string;
  email: string;
  phone?: string;
  userType?: string;
  status?: "active" | "inactive";
  createdAt?: string;
  updatedAt?: string;
  // Add any other executive properties you need
  [key: string]: any; // Allow for additional dynamic properties
}

// Define the context interface
interface ExecutiveDataContextType {
  // State
  executives: Executive[];

  // Actions
  setExecutives: (executives: Executive[]) => void;
  resetExecutives: () => void;
}

// Create the context
const ExecutiveDataContext = createContext<
  ExecutiveDataContextType | undefined
>(undefined);

// Provider Props
interface ExecutiveDataProviderProps {
  children: ReactNode;
}

// Provider component
export const ExecutiveDataProvider: React.FC<ExecutiveDataProviderProps> = ({
  children,
}) => {
  const [executives, setExecutivesState] = useState<Executive[]>([]);

  // Set executives array
  const setExecutives = (executives: Executive[]) => {
    setExecutivesState(executives);
  };

  // Reset executives to empty array
  const resetExecutives = () => {
    setExecutivesState([]);
  };

  const value: ExecutiveDataContextType = {
    // State
    executives,

    // Actions
    setExecutives,
    resetExecutives,
  };

  return (
    <ExecutiveDataContext.Provider value={value}>
      {children}
    </ExecutiveDataContext.Provider>
  );
};

// Custom hook to use the context
export const useExecutiveData = (): ExecutiveDataContextType => {
  const context = useContext(ExecutiveDataContext);
  if (context === undefined) {
    throw new Error(
      "useExecutiveData must be used within an ExecutiveDataProvider",
    );
  }
  return context;
};

// Export the context for advanced usage
export default ExecutiveDataContext;
