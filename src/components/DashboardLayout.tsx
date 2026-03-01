import { ReactNode } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import {
  BookOpen, GraduationCap, LogOut, Home, Upload, FolderOpen, Code, Download, Menu
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface NavItem {
  label: string;
  icon: ReactNode;
  path: string;
}

const studentNav: NavItem[] = [
  { label: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/student" },
  { label: "Coding Platforms", icon: <Code className="h-5 w-5" />, path: "/student/coding" },
  { label: "Resources", icon: <Download className="h-5 w-5" />, path: "/student/resources" },
];

const teacherNav: NavItem[] = [
  { label: "Dashboard", icon: <Home className="h-5 w-5" />, path: "/teacher" },
  { label: "Upload", icon: <Upload className="h-5 w-5" />, path: "/teacher/upload" },
  { label: "My Resources", icon: <FolderOpen className="h-5 w-5" />, path: "/teacher/resources" },
];

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const { role, user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = role === "teacher" ? teacherNav : studentNav;
  const isActive = (path: string) => location.pathname === path;

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-foreground/20 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 lg:static lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl gradient-primary">
            {role === "teacher" ? (
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            ) : (
              <BookOpen className="h-5 w-5 text-primary-foreground" />
            )}
          </div>
          <div>
            <h2 className="text-sm font-bold text-sidebar-foreground">EduPlatform</h2>
            <p className="text-xs capitalize text-muted-foreground">{role} Portal</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 space-y-1 p-4">
          {navItems.map((item) => (
            <button
              key={item.path}
              onClick={() => {
                navigate(item.path);
                setSidebarOpen(false);
              }}
              className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all ${
                isActive(item.path)
                  ? "bg-primary/10 text-primary"
                  : "text-sidebar-foreground hover:bg-sidebar-accent"
              }`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        {/* User section */}
        <div className="border-t border-sidebar-border p-4">
          <div className="mb-3 truncate text-xs text-muted-foreground">{user?.email}</div>
          <Button variant="ghost" size="sm" className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive" onClick={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-16 items-center gap-4 border-b border-border bg-card px-4 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <div className="flex-1" />
        </header>

        <main className="flex-1 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
