import { useState, useEffect } from 'react';
import { loginAdmin, logoutAdmin, getCurrentSession } from '../services/authApi';
import { supabase } from '../../../shared/lib/supabaseClient';

export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setIsLoggedIn(!!session);
      setAuthChecked(true);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsLoggedIn(!!session);
      setAuthChecked(true);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email, password) => {
    setLoginError('');
    setLoginLoading(true);
    try {
      await loginAdmin(email, password);
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
