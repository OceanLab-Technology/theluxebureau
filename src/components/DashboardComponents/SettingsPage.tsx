"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Label } from "@/components/ui/label";
import { useSiteSettingsStore } from "@/store/admin/siteSettingsStore";
import { AddFontDialog } from "@/components/DashboardComponents/Forms/AddFontDialog";
import { AddQuoteDialog } from "@/components/DashboardComponents/Forms/AddQuoteDialog";
import { AddPackagingDialog } from "@/components/DashboardComponents/Forms/AddPackagingDialog";
import { Trash2, Eye } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";

export default function SettingsPage() {
  const {
    settings,
    loading,
    fetchSettings,
    updateApiKey,
    updateQuote,
    deleteQuote,
    deleteFont,
    deletePackaging,
    saveSettings,
    hasChanges,
  } = useSiteSettingsStore();

  useEffect(() => {
    fetchSettings();
  }, []);

  const renderFonts = () => {
    if (loading) {
      return (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-md" />
          ))}
        </div>
      );
    }

    if (settings.fonts.length === 0) {
      return (
        <p className="text-muted-foreground text-sm">
          No custom fonts uploaded yet. Upload your first font above.
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {settings.fonts.map((font, index) => (
          <div
            key={index}
            className="flex items-center justify-between p-3 border rounded-md"
          >
            <div className="flex items-center space-x-3">
              <div className="font-medium">{font.name}</div>
              <a
                href={font.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <Eye className="w-4 h-4" />
              </a>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteFont(font.name)}
              className="text-destructive hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  const renderQuotes = () => {
    if (loading) {
      return (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-10 w-full rounded-md" />
          ))}
        </div>
      );
    }

    if (settings.quotes.length === 0) {
      return (
        <p className="text-muted-foreground text-sm">
          No quotes added yet. Add your first quote above.
        </p>
      );
    }

    return (
      <div className="space-y-2">
        {settings.quotes.map((quote, index) => (
          <div key={index} className="flex items-center space-x-2">
            <Input
              value={quote.text}
              onChange={(e) =>
                updateQuote(index, { ...quote, text: e.target.value })
              }
              className="flex-1"
              placeholder={`Quote ${index + 1}`}
            />
            <Input
              value={quote.author}
              onChange={(e) =>
                updateQuote(index, { ...quote, author: e.target.value })
              }
              className="flex-1"
              placeholder={`Author ${index + 1}`}
            />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteQuote(index)}
              className="text-destructive hover:text-red-600"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  const renderPackaging = () => {
    if (loading) {
      return (
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-md" />
          ))}
        </div>
      );
    }

    if (settings.packaging.length === 0) {
      return (
        <p className="text-muted-foreground text-sm">
          No packaging options uploaded yet. Upload your first packaging option above.
        </p>
      );
    }

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {settings.packaging.map((pkg) => (
          <div
            key={pkg.id}
            className="relative group border rounded-lg overflow-hidden"
          >
            <div className="aspect-video bg-muted/20">
              <img
                src={pkg.image_url}
                alt={pkg.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-3">
              <h4 className="font-medium text-sm">{pkg.title}</h4>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={() => deletePackaging(pkg.id)}
              className="absolute top-2 right-2 h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col font-century">
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <h1 className="text-lg font-semibold font-century">Settings</h1>
      </header>

      <div className="flex-1 space-y-6 p-8 pt-6">
        <div>
          <h1 className="text-3xl font-semibold">Site Settings</h1>
          <p className="text-muted-foreground">
            Manage fonts, quotes, and API configuration for your site.
          </p>
        </div>

        {/* API Key Section */}
        {/* <Card>
          <CardHeader>
            <CardTitle>API Configuration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="apiKey">API Key</Label>
              <Input
                id="apiKey"
                type="password"
                value={localApiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="Enter your API key"
                className="w-full"
              />
              <p className="text-xs text-muted-foreground">
                This API key will be used for external service integrations.
              </p>
            </div>
          </CardContent>
        </Card> */}

        {/* Fonts Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Custom Fonts</CardTitle>
              <AddFontDialog />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">{renderFonts()}</CardContent>
        </Card>

        {/* Quotes Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Quotes</CardTitle>
              <AddQuoteDialog />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">{renderQuotes()}</CardContent>
        </Card>

        {/* Packaging Section */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Product Packaging</CardTitle>
              <AddPackagingDialog />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">{renderPackaging()}</CardContent>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button onClick={saveSettings} disabled={!hasChanges || loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
