import { create } from "zustand"
import { toast } from "sonner"

type SiteSettingsStore = {
    settings: Record<string, string>
    original: Record<string, string>
    loading: boolean
    fetchSettings: () => Promise<void>
    updateSetting: (key: string, value: string) => void
    saveSettings: () => Promise<void>
    hasChanges: boolean,
    addSetting: (key: string, value: string) => Promise<void>,
    deleteSetting: (key: string) => Promise<void>
}

export const useSiteSettingsStore = create<SiteSettingsStore>((set, get) => ({
    settings: {},
    original: {},
    loading: false,
    hasChanges: false,

    fetchSettings: async () => {
        set({ loading: true })
        try {
            const res = await fetch("/api/settings")
            const json = await res.json()
            if (!json.success) throw new Error(json.error)

            const settingsMap: Record<string, string> = {}
            for (const setting of json.data) {
                settingsMap[setting.setting_key] = setting.setting_value
            }

            set({ settings: settingsMap, original: settingsMap, hasChanges: false })
        } catch (err) {
            toast.error("Failed to load settings")
        } finally {
            set({ loading: false })
        }
    },

    updateSetting: (key, value) => {
        const newSettings = { ...get().settings, [key]: value }
        const hasChanges = JSON.stringify(newSettings) !== JSON.stringify(get().original)
        set({ settings: newSettings, hasChanges })
    },

    saveSettings: async () => {
        const { settings, original } = get()
        const changedKeys = Object.keys(settings).filter(
            key => settings[key] !== original[key]
        )

        if (changedKeys.length === 0) return

        set({ loading: true })
        try {
            for (const key of changedKeys) {
                const res = await fetch(`/api/settings?key=${key}`, {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ setting_value: settings[key] }),
                })

                const json = await res.json()
                if (!json.success) throw new Error(json.error)
            }

            toast.success("Settings saved successfully")
            set({ original: { ...settings }, hasChanges: false })
        } catch (err) {
            toast.error("Failed to save settings")
        } finally {
            set({ loading: false })
        }
    },
    addSetting: async (key: string, value: string) => {
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ setting_key: key, setting_value: value }),
            })

            const json = await res.json()
            if (!json.success) throw new Error(json.error)

            toast.success("Setting added")
            await get().fetchSettings()
        } catch (err) {
            toast.error("Failed to add setting")
        }
    },

    deleteSetting: async (key: string) => {
        try {
            const res = await fetch(`/api/settings?key=${key}`, {
                method: "DELETE",
            });

            const json = await res.json();
            if (!json.success) throw new Error(json.error);

            toast.success("Setting deleted");

            const newSettings = { ...get().settings };
            delete newSettings[key];

            const newOriginal = { ...get().original };
            delete newOriginal[key];

            const hasChanges = JSON.stringify(newSettings) !== JSON.stringify(newOriginal);

            set({ settings: newSettings, original: newOriginal, hasChanges });
        } catch (err) {
            toast.error("Failed to delete setting");
        }
    },


}))
