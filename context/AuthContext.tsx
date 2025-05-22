"use client";


import React, { createContext, useContext, useState, useEffect } from 'react';

type User = {
  id: string;
  email: string;
  name?: string;
  subscription: 'free' | 'pro' | 'enterprise';
};

type Usage = {
  uploadsUsed: number;
  uploadsLimit: number;
  extractionsUsed: number;
  extractionsLimit: number;
};

type AuthContextType = {
  user: User | null;
  usage: Usage;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock usage data based on subscription tier
  const [usage, setUsage] = useState<Usage>({
    uploadsUsed: 0,
    uploadsLimit: 10,
    extractionsUsed: 0,
    extractionsLimit: 10,
  });

  // Check for existing auth session on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        // Simulating auth check with local storage
        const storedUser = localStorage.getItem('invoiceApp_user');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUser(parsedUser);
          
          // Set usage limits based on subscription
          if (parsedUser.subscription === 'pro') {
            setUsage({
              uploadsUsed: 0,
              uploadsLimit: 100,
              extractionsUsed: 0,
              extractionsLimit: 1000,
            });
          }
        }
      } catch (err) {
        console.error('Auth session check failed', err);
        setError('Failed to restore session');
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  // Mock authentication functions
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll accept any valid email/password
      if (email && password.length >= 6) {
        const mockUser: User = {
          id: `user-${Date.now()}`,
          email,
          subscription: 'free',
        };
        
        setUser(mockUser);
        localStorage.setItem('invoiceApp_user', JSON.stringify(mockUser));
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name?: string) => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // For demo purposes, we'll create a user with any valid info
      if (email && password.length >= 6) {
        const mockUser: User = {
          id: `user-${Date.now()}`,
          email,
          name,
          subscription: 'free',
        };
        
        setUser(mockUser);
        localStorage.setItem('invoiceApp_user', JSON.stringify(mockUser));
      } else {
        throw new Error('Invalid signup information');
      }
    } catch (err: any) {
      setError(err.message || 'Signup failed');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('invoiceApp_user');
  };

  const value = {
    user,
    usage,
    isLoading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
