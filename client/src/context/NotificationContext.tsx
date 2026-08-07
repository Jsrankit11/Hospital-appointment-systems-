import React, { createContext, useContext, useState, useEffect } from 'react';
import { getSocket } from '../services/socket';

export interface ToastAlert {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning' | 'emergency';
  title: string;
  message: string;
  timestamp: string;
}

interface NotificationContextType {
  toasts: ToastAlert[];
  emergencyActive: boolean;
  emergencyData: any | null;
  addToast: (type: ToastAlert['type'], title: string, message: string) => void;
  removeToast: (id: string) => void;
  triggerEmergencyCodeBlue: (location?: string) => void;
  dismissEmergency: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastAlert[]>([]);
  const [emergencyActive, setEmergencyActive] = useState<boolean>(false);
  const [emergencyData, setEmergencyData] = useState<any | null>(null);

  const addToast = (type: ToastAlert['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    const newToast: ToastAlert = {
      id,
      type,
      title,
      message,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };

    setToasts(prev => [newToast, ...prev.slice(0, 5)]);

    // Auto dismiss after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const triggerEmergencyCodeBlue = (location = 'ICU Block B, 2nd Floor') => {
    const socket = getSocket();
    socket.emit('emergency:broadcast', {
      code: 'CODE_BLUE',
      location,
      message: `Immediate Medical Resuscitation & Anesthesia Team required at ${location}!`
    });
  };

  const dismissEmergency = () => {
    setEmergencyActive(false);
    setEmergencyData(null);
  };

  // Listen to socket emergency alerts
  useEffect(() => {
    const socket = getSocket();

    socket.on('emergency:alert', (data: any) => {
      setEmergencyActive(true);
      setEmergencyData(data);
      addToast('emergency', '🚨 EMERGENCY CODE BLUE!', data.message);
    });

    socket.on('opd:token_called', (data: any) => {
      addToast('info', `Token #${data.appointment?.tokenNumber} Called`, `Now consulting with ${data.appointment?.doctorName} in ${data.appointment?.opdRoom}`);
    });

    socket.on('lab:report_ready', (data: any) => {
      addToast('success', 'Lab Diagnostic Report Signed', `Report for ${data.test?.testName} is now ready for download.`);
    });

    return () => {
      socket.off('emergency:alert');
      socket.off('opd:token_called');
      socket.off('lab:report_ready');
    };
  }, []);

  return (
    <NotificationContext.Provider value={{
      toasts,
      emergencyActive,
      emergencyData,
      addToast,
      removeToast,
      triggerEmergencyCodeBlue,
      dismissEmergency
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
