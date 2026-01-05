import React, { createContext, ReactNode, useContext, useState } from 'react';

// Define the User interface
export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  userType?: string;
  status?: 'active' | 'inactive';
  createdAt?: string;
  updatedAt?: string;
  // Add any other user properties you need
  [key: string]: any; // Allow for additional dynamic properties
}

// Define the context interface
interface UsersDataContextType {
  // State
  users: User[];
  
  // Actions
  setUsers: (users: User[]) => void;
  resetUsers: () => void;
}

// Create the context
const UsersDataContext = createContext<UsersDataContextType | undefined>(undefined);

// Provider Props
interface UsersDataProviderProps {
  children: ReactNode;
}

// Provider component
export const UsersDataProvider: React.FC<UsersDataProviderProps> = ({ children }) => {
  const [users, setUsersState] = useState<User[]>([]);

  // Set users array
  const setUsers = (users: User[]) => {
    setUsersState(users);
  };

  // Reset users to empty array
  const resetUsers = () => {
    setUsersState([]);
  };

  const value: UsersDataContextType = {
    // State
    users,
    
    // Actions
    setUsers,
    resetUsers,
  };

  return (
    <UsersDataContext.Provider value={value}>
      {children}
    </UsersDataContext.Provider>
  );
};

// Custom hook to use the context
export const useUsersData = (): UsersDataContextType => {
  const context = useContext(UsersDataContext);
  if (context === undefined) {
    throw new Error('useUsersData must be used within a UsersDataProvider');
  }
  return context;
};

// Export the context for advanced usage
export default UsersDataContext;