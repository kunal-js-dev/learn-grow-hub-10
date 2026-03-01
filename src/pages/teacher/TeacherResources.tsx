import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Trash2, Pencil, Check, X, FileText, FileSpreadsheet, File, Image, Archive, Loader2, Search,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Resource {
  id: string;
  title: string;
  description: string | null;
  file_name: string;
  file_type: string;
  file_size: number;
  storage_path: string;
  created_at: string;
}

function getFileIcon(type: string) {
  if (type.includes("pdf")) return <FileText className="h-5 w-5 text-destructive" />;
  if (type.includes("word")) return <FileText className="h-5 w-5 text-primary" />;
  if (type.includes("presentation")) return <FileText className="h-5 w-5 text-warning" />;
  if (type.includes("image")) return <Image className="h-5 w-5 text-accent" />;
  if (type.includes("zip")) return <Archive className="h-5 w-5 text-muted-foreground" />;
  return <File className="h-5 w-5 text-muted-foreground" />;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

export default function TeacherResources() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  useEffect(() => {
    if (user) fetchResources();
  }, [user]);

  const fetchResources = async () => {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .eq("teacher_id", user!.id)
      .order("created_at", { ascending: false });
    if (error) toast.error("Failed to load resources");
    else setResources(data || []);
    setLoading(false);
  };

  const handleDelete = async (resource: Resource) => {
    const { error: storageErr } = await supabase.storage
      .from("resources")
      .remove([resource.storage_path]);
    if (storageErr) {
      toast.error("Failed to delete file");
      return;
    }
    const { error: dbErr } = await supabase.from("resources").delete().eq("id", resource.id);
    if (dbErr) {
      toast.error("Failed to delete record");
      return;
    }
    setResources((prev) => prev.filter((r) => r.id !== resource.id));
    toast.success("Resource deleted");
  };

  const handleRename = async (id: string) => {
    if (!editTitle.trim()) return;
    const { error } = await supabase
      .from("resources")
      .update({ title: editTitle.trim() })
      .eq("id", id);
    if (error) {
      toast.error("Rename failed");
      return;
    }
    setResources((prev) => prev.map((r) => (r.id === id ? { ...r, title: editTitle.trim() } : r)));
    setEditingId(null);
    toast.success("Renamed successfully");
  };

  const filtered = resources.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.file_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">My Resources</h1>
        <p className="mt-1 text-muted-foreground">Manage your uploaded files</p>
      </div>

      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search files..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="font-semibold text-foreground">No resources uploaded</h3>
            <p className="text-sm text-muted-foreground">Start uploading files for your students</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((resource) => (
            <Card key={resource.id} className="shadow-card">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  {getFileIcon(resource.file_type)}
                </div>
                <div className="min-w-0 flex-1">
                  {editingId === resource.id ? (
                    <div className="flex items-center gap-2">
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="h-8 text-sm"
                        autoFocus
                        onKeyDown={(e) => e.key === "Enter" && handleRename(resource.id)}
                      />
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-success" onClick={() => handleRename(resource.id)}>
                        <Check className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => setEditingId(null)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <h3 className="truncate font-medium text-card-foreground">{resource.title}</h3>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{resource.file_name}</span>
                        <span>·</span>
                        <span>{formatSize(resource.file_size)}</span>
                      </div>
                    </>
                  )}
                </div>
                {editingId !== resource.id && (
                  <div className="flex items-center gap-1">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-8 w-8"
                      onClick={() => {
                        setEditingId(resource.id);
                        setEditTitle(resource.title);
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:bg-destructive/10">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Resource</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete "{resource.title}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(resource)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
