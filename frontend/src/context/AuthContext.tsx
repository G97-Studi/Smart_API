import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { apiRequest } from "../api/client";

interface AuthUser {
  user_id: number;
  full_name: string;
  email: string;
}

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = "smartrepair_token";

// --- Token storage trade-offs (for the viva / documentation) ---
// 1. localStorage: persists across tabs & browser restarts, but is
//    readable by ANY JavaScript on the page — if the app has an XSS bug,
//    the token is stolen. Assignment explicitly says to avoid this for
//    sensitive tokens when possible.
// 2. sessionStorage (used here): same XSS exposure as localStorage, but
//    scoped to one tab and cleared when the tab closes — smaller window
//    of risk, still not immune to XSS.
// 3. httpOnly cookie (most secure, not used here): JavaScript can't read
//    it at all, so XSS can't steal it directly. Requires the backend to
//    set/read the cookie and adds CSRF protection work. Skipped for this
//    project to keep the JWT flow explicit and easy to demo/explain, but
//    it's the right answer if asked "what would you do in production?"
function readStoredToken(): string | null {
  return sessionStorage.getItem(STORAGE_KEY);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readStoredToken());
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiRequest<{ token: string; user: AuthUser }>("/auth/login", {
      method: "POST",
      body: { email, password }
    });
    sessionStorage.setItem(STORAGE_KEY, data.token);
    setToken(data.token);
    setUser(data.user);
  }, []);

  const logout = useCallback(() => {
    // JWTs can't be invalidated server-side without extra infrastructure
    // (see authController.ts logout comment) — logging out just means
    // discarding the token client-side so it's no longer sent.
    sessionStorage.removeItem(STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const value: AuthContextValue = {
    token,
    user,
    isAuthenticated: !!token,
    login,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
