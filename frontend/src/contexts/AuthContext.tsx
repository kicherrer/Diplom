import React, { createContext, useContext } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store';
import { AuthState, User } from '../types/auth';

// Export the interface
export interface AuthContextValue extends AuthState {
  loading: boolean;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const authState = useSelector((state: RootState) => state.auth);

  const value: AuthContextValue = {
    ...authState,
    loading: authState.isLoading  // Add loading alias
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Remove duplicate useAuth export since we're moving it to a separate file

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  token: localStorage.getItem('token'),
  error: null
};

// ...rest of existing code...
