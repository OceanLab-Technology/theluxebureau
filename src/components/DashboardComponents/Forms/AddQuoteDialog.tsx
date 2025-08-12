"use client"

import { useState } from "react"
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
import { Plus } from "lucide-react"

export function AddQuoteDialog() {
  const [open, setOpen] = useState(false)
  const [author, setAuthor] = useState("")
  const [quote, setQuote] = useState("")

  const { addQuote } = useSiteSettingsStore()

  const handleSubmit = () => {
    if (!quote.trim()) return
    addQuote({ text: quote.trim(), author: author.trim() })
    setQuote("")
    setAuthor("")
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Quote
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Quote</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="author">Author</Label>
            <Input
              id="author"
              placeholder="Enter the author's name..."
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="quote">Quote Text</Label>
            <Input
              id="quote"
              placeholder="Enter your quote here..."
              value={quote}
              onChange={(e) => setQuote(e.target.value)}
              // onKeyDown={(e) => {
              //   if (e.key === "Enter" && !e.shiftKey) {
              //     e.preventDefault()
              //     handleSubmit()
              //   }
              // }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!quote.trim()}>
            Add Quote
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
