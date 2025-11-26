import React, { createContext, useContext, useState } from 'react';
import { TeamsAPI } from '../api';
import { Team, CreateTeamRequest } from '../api/types';

interface TeamContextType {
  teams: Team[];
  currentTeam: Team | null;
  isLoading: boolean;
  getAllTeams: () => Promise<Team[]>;
  getTeamById: (teamId: string) => Promise<Team | null>;
  createTeam: (data: CreateTeamRequest) => Promise<Team | null>;
  setCurrentTeam: (team: Team | null) => void;
  setTeams: (teams: Team[]) => void;
}

const TeamContext = createContext<TeamContextType | undefined>(undefined);

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (context === undefined) {
    throw new Error('useTeam must be used within a TeamProvider');
  }
  return context;
};

export const TeamProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [teams, setTeams] = useState<Team[]>([]);
  const [currentTeam, setCurrentTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getAllTeams = async (): Promise<Team[]> => {
    setIsLoading(true);
    try {
      const response = await TeamsAPI.getAllTeams();
      if (response.success && response.data) {
        setTeams(response.data);
        return response.data;
      }
      return [];
    } catch (error) {
      console.error('Get all teams error:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  const getTeamById = async (teamId: string): Promise<Team | null> => {
    setIsLoading(true);
    try {
      const response = await TeamsAPI.getTeamById(teamId);
      if (response.success && response.data) {
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Get team error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const createTeam = async (data: CreateTeamRequest): Promise<Team | null> => {
    setIsLoading(true);
    try {
      const response = await TeamsAPI.createTeam(data);
      if (response.success && response.data) {
        setTeams(prev => [...prev, response.data!]);
        return response.data;
      }
      return null;
    } catch (error) {
      console.error('Create team error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    teams,
    currentTeam,
    isLoading,
    getAllTeams,
    getTeamById,
    createTeam,
    setCurrentTeam,
    setTeams,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};