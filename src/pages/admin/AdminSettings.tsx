import AdminLayout from "@/components/AdminLayout";
import { Shield, Globe, Key, Server, Lock, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

const AdminSettings = () => {
  const [showProtection, setShowProtection] = useState(true);

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Settings</h1>
        <p className="text-muted-foreground font-body mt-1">Site configuration and security settings</p>
      </div>

      <div className="grid gap-6 max-w-3xl">
        {/* Security */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Security</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-display text-sm font-medium text-foreground">Admin Authentication</p>
                <p className="text-xs text-muted-foreground font-body">Server-side password validation via edge function</p>
              </div>
              <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-body">Active</span>
            </div>
            <div className="flex items-center justify-between py-3 border-b border-border">
              <div>
                <p className="font-display text-sm font-medium text-foreground">Row Level Security</p>
                <p className="text-xs text-muted-foreground font-body">All database tables have RLS policies enabled</p>
              </div>
              <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-body">Enabled</span>
            </div>
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-display text-sm font-medium text-foreground">3D Model Protection</p>
                <p className="text-xs text-muted-foreground font-body">Right-click disabled, context menu blocked, watermark overlay</p>
              </div>
              <span className="text-xs bg-green-500/10 text-green-400 px-3 py-1 rounded-full font-body">Active</span>
            </div>
          </div>
        </div>

        {/* Content Protection */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <Lock className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Content Protection</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-body text-foreground">Disable right-click on images & 3D viewer</span>
              <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-body">✓</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-body text-foreground">Block drag & drop on images</span>
              <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-body">✓</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-body text-foreground">Watermark overlay on portfolio images</span>
              <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-body">✓</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-body text-foreground">Protected download files (subscriber-only)</span>
              <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-body">✓</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm font-body text-foreground">WebGL context protection (3D scenes)</span>
              <span className="text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-body">✓</span>
            </div>
          </div>
        </div>

        {/* Site Info */}
        <div className="bg-card border border-border rounded-xl p-6 shadow-card">
          <div className="flex items-center gap-3 mb-4">
            <Globe className="w-5 h-5 text-primary" />
            <h2 className="font-display text-lg font-semibold text-foreground">Site Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground font-body mb-1">Site Name</p>
              <p className="font-display text-sm font-medium text-foreground">ENV.ART — 3D Environment Artist</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-body mb-1">Stack</p>
              <p className="font-body text-sm text-foreground">React + Vite + TypeScript + Tailwind CSS + Lovable Cloud</p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-body mb-1">Edge Functions</p>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {["admin-login", "admin-analytics", "auto-generate-blog", "auto-generate-portfolio", "generate-blog-image", "subscribe", "send-notification"].map(fn => (
                  <span key={fn} className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded border border-border font-body">{fn}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminSettings;
