import AdminLayout from "@/components/AdminLayout";
import { Package, Database, Mail, Webhook } from "lucide-react";

const integrations = [
  { icon: Database, title: "Database Storage", desc: "Connect Lovable Cloud to store subscriber data and manage resources in a real database.", status: "Ready to connect" },
  { icon: Mail, title: "Email Service (Resend)", desc: "Send welcome emails and deliver download links securely via Resend or similar providers.", status: "Ready to connect" },
  { icon: Webhook, title: "Webhook / Automation", desc: "Trigger workflows on new subscriptions — Zapier, Make, n8n, or custom webhooks.", status: "Ready to connect" },
  { icon: Package, title: "File Storage", desc: "Upload and serve protected project files via cloud storage with signed URLs.", status: "Ready to connect" },
];

const AdminResources = () => (
  <AdminLayout>
    <div className="mb-8">
      <h1 className="font-display text-3xl font-bold text-foreground">Resources & Integrations</h1>
      <p className="text-muted-foreground font-body mt-1">Connect services to manage subscribers and protected downloads</p>
    </div>

    <div className="grid md:grid-cols-2 gap-6 mb-10">
      {integrations.map((item) => (
        <div key={item.title} className="bg-card border border-border rounded-xl p-6 shadow-card">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <h3 className="font-display text-base font-semibold text-foreground mb-1">{item.title}</h3>
              <p className="text-muted-foreground text-sm font-body mb-3">{item.desc}</p>
              <span className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-body">{item.status}</span>
            </div>
          </div>
        </div>
      ))}
    </div>

    <div className="bg-card border border-border rounded-xl p-6 shadow-card">
      <h3 className="font-display text-lg font-semibold text-foreground mb-2">Subscriber Data</h3>
      <p className="text-muted-foreground text-sm font-body mb-4">
        Currently stored in browser localStorage. Connect a backend to persist subscriber data, track downloads, and manage access.
      </p>
      <div className="bg-secondary border border-border rounded-lg p-4">
        <p className="text-xs text-muted-foreground font-body font-mono">subscriberService.ts → Replace with API calls to your backend</p>
      </div>
    </div>
  </AdminLayout>
);

export default AdminResources;
