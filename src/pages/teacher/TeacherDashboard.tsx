import { Upload, FolderOpen, FileText, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export default function TeacherDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [resourceCount, setResourceCount] = useState(0);

  useEffect(() => {
    if (user) {
      supabase
        .from("resources")
        .select("id", { count: "exact", head: true })
        .eq("teacher_id", user.id)
        .then(({ count }) => setResourceCount(count ?? 0));
    }
  }, [user]);

  const quickLinks = [
    {
      title: "Upload Resources",
      description: "Share PDFs, docs, images & more with students",
      icon: <Upload className="h-6 w-6" />,
      path: "/teacher/upload",
      color: "bg-primary/10 text-primary",
    },
    {
      title: "Manage Resources",
      description: `${resourceCount} file${resourceCount !== 1 ? "s" : ""} uploaded`,
      icon: <FolderOpen className="h-6 w-6" />,
      path: "/teacher/resources",
      color: "bg-accent/10 text-accent",
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}! 📚
        </h1>
        <p className="mt-1 text-muted-foreground">Manage your educational resources</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map((link) => (
          <Card
            key={link.path}
            className="group cursor-pointer shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5"
            onClick={() => navigate(link.path)}
          >
            <CardContent className="flex items-center gap-4 p-6">
              <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${link.color}`}>
                {link.icon}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-card-foreground">{link.title}</h3>
                <p className="text-sm text-muted-foreground">{link.description}</p>
              </div>
              <ArrowRight className="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1" />
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="shadow-card">
          <CardContent className="flex items-center gap-4 p-5">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">{resourceCount}</p>
              <p className="text-xs text-muted-foreground">Total Resources</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
