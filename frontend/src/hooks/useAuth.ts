import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { AuthContextValue } from '../types/auth';  // Import from types instead

export const useAuth = (): AuthContextValue => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
