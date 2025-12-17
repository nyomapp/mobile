import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface DashBoardData {
  totalDeliveries: number;
  pendingDeliveries: number;
  completedDeliveries: number;
  todayDeliveries: number;
  monthlyDeliveries: number;
  totalRevenue: number;
  monthlyRevenue: number;
  recentActivities: Array<{
    id: string;
    type: 'delivery' | 'payment' | 'document';
    customerName: string;
    amount?: number;
    status: string;
    timestamp: string;
  }>;
  chartData: Array<{
    month: string;
    deliveries: number;
    revenue: number;
  }>;
  topModels: Array<{
    modelName: string;
    count: number;
    percentage: number;
  }>;
  notifications: Array<{
    id: string;
    title: string;
    message: string;
    type: 'info' | 'warning' | 'success' | 'error';
    timestamp: string;
    isRead: boolean;
  }>;
}

interface DashBoardContextType {
  // Dashboard data state
  dashBoardData: DashBoardData;
  setDashBoardData: (data: DashBoardData) => void;
  updateDashBoardData: (updates: Partial<DashBoardData>) => void;
  resetDashBoardData: () => void;
  
  // Individual data setters
  setTotalDeliveries: (count: number) => void;
  setPendingDeliveries: (count: number) => void;
  setCompletedDeliveries: (count: number) => void;
  setTotalRevenue: (amount: number) => void;
  setRecentActivities: (activities: DashBoardData['recentActivities']) => void;
  setChartData: (data: DashBoardData['chartData']) => void;
  setTopModels: (models: DashBoardData['topModels']) => void;
  setNotifications: (notifications: DashBoardData['notifications']) => void;
  
  // Individual data getters
  getTotalDeliveries: () => number;
  getPendingDeliveries: () => number;
  getCompletedDeliveries: () => number;
  getTotalRevenue: () => number;
  getRecentActivities: () => DashBoardData['recentActivities'];
  getChartData: () => DashBoardData['chartData'];
  getTopModels: () => DashBoardData['topModels'];
  getNotifications: () => DashBoardData['notifications'];
  getUnreadNotificationsCount: () => number;
  
  // Loading state
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Last updated timestamp
  lastUpdated: string | null;
  setLastUpdated: (timestamp: string) => void;
  
  // Utility functions
  markNotificationAsRead: (notificationId: string) => void;
  markAllNotificationsAsRead: () => void;
  addNotification: (notification: Omit<DashBoardData['notifications'][0], 'id' | 'timestamp' | 'isRead'>) => void;
  removeNotification: (notificationId: string) => void;
}

const initialDashBoardData: DashBoardData = {
  totalDeliveries: 0,
  pendingDeliveries: 0,
  completedDeliveries: 0,
  todayDeliveries: 0,
  monthlyDeliveries: 0,
  totalRevenue: 0,
  monthlyRevenue: 0,
  recentActivities: [],
  chartData: [],
  topModels: [],
  notifications: [],
};

// Create context
const DashBoardContext = createContext<DashBoardContextType | undefined>(undefined);

// Provider component
interface DashBoardProviderProps {
  children: ReactNode;
}

export const DashBoardProvider: React.FC<DashBoardProviderProps> = ({ children }) => {
  const [dashBoardData, setDashBoardData] = useState<DashBoardData>(initialDashBoardData);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  const updateDashBoardData = (updates: Partial<DashBoardData>) => {
    setDashBoardData(prev => ({ ...prev, ...updates }));
    setLastUpdated(new Date().toISOString());
  };

  const resetDashBoardData = () => {
    console.log('Resetting dashboard data to initial state');
    setDashBoardData(initialDashBoardData);
    setLastUpdated(null);
  };

  // Individual setters
  const setTotalDeliveries = (count: number) => {
    updateDashBoardData({ totalDeliveries: count });
  };

  const setPendingDeliveries = (count: number) => {
    updateDashBoardData({ pendingDeliveries: count });
  };

  const setCompletedDeliveries = (count: number) => {
    updateDashBoardData({ completedDeliveries: count });
  };

  const setTotalRevenue = (amount: number) => {
    updateDashBoardData({ totalRevenue: amount });
  };

  const setRecentActivities = (activities: DashBoardData['recentActivities']) => {
    updateDashBoardData({ recentActivities: activities });
  };

  const setChartData = (data: DashBoardData['chartData']) => {
    updateDashBoardData({ chartData: data });
  };

  const setTopModels = (models: DashBoardData['topModels']) => {
    updateDashBoardData({ topModels: models });
  };

  const setNotifications = (notifications: DashBoardData['notifications']) => {
    updateDashBoardData({ notifications: notifications });
  };

  // Individual getters
  const getTotalDeliveries = () => dashBoardData.totalDeliveries;
  const getPendingDeliveries = () => dashBoardData.pendingDeliveries;
  const getCompletedDeliveries = () => dashBoardData.completedDeliveries;
  const getTotalRevenue = () => dashBoardData.totalRevenue;
  const getRecentActivities = () => dashBoardData.recentActivities;
  const getChartData = () => dashBoardData.chartData;
  const getTopModels = () => dashBoardData.topModels;
  const getNotifications = () => dashBoardData.notifications;
  const getUnreadNotificationsCount = () => 
    dashBoardData.notifications.filter(n => !n.isRead).length;

  // Notification utilities
  const markNotificationAsRead = (notificationId: string) => {
    const updatedNotifications = dashBoardData.notifications.map(notification =>
      notification.id === notificationId ? { ...notification, isRead: true } : notification
    );
    setNotifications(updatedNotifications);
  };

  const markAllNotificationsAsRead = () => {
    const updatedNotifications = dashBoardData.notifications.map(notification => 
      ({ ...notification, isRead: true })
    );
    setNotifications(updatedNotifications);
  };

  const addNotification = (notificationData: Omit<DashBoardData['notifications'][0], 'id' | 'timestamp' | 'isRead'>) => {
    const newNotification = {
      ...notificationData,
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      isRead: false,
    };
    const updatedNotifications = [newNotification, ...dashBoardData.notifications];
    setNotifications(updatedNotifications);
  };

  const removeNotification = (notificationId: string) => {
    const updatedNotifications = dashBoardData.notifications.filter(
      notification => notification.id !== notificationId
    );
    setNotifications(updatedNotifications);
  };

  const contextValue: DashBoardContextType = {
    // Dashboard data
    dashBoardData,
    setDashBoardData,
    updateDashBoardData,
    resetDashBoardData,
    
    // Individual setters
    setTotalDeliveries,
    setPendingDeliveries,
    setCompletedDeliveries,
    setTotalRevenue,
    setRecentActivities,
    setChartData,
    setTopModels,
    setNotifications,
    
    // Individual getters
    getTotalDeliveries,
    getPendingDeliveries,
    getCompletedDeliveries,
    getTotalRevenue,
    getRecentActivities,
    getChartData,
    getTopModels,
    getNotifications,
    getUnreadNotificationsCount,
    
    // Loading state
    isLoading,
    setIsLoading,
    
    // Last updated
    lastUpdated,
    setLastUpdated,
    
    // Notification utilities
    markNotificationAsRead,
    markAllNotificationsAsRead,
    addNotification,
    removeNotification,
  };

  return (
    <DashBoardContext.Provider value={contextValue}>
      {children}
    </DashBoardContext.Provider>
  );
};

// Hook to use the context
export const useDashBoard = (): DashBoardContextType => {
  const context = useContext(DashBoardContext);
  if (!context) {
    throw new Error('useDashBoard must be used within a DashBoardProvider');
  }
  return context;
};

export default DashBoardContext;
