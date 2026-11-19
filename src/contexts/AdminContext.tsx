import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

interface AdminContextValue {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue | null>(null);

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error("useAdmin must be used within AdminProvider");
  return ctx;
};

const checkIsAdmin = async (session: Session | null): Promise<boolean> => {
  if (!session) return false;
  const { data, error } = await (supabase.rpc("is_admin" as never) as unknown as Promise<{
    data: boolean | null;
    error: unknown;
  }>);
  return !error && data === true;
};

export const AdminProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const apply = async (session: Session | null) => {
      const ok = await checkIsAdmin(session);
      if (!active) return;
      setIsAuthenticated(ok);
      setLoading(false);
    };
    supabase.auth.getSession().then(({ data }) => apply(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setTimeout(() => apply(session), 0);
    });
    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error || !data.session) return false;
    if (!(await checkIsAdmin(data.session))) {
      await supabase.auth.signOut();
      return false;
    }
    setIsAuthenticated(true);
    return true;
  }, []);

  const logout = useCallback(() => {
    supabase.auth.signOut();
    setIsAuthenticated(false);
  }, []);

  return (
    <AdminContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AdminContext.Provider>
  );
};
