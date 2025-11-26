import React, { createContext, useContext, useState } from 'react';
import { MatchMakingAPI } from '../api';
import { MatchRequest } from '../api/types';

interface MatchMakingContextType {
  isMatching: boolean;
  currentMatchId: string | null;
  createMatchRequest: (data: MatchRequest) => Promise<string | null>;
  checkStatus: (id: string) => Promise<any>;
  cancelMatch: (id: string) => Promise<boolean>;
}

const MatchMakingContext = createContext<MatchMakingContextType | undefined>(undefined);

export const useMatchMaking = () => {
  const context = useContext(MatchMakingContext);
  if (!context) {
    throw new Error('useMatchMaking must be used within MatchMakingProvider');
  }
  return context;
};

export const MatchMakingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMatching, setIsMatching] = useState(false);
  const [currentMatchId, setCurrentMatchId] = useState<string | null>(null);

  const createMatchRequest = async (data: MatchRequest): Promise<string | null> => {
    setIsMatching(true);
    try {
      const response = await MatchMakingAPI.createMatchRequest(data);
      if (response.success && response.data?.id) {
        setCurrentMatchId(response.data.id);
        return response.data.id;
      }
      return null;
    } catch (error) {
      console.error('Create match request error:', error);
      return null;
    } finally {
      setIsMatching(false);
    }
  };

  const checkStatus = async (id: string) => {
    try {
      const response = await MatchMakingAPI.checkAssignmentStatus(id);
      return response.success ? response.data : null;
    } catch (error) {
      console.error('Check status error:', error);
      return null;
    }
  };

  const cancelMatch = async (id: string): Promise<boolean> => {
    try {
      const response = await MatchMakingAPI.cancelMatchRequest(id);
      if (response.success) {
        setCurrentMatchId(null);
        setIsMatching(false);
      }
      return response.success;
    } catch (error) {
      console.error('Cancel match error:', error);
      return false;
    }
  };

  const value = {
    isMatching,
    currentMatchId,
    createMatchRequest,
    checkStatus,
    cancelMatch,
  };

  return (
    <MatchMakingContext.Provider value={value}>
      {children}
    </MatchMakingContext.Provider>
  );
};