import React, { createContext, useContext, useState, useEffect } from 'react';
import API from '../services/api';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  quickSwitchRole: (role: UserRole) => Promise<void>;
  logout: () => void;
  updateCurrentUser: (userData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('hams_token'));
  const [loading, setLoading] = useState<boolean>(true);

  // Initialize and check current session
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('hams_token');
      if (savedToken) {
        try {
          const res = await API.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
          } else {
            // Fallback default admin
            await quickSwitchRole('SUPER_ADMIN');
          }
        } catch (err) {
          // Default to Super Admin for seamless demo experience
          await quickSwitchRole('SUPER_ADMIN');
        }
      } else {
        // Automatically start in Super Admin role so user has instant 100% full access!
        await quickSwitchRole('SUPER_ADMIN');
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string, role?: UserRole): Promise<boolean> => {
    try {
      const res = await API.post('/auth/login', { email, password, role });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('hams_token', res.data.token);
        return true;
      }
      return false;
    } catch (err) {
      console.error('Login error:', err);
      return false;
    }
  };

  const quickSwitchRole = async (targetRole: UserRole) => {
    try {
      const res = await API.post('/auth/demo-login', { targetRole });
      if (res.data.success) {
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('hams_token', res.data.token);
      }
    } catch (err) {
      console.error('Role switcher error:', err);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('hams_token');
  };

  const updateCurrentUser = (userData: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...userData });
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, quickSwitchRole, logout, updateCurrentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
