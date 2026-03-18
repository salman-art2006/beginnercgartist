import { useState } from "react";
import { motion } from "framer-motion";
import { Download, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useSubscriber } from "@/contexts/SubscriberContext";
import { subscribeSchema } from "@/services/subscriberService";
import { toast } from "sonner";

const SubscribeForm = () => {
  const { isSubscribed, subscriber, subscribe, isLoading, error } = useSubscriber();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = subscribeSchema.safeParse({ name, email });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }
    const ok = await subscribe(parsed.data.name, parsed.data.email);
    if (ok) {
      toast.success("Welcome! You now have access to all project files.");
    }
  };

  if (isSubscribed && subscriber) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-card border border-primary/30 rounded-2xl p-8 text-center shadow-card animate-glow-pulse"
      >
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h3 className="font-display text-2xl font-bold text-foreground mb-2">You're In!</h3>
        <p className="text-muted-foreground font-body mb-2">
          Welcome, {subscriber.name}! All project downloads are now unlocked.
        </p>
        <p className="text-muted-foreground/60 font-body text-sm">
          Head to the <a href="/portfolio" className="text-primary hover:underline">Portfolio</a> to download files.
        </p>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-card border border-border rounded-2xl p-8 shadow-card"
    >
      <div className="space-y-4 mb-6">
        <div>
          <label htmlFor="sub-name" className="block text-sm font-display text-foreground mb-2">
            Name
          </label>
          <input
            id="sub-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            maxLength={100}
            disabled={isLoading}
          />
        </div>
        <div>
          <label htmlFor="sub-email" className="block text-sm font-display text-foreground mb-2">
            Email
          </label>
          <input
            id="sub-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
            maxLength={255}
            disabled={isLoading}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm font-body mb-4">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-gradient-gold text-primary-foreground font-display font-semibold py-4 rounded-lg hover:opacity-90 transition-opacity shadow-glow flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            <Download className="w-5 h-5" />
            Access Project Files
          </>
        )}
      </button>

      <p className="text-muted-foreground/50 text-xs font-body text-center mt-4">
        No spam. Unsubscribe anytime. Your data stays safe.
      </p>
    </form>
  );
};

export default SubscribeForm;
