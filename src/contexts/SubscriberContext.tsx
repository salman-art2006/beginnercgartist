import { createContext, useContext, useState, useCallback, ReactNode } from "react";
import { subscriberService, type SubscriberData } from "@/services/subscriberService";

interface SubscriberState {
  isSubscribed: boolean;
  subscriber: SubscriberData | null;
  isLoading: boolean;
  error: string | null;
}

interface SubscriberContextValue extends SubscriberState {
  subscribe: (name: string, email: string) => Promise<boolean>;
  requestDownload: (fileId: string) => Promise<string | null>;
  logout: () => void;
}

const SubscriberContext = createContext<SubscriberContextValue | null>(null);

export const useSubscriber = () => {
  const ctx = useContext(SubscriberContext);
  if (!ctx) throw new Error("useSubscriber must be used within SubscriberProvider");
  return ctx;
};

export const SubscriberProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<SubscriberState>(() => {
    const stored = localStorage.getItem("env_art_subscriber");
    if (stored) {
      try {
        const data = JSON.parse(stored) as SubscriberData;
        return { isSubscribed: true, subscriber: data, isLoading: false, error: null };
      } catch {
        // ignore
      }
    }
    return { isSubscribed: false, subscriber: null, isLoading: false, error: null };
  });

  const subscribe = useCallback(async (name: string, email: string): Promise<boolean> => {
    setState((s) => ({ ...s, isLoading: true, error: null }));
    try {
      const result = await subscriberService.subscribe({ name, email });
      if (result.success && result.data) {
        localStorage.setItem("env_art_subscriber", JSON.stringify(result.data));
        setState({ isSubscribed: true, subscriber: result.data, isLoading: false, error: null });
        return true;
      }
      setState((s) => ({ ...s, isLoading: false, error: result.error || "Subscription failed" }));
      return false;
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      setState((s) => ({ ...s, isLoading: false, error: msg }));
      return false;
    }
  }, []);

  const requestDownload = useCallback(
    async (fileId: string): Promise<string | null> => {
      if (!state.subscriber) return null;
      try {
        const result = await subscriberService.requestDownload(fileId, state.subscriber.token);
        return result.url || null;
      } catch {
        return null;
      }
    },
    [state.subscriber]
  );

  const logout = useCallback(() => {
    localStorage.removeItem("env_art_subscriber");
    setState({ isSubscribed: false, subscriber: null, isLoading: false, error: null });
  }, []);

  return (
    <SubscriberContext.Provider value={{ ...state, subscribe, requestDownload, logout }}>
      {children}
    </SubscriberContext.Provider>
  );
};
