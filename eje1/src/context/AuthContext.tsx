'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode
} from 'react';

interface User {
  id_cliente: number;
  correo: string;
  telefono?: string;
}

type Role = 'admin' | 'cliente' | null;

interface AuthContextType {
  cliente: User | null;
  role: Role;
  loading: boolean;
  login: (correo: string, contrasena: string) => Promise<string | null>;
  registro: (correo: string, contrasena: string, telefono: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [cliente, setCliente] = useState<User | null>(null);
  const [role, setRole] = useState<Role>(null);
  const [loading, setLoading] = useState(true);

  // =========================
  // INIT SESSION
  // =========================
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch('/api/auth/me');
        const data = await res.json();

        if (res.ok && data?.user) {
          setRole(data.role ?? null);
          setCliente(data.user);
        } else {
          setRole(null);
          setCliente(null);
        }
      } catch {
        setRole(null);
        setCliente(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  // =========================
  // LOGIN
  // =========================
  const login = async (correo: string, contrasena: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena }),
    });

    const data = await res.json();

    if (!res.ok) return data.error;

    setRole(data.role ?? null);
    setCliente(data.user ?? null);

    return null;
  };

  // =========================
  // REGISTRO
  // =========================
  const registro = async (correo: string, contrasena: string, telefono: string) => {
    const res = await fetch('/api/auth/registro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ correo, contrasena, telefono }),
    });

    const data = await res.json();

    if (!res.ok) return data.error;

    setRole('cliente');
    setCliente(data.user ?? null);

    return null;
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setCliente(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ cliente, role, loading, login, registro, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}