import { BookOpen, Code, Download, ArrowRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const quickLinks = [
  {
    title: "Coding Platforms",
    description: "Practice on HackerRank, LeetCode & more",
    icon: <Code className="h-6 w-6" />,
    path: "/student/coding",
    color: "bg-primary/10 text-primary",
  },
  {
    title: "Download Resources",
    description: "PDFs, spreadsheets & learning materials",
    icon: <Download className="h-6 w-6" />,
    path: "/student/resources",
    color: "bg-accent/10 text-accent",
  },
];

export default function StudentDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back{user?.user_metadata?.full_name ? `, ${user.user_metadata.full_name}` : ""}! 👋
        </h1>
        <p className="mt-1 text-muted-foreground">Ready to continue learning?</p>
      </div>

      {/* Quick links */}
      <div className="grid gap-4 sm:grid-cols-2">
        {quickLinks.map((link) => (
          <Card
            key={link.path}
            className="group cursor-pointer border shadow-card transition-all hover:shadow-card-hover hover:-translate-y-0.5"
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

      {/* Stats placeholder */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: "Resources Available", value: "—", icon: <BookOpen className="h-5 w-5" /> },
          { label: "Platforms", value: "3", icon: <Code className="h-5 w-5" /> },
          { label: "Downloads", value: "—", icon: <Download className="h-5 w-5" /> },
        ].map((stat) => (
          <Card key={stat.label} className="shadow-card">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-secondary-foreground">
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
