import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface AuthState {
  isAuthenticated: boolean;
  loading: boolean;
  user: User | null;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
}

interface User {
  email: string;
  name: string;
  role: 'admin' | 'client' | 'media_contributor' | 'visitor';
}

interface AuthContextType {
  authState: AuthState;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    loading: true,
    user: null,
  });

  axios.defaults.withCredentials = true;

  const getXsrfToken = () => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; XSRF-TOKEN=`);
    if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';')[0]);
    return '';
  };

  const checkAuth = async () => {
    const token = localStorage.getItem("jwt_token");

    if (!token) {
      setAuthState({ isAuthenticated: false, loading: false, user: null });
      return;
    }

    try {
      setAuthState(prev => ({ ...prev, loading: true }));

      // Attacher le token
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await axios.get("http://localhost:8000/admin/check-auth", {
        withCredentials: true,
        validateStatus: (status) => status < 500,
      });

      if (response.status === 200 && response.data.authenticated && response.data.user) {
        setAuthState({
          isAuthenticated: true,
          loading: false,
          user: response.data.user,
        });
        localStorage.setItem("user", JSON.stringify(response.data.user));
      } else {
        logout(); // token invalide → déconnexion
      }
    } catch (error) {
      logout();
    }
  };


  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie');
      const xsrfToken = getXsrfToken();

      const res = await axios.post(
        'http://localhost:8000/login',
        { email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken,
          },
          withCredentials: true,
        }
      );

      if (res.status === 200) {
        const token = res.data.token;
        const userData: User = res.data.user;

        localStorage.setItem("jwt_token", token);
        localStorage.setItem("user", JSON.stringify(userData));

        setAuthState({
          isAuthenticated: true,
          loading: false,
          user: userData,
        });
      } else {
        throw new Error('Identifiants invalides');
      }
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, loading: false }));
      throw new Error(error.response?.data?.message || "Erreur de connexion.");
    }
  };

  const register = async ({ name, email, password }: RegisterData) => {
    setAuthState((prev) => ({ ...prev, loading: true }));

    try {
      await axios.get('http://localhost:8000/sanctum/csrf-cookie');
      const xsrfToken = getXsrfToken();

      const res = await axios.post(
        'http://localhost:8000/register',
        { name, email, password },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-XSRF-TOKEN': xsrfToken,
          },
          withCredentials: true,
        }
      );

      if (res.status === 201 || res.status === 200) {
        const userData: User = res.data.user;
        setAuthState({ isAuthenticated: true, loading: false, user: userData });
      } else {
        throw new Error("L'inscription a échoué.");
      }
    } catch (error: any) {
      setAuthState((prev) => ({ ...prev, loading: false }));
      throw new Error(error.response?.data?.message || "Erreur lors de l'inscription.");
    }
  };

  const logout = async () => {
    try {
      await axios.post('http://localhost:8000/logout');
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    } finally {
      setAuthState({ isAuthenticated: false, loading: false, user: null });
      localStorage.removeItem("jwt_token");
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ authState, login, register, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
