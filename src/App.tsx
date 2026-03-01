import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import DashboardLayout from "@/components/DashboardLayout";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import RoleSelect from "./pages/RoleSelect";
import StudentDashboard from "./pages/student/StudentDashboard";
import CodingPlatforms from "./pages/student/CodingPlatforms";
import StudentResources from "./pages/student/StudentResources";
import TeacherDashboard from "./pages/teacher/TeacherDashboard";
import TeacherUpload from "./pages/teacher/TeacherUpload";
import TeacherResources from "./pages/teacher/TeacherResources";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/role-select" element={<RoleSelect />} />

            {/* Student routes */}
            <Route path="/student" element={<ProtectedRoute requiredRole="student"><DashboardLayout><StudentDashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/coding" element={<ProtectedRoute requiredRole="student"><DashboardLayout><CodingPlatforms /></DashboardLayout></ProtectedRoute>} />
            <Route path="/student/resources" element={<ProtectedRoute requiredRole="student"><DashboardLayout><StudentResources /></DashboardLayout></ProtectedRoute>} />

            {/* Teacher routes */}
            <Route path="/teacher" element={<ProtectedRoute requiredRole="teacher"><DashboardLayout><TeacherDashboard /></DashboardLayout></ProtectedRoute>} />
            <Route path="/teacher/upload" element={<ProtectedRoute requiredRole="teacher"><DashboardLayout><TeacherUpload /></DashboardLayout></ProtectedRoute>} />
            <Route path="/teacher/resources" element={<ProtectedRoute requiredRole="teacher"><DashboardLayout><TeacherResources /></DashboardLayout></ProtectedRoute>} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
