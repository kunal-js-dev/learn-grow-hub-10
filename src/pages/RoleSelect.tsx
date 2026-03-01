import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { BookOpen, GraduationCap } from "lucide-react";

export default function RoleSelect() {
  const { role, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && role) {
      navigate(role === "teacher" ? "/teacher" : "/student", { replace: true });
    }
  }, [role, loading, navigate]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  // If they already have a role, the useEffect redirects.
  // This page is a fallback – shouldn't normally show.
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <div className="text-center animate-fade-in">
        <h1 className="text-2xl font-bold text-foreground mb-2">Redirecting...</h1>
        <p className="text-muted-foreground">Taking you to your dashboard</p>
      </div>
    </div>
  );
}
