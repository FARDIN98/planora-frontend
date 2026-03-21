"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string) => void;
  logout: () => void;
  setToken: (token: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = "token";

function decodeJwt(token: string): User | null {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));
    return {
      id: decoded.id,
      name: decoded.name,
      email: decoded.email,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}

function isTokenExpired(token: string): boolean {
  try {
    const payload = token.split(".")[1];
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = JSON.parse(atob(base64));
    return decoded.exp * 1000 < Date.now();
  } catch {
    return true;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Initialize from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      if (isTokenExpired(token)) {
        // Per D-04: silently redirect to /login on expiry
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
        router.replace("/login");
      } else {
        const decoded = decodeJwt(token);
        setUser(decoded);
      }
    }
    setIsLoading(false);
  }, [router]);

  const login = useCallback((token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    const decoded = decodeJwt(token);
    setUser(decoded);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    setUser(null);
    router.push("/");
  }, [router]);

  // setToken is for re-issuing after profile update (per D-14)
  const setToken = useCallback((token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    const decoded = decodeJwt(token);
    setUser(decoded);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
