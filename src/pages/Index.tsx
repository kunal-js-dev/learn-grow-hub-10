import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { GraduationCap, BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Index() {
  const { user, role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && user && role) {
      navigate(role === "teacher" ? "/teacher" : "/student", { replace: true });
    }
  }, [user, role, loading, navigate]);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Hero */}
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl gradient-hero shadow-elevated">
          <GraduationCap className="h-10 w-10 text-primary-foreground" />
        </div>
        <h1 className="mb-3 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
          EduPlatform
        </h1>
        <p className="mb-8 max-w-md text-lg text-muted-foreground">
          Learn, code, and grow together. Access coding platforms, download resources, and manage educational content.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button size="lg" className="gradient-primary text-primary-foreground" onClick={() => navigate("/auth")}>
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {/* Feature cards */}
        <div className="mt-16 grid max-w-2xl gap-6 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-left">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <h3 className="font-semibold text-card-foreground">For Students</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Access top coding platforms, download learning materials, and improve your skills.
            </p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-6 shadow-card text-left">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10">
              <GraduationCap className="h-5 w-5 text-accent" />
            </div>
            <h3 className="font-semibold text-card-foreground">For Teachers</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Upload and manage educational resources. Share files easily with your students.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
