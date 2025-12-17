import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface SearchFilters {
  customerName: string;
  mobileNumber: string;
  chassisNo: string;
  registrationNumber: string;
  modelRef: string;
  financerRef: string;
  rtoLocation: string;
  purchaseType: 'cash' | 'finance' | '';
  dateFrom: string;
  dateTo: string;
  status: string;
}

export interface SearchResult {
  _id: string;
  customerName: string;
  mobileNumber: string;
  chassisNo: string;
  registrationNumber: string;
  modelRef: string;
  financerRef: string;
  rtoLocation: string;
  purchaseType: 'cash' | 'finance';
  totalAmount: number;
  createdAt: string;
  status: string;
}

interface SearchContextType {
  // Search filters state
  searchFilters: SearchFilters;
  setSearchFilters: (filters: SearchFilters) => void;
  updateSearchFilter: (key: keyof SearchFilters, value: string) => void;
  resetSearchFilters: () => void;
  
  // Search results state
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
  resetSearchResults: () => void;
  
  // Loading and UI state
  isSearching: boolean;
  setIsSearching: (loading: boolean) => void;
  
  // Search query state
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  resetSearchQuery: () => void;
  
  // Selected result state
  selectedResult: SearchResult | null;
  setSelectedResult: (result: SearchResult | null) => void;
  resetSelectedResult: () => void;
  
  // Reset all search data
  resetAll: () => void;
}

const initialSearchFilters: SearchFilters = {
  customerName: '',
  mobileNumber: '',
  chassisNo: '',
  registrationNumber: '',
  modelRef: '',
  financerRef: '',
  rtoLocation: '',
  purchaseType: '',
  dateFrom: '',
  dateTo: '',
  status: '',
};

// Create context
const SearchContext = createContext<SearchContextType | undefined>(undefined);

// Provider component
interface SearchProviderProps {
  children: ReactNode;
}

export const SearchProvider: React.FC<SearchProviderProps> = ({ children }) => {
  const [searchFilters, setSearchFilters] = useState<SearchFilters>(initialSearchFilters);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);

  const updateSearchFilter = (key: keyof SearchFilters, value: string) => {
    setSearchFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const resetSearchFilters = () => {
    console.log('Resetting search filters to initial state');
    setSearchFilters(initialSearchFilters);
  };

  const resetSearchResults = () => {
    console.log('Resetting search results');
    setSearchResults([]);
  };

  const resetSearchQuery = () => {
    console.log('Resetting search query');
    setSearchQuery('');
  };

  const resetSelectedResult = () => {
    console.log('Resetting selected result');
    setSelectedResult(null);
  };

  const resetAll = () => {
    console.log('Resetting all search data');
    resetSearchFilters();
    resetSearchResults();
    resetSearchQuery();
    resetSelectedResult();
    setIsSearching(false);
  };

  const contextValue: SearchContextType = {
    // Search filters
    searchFilters,
    setSearchFilters,
    updateSearchFilter,
    resetSearchFilters,
    
    // Search results
    searchResults,
    setSearchResults,
    resetSearchResults,
    
    // Loading state
    isSearching,
    setIsSearching,
    
    // Search query
    searchQuery,
    setSearchQuery,
    resetSearchQuery,
    
    // Selected result
    selectedResult,
    setSelectedResult,
    resetSelectedResult,
    
    // Reset all
    resetAll,
  };

  return (
    <SearchContext.Provider value={contextValue}>
      {children}
    </SearchContext.Provider>
  );
};

// Hook to use the context
export const useSearchContext = (): SearchContextType => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearchContext must be used within a SearchProvider');
  }
  return context;
};

export default SearchContext;
