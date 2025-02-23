import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { User, AuthContextValue, AuthState } from '../types/auth';

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authState = useSelector((state: RootState) => state.auth);

  const value: AuthContextValue = {
    ...authState,
    loading: authState.isLoading  // Add loading alias
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return {
    ...context,
    loading: context.isLoading // Alias isLoading as loading for backward compatibility
  };
};

interface AuthContextType {
  user: User | null;
  // ...existing interface properties...
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: localStorage.getItem('token'),
  error: null
};

// ...rest of existing code...
