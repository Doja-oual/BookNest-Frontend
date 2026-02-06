'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContextType, AuthState } from '@/types/auth.types';
import { User, UserRole } from '@/types';
import { authService } from '@/services';
import { setAuthToken, removeAuthToken, isAuthenticated as checkTokenExists } from '@/lib/axios';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
  });

  const checkAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      if (!checkTokenExists()) {
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        return;
      }

      const user = await authService.getProfile();
      setState({
        user,
        token: localStorage.getItem('token'),
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      console.error('Auth check failed:', error);
      removeAuthToken();
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  }, []);

  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await authService.login({ email, password });
      
      setAuthToken(response.access_token);
      
      const userRole: any = response.user?.role || response.role || UserRole.PARTICIPANT;
      const user = response.user || { ...response, role: userRole };
      
      setState({
        user,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
      });

      // Utiliser window.location pour forcer le rechargement de la page
      if (typeof window !== 'undefined') {
        if (userRole === 'ADMIN' || userRole === UserRole.ADMIN) {
          window.location.href = '/admin/dashboard';
        } else {
          window.location.href = '/participant/dashboard';
        }
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const register = async (firstName: string, lastName: string, email: string, password: string, role?: UserRole) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      const response = await authService.register({ firstName, lastName, email, password, role: role || UserRole.PARTICIPANT });
      
      setAuthToken(response.access_token);
      
      const userRole: any = response.user?.role || response.role || UserRole.PARTICIPANT;
      const user = response.user || { ...response, role: userRole };
      
      setState({
        user,
        token: response.access_token,
        isAuthenticated: true,
        isLoading: false,
      });

      if (userRole === 'ADMIN' || userRole === UserRole.ADMIN) {
        router.push('/admin');
      } else {
        router.push('/participant/dashboard');
      }
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    removeAuthToken();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
    router.push('/');
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await authService.updateProfile(data);
      setState(prev => ({
        ...prev,
        user: updatedUser,
      }));
    } catch (error) {
      console.error('Profile update failed:', error);
      throw error;
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
