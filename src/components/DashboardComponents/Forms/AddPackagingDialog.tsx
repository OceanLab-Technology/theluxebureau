"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSiteSettingsStore } from "@/store/admin/siteSettingsStore";
import { Upload, Plus } from "lucide-react";
import { toast } from "sonner";

export function AddPackagingDialog() {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  const { uploadPackaging } = useSiteSettingsStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Title is required");
      return;
    }
    
    if (!imageFile) {
      toast.error("Image file is required");
      return;
    }

    setUploading(true);
    try {
      await uploadPackaging(title.trim(), imageFile);
      setTitle("");
      setImageFile(null);
      setOpen(false);
    } catch (error) {
      console.error("Error uploading packaging:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error("Please select an image file");
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      
      setImageFile(file);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Packaging
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Packaging</DialogTitle>
          <DialogDescription>
            Upload a packaging option that customers can select for their products.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Packaging Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g., Gift Box, Eco-Friendly Wrap"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="image">Packaging Image</Label>
            <div className="border-2 border-dashed rounded-lg p-4 text-center">
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <Label
                htmlFor="image"
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {imageFile ? imageFile.name : "Click to upload image"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG, WEBP up to 5MB
                  </p>
                </div>
              </Label>
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setOpen(false)}
              disabled={uploading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={uploading}>
              {uploading ? "Uploading..." : "Add Packaging"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
