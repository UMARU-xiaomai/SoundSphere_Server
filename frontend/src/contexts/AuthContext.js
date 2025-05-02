import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // 检查是否已登录
    const checkLoginStatus = async () => {
      const token = localStorage.getItem('token');
      
      if (token) {
        try {
          const response = await axios.get(`${API_URL}/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          setCurrentUser(response.data);
        } catch (error) {
          console.error('验证会话失败', error);
          localStorage.removeItem('token');
        }
      }
      
      setLoading(false);
    };

    checkLoginStatus();
  }, []);

  const login = async (username, password) => {
    try {
      setError('');
      const response = await axios.post(`${API_URL}/auth/login`, {
        username,
        password
      });
      
      localStorage.setItem('token', response.data.access_token);
      setCurrentUser(response.data.user);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || '登录失败，请检查用户名和密码');
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      setError('');
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        email,
        password
      });
      
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || '注册失败，请稍后再试');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${API_URL}/auth/logout`);
    } catch (error) {
      console.error('登出请求失败', error);
    } finally {
      localStorage.removeItem('token');
      setCurrentUser(null);
    }
  };

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading,
    error
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider; 