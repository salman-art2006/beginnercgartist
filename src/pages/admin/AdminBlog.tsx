import AdminLayout from "@/components/AdminLayout";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { blogService } from "@/services/blogService";
import { FileText, Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

const AdminBlog = () => {
  const queryClient = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin-blog-all"], queryFn: () => blogService.list({ perPage: 100 }) });
  const [generating, setGenerating] = useState(false);

  const handleGenerate = async () => {
    setGenerating(true);
    toast.info("Generating blog post with AI...");
    const result = await blogService.triggerAutoGenerate();
    setGenerating(false);
    if (result.success) {
      toast.success(`New post created: "${result.post?.title}"`);
      queryClient.invalidateQueries({ queryKey: ["admin-blog-all"] });
      queryClient.invalidateQueries({ queryKey: ["blog-posts"] });
    } else {
      toast.error(result.error || "Generation failed");
    }
  };

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Blog Posts</h1>
          <p className="text-muted-foreground font-body mt-1">Manage blog content and automation</p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-primary/10 text-primary font-display font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/20 transition-colors flex items-center gap-2 text-sm border border-primary/20"
        >
          {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          {generating ? "Generating..." : "Generate Post"}
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-xs font-display text-muted-foreground uppercase tracking-wider">Post</th>
              <th className="text-left px-6 py-4 text-xs font-display text-muted-foreground uppercase tracking-wider hidden md:table-cell">Category</th>
              <th className="text-left px-6 py-4 text-xs font-display text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
              <th className="text-left px-6 py-4 text-xs font-display text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Read Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(data?.posts || []).map((post) => (
              <tr key={post.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <FileText className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-display text-sm font-medium text-foreground">{post.title}</p>
                      <p className="text-muted-foreground text-xs font-body truncate max-w-[250px]">{post.excerpt}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full border border-border font-body">{post.category}</span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-sm text-muted-foreground font-body">{new Date(post.publishedAt).toLocaleDateString()}</span>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <span className="text-sm text-muted-foreground font-body">{post.readTimeMinutes} min</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminBlog;
