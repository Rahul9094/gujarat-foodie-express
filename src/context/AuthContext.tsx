import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  name: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, name?: string) => Promise<boolean>;
  signup: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('gujaratFoodUser');
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('gujaratFoodUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('gujaratFoodUser');
    }
  }, [user]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Get stored users
    const storedUsers = JSON.parse(localStorage.getItem('gujaratFoodUsers') || '[]');
    const foundUser = storedUsers.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      setUser({ name: foundUser.name, email: foundUser.email });
      return true;
    }
    return false;
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    const storedUsers = JSON.parse(localStorage.getItem('gujaratFoodUsers') || '[]');
    
    // Check if user already exists
    if (storedUsers.find((u: any) => u.email === email)) {
      return false;
    }
    
    // Add new user
    storedUsers.push({ name, email, password });
    localStorage.setItem('gujaratFoodUsers', JSON.stringify(storedUsers));
    
    setUser({ name, email });
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
        isAuthenticated: !!user,
      }}
    >
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
