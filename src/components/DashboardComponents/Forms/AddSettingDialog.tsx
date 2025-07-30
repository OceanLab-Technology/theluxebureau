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
import { useSiteSettingsStore } from "@/store/admin/siteSettingsStore"

export function AddSettingDialog() {
  const [open, setOpen] = useState(false)
  const [key, setKey] = useState("")
  const [value, setValue] = useState("")
  const [loading, setLoading] = useState(false)

  const addSetting = useSiteSettingsStore((s) => s.addSetting)

  const handleSubmit = async () => {
    if (!key || !value) return
    setLoading(true)
    await addSetting(key, value)
    setKey("")
    setValue("")
    setOpen(false)
    setLoading(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Setting</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Setting</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <Input
            placeholder="setting_key"
            value={key}
            onChange={(e) => setKey(e.target.value)}
          />
          <Input
            placeholder="setting_value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSubmit} disabled={!key || !value || loading}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
