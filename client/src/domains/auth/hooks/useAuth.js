import { useState, useEffect } from 'react';
import { loginAdmin, logoutAdmin, getCurrentSession } from '../services/authApi';

/**
 * Hook to manage admin authentication state using backend REST API
 */
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    getCurrentSession().then((session) => {
      setIsLoggedIn(!!session);
      setAuthChecked(true);
    }).catch(() => {
      setIsLoggedIn(false);
      setAuthChecked(true);
    });
  }, []);

  const handleLogin = async (email, password) => {
    setLoginError('');
    setLoginLoading(true);
    try {
      await loginAdmin(email, password);
      setIsLoggedIn(true);
      return true;
    } catch (error) {
      setLoginError(error.message || 'Credenciais invalidas. Tente novamente.');
      return false;
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logoutAdmin();
      setIsLoggedIn(false);
      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;
    }
  };

  return {
    isLoggedIn,
    authChecked,
    loginError,
    loginLoading,
    handleLogin,
    handleLogout
  };
}
