import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored auth on app start
    const checkStoredAuth = async () => {
      try {
        // In a real app, you'd check AsyncStorage or secure storage
        const storedUser = typeof window !== 'undefined' ? localStorage.getItem('fastingAppUser') : null;
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking stored auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkStoredAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in real app, call your API
      if (email && password.length >= 6) {
        const newUser: User = {
          id: '1',
          email,
          name: email.split('@')[0],
          avatar: undefined,
        };
        
        setUser(newUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('fastingAppUser', JSON.stringify(newUser));
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration - in real app, call your API
      if (email && password.length >= 6 && name) {
        const newUser: User = {
          id: '1',
          email,
          name,
          avatar: undefined,
        };
        
        setUser(newUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem('fastingAppUser', JSON.stringify(newUser));
        }
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('fastingAppUser');
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}