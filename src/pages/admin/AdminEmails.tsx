import AdminLayout from "@/components/AdminLayout";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { analyticsService } from "@/services/analyticsService";
import { useQuery } from "@tanstack/react-query";
import { Mail, Send, Loader2, Users, Bell, FileText, Package } from "lucide-react";
import { toast } from "sonner";

const notificationTypes = [
  { id: "new_post", label: "New Blog Post", icon: FileText, description: "Notify all subscribers about the latest blog post" },
  { id: "new_resource", label: "New Resource", icon: Package, description: "Alert subscribers about a new downloadable resource" },
  { id: "custom", label: "Custom Message", icon: Mail, description: "Send a custom notification to all subscribers" },
];

const AdminEmails = () => {
  const [selectedType, setSelectedType] = useState("new_post");
  const [customSubject, setCustomSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [history, setHistory] = useState<{ type: string; message: string; date: string }[]>([]);

  const { data: subStats } = useQuery({
    queryKey: ["admin-sub-stats"],
    queryFn: () => analyticsService.getSubscriberStats(),
  });

  const handleSend = async () => {
    if (selectedType === "custom" && (!customSubject.trim() || !customMessage.trim())) {
      toast.error("Subject and message are required for custom emails");
      return;
    }

    setSending(true);
    try {
      const body: any = { type: selectedType };

      if (selectedType === "custom") {
        body.data = { title: customSubject, message: customMessage };
      } else if (selectedType === "new_post") {
        body.data = { title: "Latest Blog Post", slug: "latest" };
      } else if (selectedType === "new_resource") {
        body.data = { title: "New Resource Available" };
      }

      const { data, error } = await supabase.functions.invoke("send-notification", { body });
      if (error) throw error;

      toast.success(data?.message || "Notification sent!");
      setHistory(prev => [
        { type: selectedType, message: data?.message || "Sent", date: new Date().toISOString() },
        ...prev,
      ]);
      setCustomSubject("");
      setCustomMessage("");
    } catch (err: any) {
      toast.error(err.message || "Failed to send");
    }
    setSending(false);
  };

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Email & Notifications</h1>
        <p className="text-muted-foreground font-body mt-1">Send emails and notifications to your subscribers</p>
      </div>

      {/* Subscriber Count */}
      <div className="bg-card border border-border rounded-xl p-6 shadow-card mb-8 flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
          <Users className="w-6 h-6 text-primary" />
        </div>
        <div>
          <p className="font-display text-2xl font-bold text-foreground">{subStats?.total || 0}</p>
          <p className="text-muted-foreground text-sm font-body">subscribers will receive this notification</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Notification Type */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-card border border-border rounded-xl p-6 shadow-card">
            <h2 className="font-display text-lg font-semibold text-foreground mb-4">Notification Type</h2>
            <div className="grid gap-3">
              {notificationTypes.map((nt) => (
                <button
                  key={nt.id}
                  onClick={() => setSelectedType(nt.id)}
                  className={`flex items-start gap-4 p-4 rounded-lg border text-left transition-colors ${
                    selectedType === nt.id
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/30"
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                    <nt.icon className={`w-5 h-5 ${selectedType === nt.id ? "text-primary" : "text-muted-foreground"}`} />
                  </div>
                  <div>
                    <p className="font-display text-sm font-semibold text-foreground">{nt.label}</p>
                    <p className="text-muted-foreground text-xs font-body mt-0.5">{nt.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Message Form */}
          {selectedType === "custom" && (
            <div className="bg-card border border-border rounded-xl p-6 shadow-card">
              <h2 className="font-display text-lg font-semibold text-foreground mb-4">Compose Message</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-display text-foreground mb-2">Subject</label>
                  <input
                    type="text"
                    value={customSubject}
                    onChange={(e) => setCustomSubject(e.target.value)}
                    placeholder="Email subject line..."
                    maxLength={200}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-sm font-display text-foreground mb-2">Message</label>
                  <textarea
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    placeholder="Write your message..."
                    rows={6}
                    maxLength={2000}
                    className="w-full bg-secondary border border-border rounded-lg px-4 py-3 text-foreground font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-shadow resize-none"
                  />
                  <p className="text-xs text-muted-foreground font-body mt-1">{customMessage.length}/2000 characters</p>
                </div>
              </div>
            </div>
          )}

          {/* Send Button */}
          <button
            onClick={handleSend}
            disabled={sending}
            className="bg-gradient-gold text-primary-foreground font-display font-semibold px-8 py-3 rounded-lg hover:opacity-90 transition-opacity shadow-glow flex items-center gap-2"
          >
            {sending ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
            {sending ? "Sending..." : `Send to ${subStats?.total || 0} Subscribers`}
          </button>
        </div>

        {/* Send History */}
        <div className="bg-card border border-border rounded-xl shadow-card">
          <div className="p-6 border-b border-border">
            <h2 className="font-display text-lg font-semibold text-foreground">Send History</h2>
          </div>
          <div className="divide-y divide-border">
            {history.length > 0 ? (
              history.map((h, i) => (
                <div key={i} className="p-4">
                  <div className="flex items-center gap-2 mb-1">
                    <Bell className="w-3 h-3 text-primary" />
                    <span className="text-xs font-display text-primary capitalize">{h.type.replace("_", " ")}</span>
                  </div>
                  <p className="text-sm text-foreground font-body">{h.message}</p>
                  <p className="text-xs text-muted-foreground font-body mt-1">{new Date(h.date).toLocaleString()}</p>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-muted-foreground font-body text-sm">
                No notifications sent yet this session
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEmails;
