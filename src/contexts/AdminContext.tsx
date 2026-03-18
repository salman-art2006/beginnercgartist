import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

interface AdminState {
  isAuthenticated: boolean;
}

interface AdminContextValue extends AdminState {
  login: (password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};

const ADMIN_SESSION_KEY = "env_art_admin_token";

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = sessionStorage.getItem(ADMIN_SESSION_KEY);
    return !!token && token.startsWith("adm_");
  });

  const login = useCallback(async (password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase.functions.invoke("admin-login", {
        body: { password },
      });
      if (error || !data?.success) return false;
      sessionStorage.setItem(ADMIN_SESSION_KEY, data.token);
      setIsAuthenticated(true);
      return true;
    } catch {
      return false;
    }
  }, []);

  const logout = useCallback(() => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
  }, []);

  return (
    <AdminContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
