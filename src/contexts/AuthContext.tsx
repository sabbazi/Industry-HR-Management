import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUser: User = {
  id: '1',
  email: 'sarah.johnson@company.com',
  firstName: 'Sarah',
  lastName: 'Johnson',
  role: 'hr',
  department: 'hr',
  avatar: 'https://ui-avatars.com/api/?name=Sarah+Johnson&background=3B82F6&color=fff'
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('hrUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Mock authentication - in real app, this would call an API
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (email === 'admin@company.com' && password === 'admin123') {
      const adminUser = { ...mockUser, email, role: 'admin' as const };
      setUser(adminUser);
      localStorage.setItem('hrUser', JSON.stringify(adminUser));
      setIsLoading(false);
      return true;
    } else if (email === 'hr@company.com' && password === 'hr123') {
      setUser(mockUser);
      localStorage.setItem('hrUser', JSON.stringify(mockUser));
      setIsLoading(false);
      return true;
    }
    
    setIsLoading(false);
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('hrUser');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
