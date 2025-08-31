import { useState, useEffect } from 'react';
import { User } from '../types';
import { authUtils } from '../utils/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = authUtils.getToken();
    const userData = authUtils.getUser();
    
    if (token && userData) {
      setUser(userData);
    }
    
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock authentication - in a real app, this would be an API call
      const mockUser: User = {
        id: '1',
        email,
        name: email.split('@')[0],
        role: email.includes('admin') ? 'admin' : 'user',
        createdAt: new Date(),
      };
      
      const mockToken = 'mock-jwt-token';
      
      authUtils.setToken(mockToken);
      authUtils.setUser(mockUser);
      setUser(mockUser);
    } catch (error) {
      throw new Error('Login failed');
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string): Promise<void> => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock registration - in a real app, this would be an API call
      const mockUser: User = {
        id: crypto.randomUUID(),
        email,
        name,
        role: 'user',
        createdAt: new Date(),
      };
      
      const mockToken = 'mock-jwt-token';
      
      authUtils.setToken(mockToken);
      authUtils.setUser(mockUser);
      setUser(mockUser);
    } catch (error) {
      throw new Error('Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authUtils.removeAuth();
    setUser(null);
  };

  return {
    user,
    loading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };
};