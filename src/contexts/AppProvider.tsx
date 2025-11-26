import React from 'react';
import { AuthProvider } from './AuthContext';
import { UserProvider } from './UserContext';
import { TeamProvider } from './TeamContext';
import { MatchMakingProvider } from './MatchMakingContext';

interface AppProviderProps {
  children: React.ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  return (
    <AuthProvider>
      <UserProvider>
        <TeamProvider>
          <MatchMakingProvider>
            {children}
          </MatchMakingProvider>
        </TeamProvider>
      </UserProvider>
    </AuthProvider>
  );
};