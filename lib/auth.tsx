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
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 days — matches JWT expiry

function setTokenCookie(token: string) {
  document.cookie = `token=${token}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
}

function clearTokenCookie() {
  document.cookie = "token=; path=/; max-age=0; samesite=lax";
}

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
        clearTokenCookie();
        setUser(null);
        router.replace("/login");
      } else {
        const decoded = decodeJwt(token);
        setUser(decoded);
        setTokenCookie(token); // Keep cookie in sync
      }
    } else {
      clearTokenCookie(); // No token in localStorage → clear stale cookie
    }
    setIsLoading(false);
  }, [router]);

  const login = useCallback((token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setTokenCookie(token);
    const decoded = decodeJwt(token);
    setUser(decoded);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    clearTokenCookie();
    setUser(null);
    router.push("/");
  }, [router]);

  // setToken is for re-issuing after profile update (per D-14)
  const setToken = useCallback((token: string) => {
    localStorage.setItem(TOKEN_KEY, token);
    setTokenCookie(token);
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
