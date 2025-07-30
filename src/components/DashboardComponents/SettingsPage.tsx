"use client"

import { useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useSiteSettingsStore } from "@/store/admin/siteSettingsStore"
import { AddSettingDialog } from "@/components/DashboardComponents/Forms/AddSettingDialog"
import { Trash2 } from "lucide-react"

export default function SettingsPage() {
  const {
    settings,
    loading,
    fetchSettings,
    updateSetting,
    saveSettings,
    hasChanges,
    deleteSetting,
  } = useSiteSettingsStore()

  useEffect(() => {
    fetchSettings()
  }, [])

  const renderFields = () => {
    return Object.entries(settings).map(([key, value]) => (
      <div key={key} className="space-y-1">
        <div className="flex items-center justify-between">
          <label
            htmlFor={key}
            className="text-sm font-medium capitalize text-muted-foreground"
          >
            {key.replace(/_/g, " ")}
          </label>
          <button
            onClick={() => deleteSetting(key)}
            className="text-destructive hover:text-red-600"
            aria-label={`Delete setting ${key}`}
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
        <Input
          id={key}
          value={value}
          onChange={(e) => updateSetting(key, e.target.value)}
          className="w-full"
        />
      </div>
    ))
  }

  return (
    <div className="p-6 space-y-6 font-century">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold">Site Settings</h1>
          <p className="text-muted-foreground">
            Manage key-value settings for your site.
          </p>
        </div>
        <AddSettingDialog />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full rounded-md" />
              ))}
            </div>
          ) : (
            renderFields()
          )}

          <div className="flex justify-end">
            <Button onClick={saveSettings} disabled={!hasChanges || loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
