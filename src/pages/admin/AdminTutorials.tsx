import AdminLayout from "@/components/AdminLayout";
import { tutorialService } from "@/services/tutorialService";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, Clock, BarChart3 } from "lucide-react";

const difficultyColor: Record<string, string> = {
  Beginner: "bg-green-500/10 text-green-400",
  Intermediate: "bg-primary/10 text-primary",
  Advanced: "bg-red-500/10 text-red-400",
};

const AdminTutorials = () => {
  const { data: tutorials } = useQuery({
    queryKey: ["admin-tutorials"],
    queryFn: () => tutorialService.list(),
  });

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-bold text-foreground">Tutorials</h1>
        <p className="text-muted-foreground font-body mt-1">Manage tutorial content</p>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-card overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left px-6 py-4 text-xs font-display text-muted-foreground uppercase tracking-wider">Tutorial</th>
              <th className="text-left px-6 py-4 text-xs font-display text-muted-foreground uppercase tracking-wider hidden md:table-cell">Category</th>
              <th className="text-left px-6 py-4 text-xs font-display text-muted-foreground uppercase tracking-wider hidden md:table-cell">Difficulty</th>
              <th className="text-left px-6 py-4 text-xs font-display text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {(tutorials || []).map((tut) => (
              <tr key={tut.id} className="hover:bg-secondary/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center flex-shrink-0">
                      <BookOpen className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-display text-sm font-medium text-foreground">{tut.title}</p>
                      <p className="text-muted-foreground text-xs font-body truncate max-w-[250px]">{tut.description}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className="text-xs bg-secondary text-secondary-foreground px-2.5 py-1 rounded-full border border-border font-body">{tut.category}</span>
                </td>
                <td className="px-6 py-4 hidden md:table-cell">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-body ${difficultyColor[tut.difficulty] || "bg-secondary text-muted-foreground"}`}>
                    {tut.difficulty}
                  </span>
                </td>
                <td className="px-6 py-4 hidden lg:table-cell">
                  <span className="text-sm text-muted-foreground font-body flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {tut.durationMinutes} min
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!tutorials || tutorials.length === 0) && (
          <div className="p-12 text-center text-muted-foreground font-body">No tutorials yet.</div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminTutorials;
