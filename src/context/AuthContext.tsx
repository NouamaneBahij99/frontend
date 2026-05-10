import React, { createContext, useContext, useState, ReactNode } from 'react';

interface User {
  userId: number;
  email: string;
  role: string;
  nom: string;
  prenom: string;
  accessToken: string;
}

interface AuthContextType {
  user: User | null;
  login: (userData: any) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: () => boolean;
  isChef: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData: any) => {
    const userToStore = {
      userId: userData.userId,
      email: userData.email,
      role: userData.role,
      nom: userData.nom,
      prenom: userData.prenom,
      accessToken: userData.accessToken,
    };
    localStorage.setItem('user', JSON.stringify(userToStore));
    localStorage.setItem('accessToken', userData.accessToken);
    localStorage.setItem('refreshToken', userData.refreshToken || '');
    setUser(userToStore);
  };

  const logout = () => {
    localStorage.clear();
    setUser(null);
    window.location.href = '/login';
  };

  const isAdmin = () => user?.role === 'ADMIN';
  const isChef = () => ['ADMIN', 'CHEF_SERVICE', 'DIRECTEUR'].includes(user?.role || '');

  return (
    <AuthContext.Provider value={{
      user, login, logout,
      isAuthenticated: !!user,
      isAdmin, isChef
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
