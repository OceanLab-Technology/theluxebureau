"use client"

import { useState, useRef } from "react"
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useSiteSettingsStore } from "@/store/admin/siteSettingsStore"
import { Upload } from "lucide-react"

export function AddFontDialog() {
  const [open, setOpen] = useState(false)
  const [fontName, setFontName] = useState("")
  const [fontFile, setFontFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { uploadFont, loading } = useSiteSettingsStore()

  const handleSubmit = async () => {
    if (!fontName || !fontFile) return
    
    await uploadFont(fontName, fontFile)
    setFontName("")
    setFontFile(null)
    setOpen(false)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFontFile(file)
      if (!fontName) {
        // Auto-fill font name from filename (without extension)
        const nameWithoutExt = file.name.replace(/\.[^/.]+$/, "")
        setFontName(nameWithoutExt)
      }
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Upload className="w-4 h-4 mr-2" />
          Add Font
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Custom Font</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="fontName">Font Name</Label>
            <Input
              id="fontName"
              placeholder="e.g., MyCustomFont"
              value={fontName}
              onChange={(e) => setFontName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fontFile">Font File</Label>
            <Input
              id="fontFile"
              type="file"
              accept=".woff,.woff2,.ttf,.otf"
              ref={fileInputRef}
              onChange={handleFileChange}
            />
            <p className="text-xs text-muted-foreground">
              Supported formats: .woff, .woff2, .ttf, .otf
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button 
            onClick={handleSubmit} 
            disabled={!fontName || !fontFile || loading}
          >
            {loading ? "Uploading..." : "Upload Font"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
