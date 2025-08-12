import { create } from "zustand";
import { toast } from "sonner";

type FontSetting = {
  name: string;
  url: string;
};

type SiteSettings = {
  fonts: FontSetting[];
  quotes: {
    text: string;
    author: string;
  }[];
  api_key: string;
};

type SiteSettingsStore = {
  settings: SiteSettings;
  original: SiteSettings;
  loading: boolean;
  fetchSettings: () => Promise<void>;
  updateApiKey: (apiKey: string) => void;
  addQuote: (quote: { text: string; author: string }) => void;
  updateQuote: (index: number, quote: { text: string; author: string }) => void;
  deleteQuote: (index: number) => Promise<void>;
  uploadFont: (fontName: string, fontFile: File) => Promise<void>;
  deleteFont: (fontName: string) => Promise<void>;
  saveSettings: () => Promise<void>;
  hasChanges: boolean;
};

const defaultSettings: SiteSettings = {
  fonts: [],
  quotes: [],
  api_key: "",
};

export const useSiteSettingsStore = create<SiteSettingsStore>((set, get) => ({
  settings: defaultSettings,
  original: defaultSettings,
  loading: false,
  hasChanges: false,

  fetchSettings: async () => {
    set({ loading: true });
    try {
      const res = await fetch("/api/settings");
      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      const settings: SiteSettings = {
        fonts: json.data.fonts || [],
        quotes: json.data.quotes || [],
        api_key: json.data.api_key || "",
      };

      set({ settings, original: settings, hasChanges: false });
    } catch (err) {
      toast.error("Failed to load settings");
    } finally {
      set({ loading: false });
    }
  },

  updateApiKey: (apiKey: string) => {
    const newSettings = { ...get().settings, api_key: apiKey };
    const hasChanges =
      JSON.stringify(newSettings) !== JSON.stringify(get().original);
    set({ settings: newSettings, hasChanges });
  },

  addQuote: ({ author, text }) => {
    if (!text.trim() || !author.trim()) return;
    const newQuotes = [
      ...get().settings.quotes,
      { text: text.trim(), author: author.trim() },
    ];
    const newSettings = { ...get().settings, quotes: newQuotes };
    const hasChanges =
      JSON.stringify(newSettings) !== JSON.stringify(get().original);
    set({ settings: newSettings, hasChanges });
  },

  updateQuote: (index: number, quote: { text: string; author: string }) => {
    const newQuotes = [...get().settings.quotes];
    newQuotes[index] = quote;
    const newSettings = { ...get().settings, quotes: newQuotes };
    const hasChanges =
      JSON.stringify(newSettings) !== JSON.stringify(get().original);
    set({ settings: newSettings, hasChanges });
  },

  deleteQuote: async (index: number) => {
    try {
      const res = await fetch(`/api/settings?type=quote&quoteIndex=${index}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("Quote deleted");
      await get().fetchSettings();
    } catch (err) {
      toast.error("Failed to delete quote");
    }
  },

  uploadFont: async (fontName: string, fontFile: File) => {
    set({ loading: true });
    try {
      const formData = new FormData();
      formData.append("fontName", fontName);
      formData.append("fontFile", fontFile);

      const res = await fetch("/api/settings", {
        method: "POST",
        body: formData,
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("Font uploaded successfully");
      await get().fetchSettings();
    } catch (err) {
      toast.error("Failed to upload font");
    } finally {
      set({ loading: false });
    }
  },

  deleteFont: async (fontName: string) => {
    try {
      const res = await fetch(`/api/settings?type=font&fontName=${fontName}`, {
        method: "DELETE",
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("Font deleted");
      await get().fetchSettings();
    } catch (err) {
      toast.error("Failed to delete font");
    }
  },

  saveSettings: async () => {
    const { settings, original } = get();
    const hasChanges = JSON.stringify(settings) !== JSON.stringify(original);

    if (!hasChanges) return;

    set({ loading: true });
    try {
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      const json = await res.json();
      if (!json.success) throw new Error(json.error);

      toast.success("Settings saved successfully");
      set({ original: { ...settings }, hasChanges: false });
    } catch (err) {
      toast.error("Failed to save settings");
    } finally {
      set({ loading: false });
    }
  },
}));
