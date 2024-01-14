import { createContext, PropsWithChildren, useEffect, useState } from 'react';
import { destroyCookie, parseCookies, setCookie } from 'nookies';
import Router from 'next/router';
import { signInRequest, signUpRequest } from '@/services/api/auth';
import { api, ApiErrorResponse } from '@/services/api/api';
import jwt from 'jwt-decode';
type User = {
  nome: string;
  id: string;
};

type SignInData = {
  email: string;
  senha: string;
};

type SignUpData = {
  nome: string;
  email: string;
  senha: string;
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: ApiErrorResponse | null;
  signIn: (data: SignInData) => Promise<void>;
  signUp: (data: SignUpData) => Promise<void>;
  logout: () => void;
  clearError: () => void;
};

export const AuthContext = createContext({} as AuthContextType);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<ApiErrorResponse | null>(null);

  const isAuthenticated = !!user;

  useEffect(() => {
    const { 'nextauth.token': token } = parseCookies();

    if (token) {
      const { nome, id } = jwt<{ nome: string; id: string }>(
        token,
      );
      setUser({ id, nome });
    }
  }, []);

  async function signIn({ email, senha }: SignInData) {
    try {
      setLoading(true);
      const { user } = await signInRequest({
        email,
        senha,
      });

      setCookie(undefined, 'nextauth.token', user.token, {
        maxAge: 60 * 60 * 1, // 1 hour
      });

      api.defaults.headers['Authorization'] = `Bearer ${user.token}`;
      setUser(user);
      await Router.push('/');
    } catch (error: any) {
      if (error instanceof ApiErrorResponse) {
        setError(error);
      } else {
        setError({
          status: 500,
          title: 'Internal Error',
          detail: error?.message,
          type: '',
        });
      }
    } finally {
      setLoading(false);
    }
  }

  async function signUp({ email, senha, nome }: SignUpData) {
    try {
      setLoading(true);
      await signUpRequest({
        email,
        senha,
        nome,
      });
      await Router.push('/signin');
    } catch (error: any) {
      if (error instanceof ApiErrorResponse) {
        setError(error);
      } else {
        setError({
          status: 500,
          title: 'Internal Error',
          detail: error?.message,
          type: '',
        });
      }
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    destroyCookie(undefined, 'nextauth.token');
    Router.push('/');
  }

  function clearError() {
    setError(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        signIn,
        signUp,
        logout,
        loading,
        error,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
