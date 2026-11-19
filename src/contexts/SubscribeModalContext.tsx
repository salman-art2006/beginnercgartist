import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { Gift, X } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import SubscribeForm from "@/components/SubscribeForm";
import { useSubscriber } from "@/contexts/SubscriberContext";

interface Ctx {
  open: () => void;
}

const SubscribeModalContext = createContext<Ctx>({ open: () => undefined });

// eslint-disable-next-line react-refresh/only-export-components
export const useSubscribeModal = () => useContext(SubscribeModalContext);

const PROMPT_KEY = "bcg_join_prompt_dismissed";
const PROMPT_DELAY_MS = 20000;
const PROMPT_COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000;

const safeGet = (k: string) => {
  try { return localStorage.getItem(k); } catch { return null; }
};
const safeSet = (k: string, v: string) => {
  try { localStorage.setItem(k, v); } catch { /* storage blocked */ }
};

export const SubscribeModalProvider = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { isSubscribed } = useSubscriber();
  const [isOpen, setOpen] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  const open = useCallback(() => {
    setShowPrompt(false);
    setOpen(true);
  }, []);

  // Any link to #unlock or #join (from any page, including blog posts) opens the popup.
  useEffect(() => {
    if (location.hash === "#unlock" || location.hash === "#join") {
      open();
      window.history.replaceState(null, "", location.pathname + location.search);
    }
  }, [location.hash, location.pathname, location.search, open]);

  // A gentle, dismissible nudge after 20 seconds, at most once a week, never on admin pages.
  useEffect(() => {
    if (isSubscribed || location.pathname.startsWith("/admin")) return;
    const last = Number(safeGet(PROMPT_KEY) || 0);
    if (Date.now() - last < PROMPT_COOLDOWN_MS) return;
    const t = window.setTimeout(() => setShowPrompt(true), PROMPT_DELAY_MS);
    return () => window.clearTimeout(t);
  }, [isSubscribed, location.pathname]);

  const dismissPrompt = () => {
    setShowPrompt(false);
    safeSet(PROMPT_KEY, String(Date.now()));
  };

  const value = useMemo(() => ({ open }), [open]);

  return (
    <SubscribeModalContext.Provider value={value}>
      {children}

      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg gap-0 border-border bg-background p-0 sm:rounded-2xl">
          <div className="border-b border-border px-8 pb-6 pt-8">
            <span className="chip-brand mb-4">Free</span>
            <DialogTitle className="font-anton text-4xl font-normal uppercase leading-none tracking-[0.01em] text-foreground">
              Join the list
            </DialogTitle>
            <DialogDescription className="mt-3 text-base leading-relaxed text-muted-foreground font-body">
              Get the free Blender project files, plus a note when a new tutorial or file is out.
            </DialogDescription>
            <ul className="mt-5 space-y-2 text-sm font-semibold text-foreground font-body">
              {["Free project files unlock instantly", "A heads-up when new tutorials and kits are out", "No spam. Unsubscribe any time"].map((t) => (
                <li key={t} className="flex items-center gap-3"><span className="h-2 w-2 shrink-0 bg-brand" aria-hidden="true" />{t}</li>
              ))}
            </ul>
          </div>
          <div className="p-6">
            <SubscribeForm />
          </div>
        </DialogContent>
      </Dialog>

      {showPrompt && !isOpen && (
        <div role="dialog" aria-label="Join the list" className="fixed bottom-4 right-4 z-40 w-[min(92vw,22rem)] rounded-xl border border-border bg-card p-5 shadow-card">
          <button type="button" onClick={dismissPrompt} aria-label="Dismiss" className="absolute right-3 top-3 rounded-md p-1 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-brand text-brand-foreground"><Gift className="h-5 w-5" /></div>
          <p className="text-lg font-bold leading-tight text-foreground">Get the free Blender project files</p>
          <p className="mt-1.5 text-sm text-muted-foreground font-body">Join the list, it takes ten seconds.</p>
          <button type="button" onClick={() => { safeSet(PROMPT_KEY, String(Date.now())); open(); }} className="mt-4 w-full rounded-md bg-brand py-3 text-sm font-bold text-brand-foreground hover:opacity-90">
            Join the list
          </button>
        </div>
      )}
    </SubscribeModalContext.Provider>
  );
};
