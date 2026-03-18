import { useState } from "react";
import { useAdmin } from "@/contexts/AdminContext";
import { Navigate } from "react-router-dom";
import { Lock, Loader2 } from "lucide-react";
import { motion } from "framer-motion";

const AdminLogin = () => {
  const { isAuthenticated, login } = useAdmin();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim()) { setError("Password is required"); return; }
    setLoading(true);
    setError("");
    const ok = await login(password);
    if (!ok) setError("Invalid password");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-secondary border border-border flex items-center justify-center mx-auto mb-4">
            <Lock className="w-7 h-7 text-primary" />
          </div>
          <h1 className="font-display text-2xl font-bold text-foreground">Admin Access</h1>
          <p className="text-muted-foreground text-sm font-body mt-2">Enter the admin password to continue</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-card border border-border rounded-xl p-6 shadow-card">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow mb-4"
          />
          {error && <p className="text-destructive text-sm font-body mb-4">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-gold text-primary-foreground font-display font-semibold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Sign In"}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default AdminLogin;
