import { useState, useRef, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Upload, FileUp, X, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

const ACCEPTED_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation",
  "image/jpeg",
  "image/png",
  "application/zip",
  "application/x-zip-compressed",
];

const ACCEPTED_EXTENSIONS = ".pdf,.docx,.pptx,.jpg,.jpeg,.png,.zip";

export default function TeacherUpload() {
  const { user } = useAuth();
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [done, setDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (f: File) => {
    if (!ACCEPTED_TYPES.includes(f.type)) {
      toast.error("Unsupported file type");
      return;
    }
    if (f.size > 50 * 1024 * 1024) {
      toast.error("File too large (max 50MB)");
      return;
    }
    setFile(f);
    if (!title) setTitle(f.name.replace(/\.[^/.]+$/, ""));
    setDone(false);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  }, [title]);

  const handleUpload = async () => {
    if (!file || !user) return;
    setUploading(true);
    setProgress(10);

    const ext = file.name.split(".").pop();
    const storagePath = `${user.id}/${Date.now()}.${ext}`;

    setProgress(30);
    const { error: storageError } = await supabase.storage
      .from("resources")
      .upload(storagePath, file);

    if (storageError) {
      toast.error("Upload failed: " + storageError.message);
      setUploading(false);
      setProgress(0);
      return;
    }

    setProgress(70);

    const { error: dbError } = await supabase.from("resources").insert({
      teacher_id: user.id,
      title: title || file.name,
      description: description || null,
      file_name: file.name,
      file_type: file.type,
      file_size: file.size,
      storage_path: storagePath,
    });

    if (dbError) {
      toast.error("Failed to save: " + dbError.message);
      setUploading(false);
      setProgress(0);
      return;
    }

    setProgress(100);
    setDone(true);
    toast.success("Resource uploaded successfully!");
    setUploading(false);

    // Reset after delay
    setTimeout(() => {
      setFile(null);
      setTitle("");
      setDescription("");
      setProgress(0);
      setDone(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Upload Resources</h1>
        <p className="mt-1 text-muted-foreground">Share learning materials with your students</p>
      </div>

      <Card className="shadow-card">
        <CardContent className="space-y-6 p-6">
          {/* Drop zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
            onClick={() => inputRef.current?.click()}
            className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all ${
              isDragging
                ? "border-primary bg-primary/5"
                : file
                ? "border-success bg-success/5"
                : "border-border hover:border-primary/40 hover:bg-secondary/50"
            }`}
          >
            {done ? (
              <CheckCircle2 className="mb-3 h-10 w-10 text-success" />
            ) : file ? (
              <FileUp className="mb-3 h-10 w-10 text-primary" />
            ) : (
              <Upload className="mb-3 h-10 w-10 text-muted-foreground" />
            )}
            <p className="text-sm font-medium text-foreground">
              {file ? file.name : "Drag & drop your file here"}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : "PDF, DOCX, PPTX, JPG, PNG, ZIP (max 50MB)"}
            </p>
            {file && !uploading && !done && (
              <Button
                variant="ghost"
                size="sm"
                className="mt-2 text-destructive hover:bg-destructive/10"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                  setTitle("");
                }}
              >
                <X className="mr-1 h-3 w-3" /> Remove
              </Button>
            )}
            <input
              ref={inputRef}
              type="file"
              accept={ACCEPTED_EXTENSIONS}
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
            />
          </div>

          {/* Progress */}
          {(uploading || done) && (
            <Progress value={progress} className="h-2" />
          )}

          {/* Title & description */}
          {file && !done && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resource title" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="desc">Description (optional)</Label>
                <Input id="desc" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Brief description" />
              </div>
              <Button onClick={handleUpload} disabled={uploading} className="gradient-primary text-primary-foreground">
                {uploading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Upload Resource
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
