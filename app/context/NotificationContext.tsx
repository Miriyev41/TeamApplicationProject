import React, { createContext, useContext, useState } from 'react';
import { Text, View } from 'react-native';

type Notification = {
  message: string;
  type?: 'success' | 'error' | 'info';
};

type NotificationContextType = {
  notify: (message: string, type?: Notification['type']) => void;
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotification must be used inside NotificationProvider');
  return context;
};

export const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notification, setNotification] = useState<Notification | null>(null);

  const notify = (message: string, type?: Notification['type']) => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <NotificationContext.Provider value={{ notify }}>
      {children}
      {notification && (
        <NotificationBanner message={notification.message} type={notification.type} />
      )}
    </NotificationContext.Provider>
  );
};

const NotificationBanner = ({
  message,
  type = 'info',
}: {
  message: string;
  type?: 'success' | 'error' | 'info';
}) => {
  const backgroundColors = {
    success: '#4caf50',
    error: '#f44336',
    info: '#2196f3',
  };

  return (
    <View
      style={{
        position: 'absolute',
        top: 50,
        left: 20,
        right: 20,
        padding: 16,
        borderRadius: 8,
        backgroundColor: backgroundColors[type],
        zIndex: 1000,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 10,
      }}
    >
      <Text style={{ color: '#fff', fontWeight: 'bold' }}>{message}</Text>
    </View>
  );
};
