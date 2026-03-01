import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Search, FileText, FileSpreadsheet, File, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
  if (type.includes("pdf")) return <FileText className="h-6 w-6 text-destructive" />;
  if (type.includes("sheet") || type.includes("excel") || type.includes("csv"))
    return <FileSpreadsheet className="h-6 w-6 text-success" />;
  return <File className="h-6 w-6 text-primary" />;
}

function formatSize(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1048576).toFixed(1) + " MB";
}

export default function StudentResources() {
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchResources();
  }, []);

  const fetchResources = async () => {
    const { data, error } = await supabase
      .from("resources")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) {
      toast.error("Failed to load resources");
    } else {
      setResources(data || []);
    }
    setLoading(false);
  };

  const handleDownload = async (resource: Resource) => {
    const { data, error } = await supabase.storage
      .from("resources")
      .download(resource.storage_path);
    if (error) {
      toast.error("Download failed");
      return;
    }
    const url = URL.createObjectURL(data);
    const a = document.createElement("a");
    a.href = url;
    a.download = resource.file_name;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Download started!");
  };

  const filtered = resources.filter(
    (r) =>
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.file_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Learning Resources</h1>
        <p className="mt-1 text-muted-foreground">Download materials shared by your teachers</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search resources..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : filtered.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <FileText className="mb-4 h-12 w-12 text-muted-foreground/40" />
            <h3 className="font-semibold text-foreground">No resources yet</h3>
            <p className="text-sm text-muted-foreground">Check back later for new materials</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {filtered.map((resource) => (
            <Card key={resource.id} className="shadow-card transition-all hover:shadow-card-hover">
              <CardContent className="flex items-center gap-4 p-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
                  {getFileIcon(resource.file_type)}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium text-card-foreground">{resource.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span>{resource.file_name}</span>
                    <span>·</span>
                    <span>{formatSize(resource.file_size)}</span>
                  </div>
                </div>
                <Button size="sm" variant="outline" onClick={() => handleDownload(resource)}>
                  <Download className="mr-1.5 h-4 w-4" />
                  Download
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
