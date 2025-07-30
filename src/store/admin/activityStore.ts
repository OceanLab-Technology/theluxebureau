// stores/activityStore.ts
import { create } from 'zustand'
import { Activity } from '@/app/api/types'

type ActivityStore = {
    recentActivities: Activity[]
    loading: boolean
    error: string | null
    fetchActivities: (page: number) => Promise<void>
    pagination: {
        page: number
        totalPages: number
        total: number
    }
}

export const useActivityStore = create<ActivityStore>((set) => ({
    recentActivities: [],
    loading: false,
    error: null,
    pagination: {
        page: 1,
        totalPages: 1,
        total: 0,
    },
    fetchActivities: async (page: number) => {
        set({ loading: true, error: null });

        try {
            const res = await fetch(`/api/activities?page=${page}`);
            const json = await res.json();
            console.log("Fetched activities:", json);

            if (!res.ok) {
                throw new Error(json.error || "Failed to fetch activities");
            }

            const normalized = (json.data || []).map(normalizeActivity);

            set({
                recentActivities: normalized,
                loading: false,
            });
        } catch (err: any) {
            set({ loading: false, error: err.message });
        }
    },

}))

function normalizeActivity(activity: Activity): Activity {
    return {
        ...activity,
        timestamp: activity.created_at,
        status:
            activity.type.includes("created") ? "Created" :
            activity.type.includes("updated") ? "Updated" :
            activity.type.includes("deleted") ? "Deleted" :
            activity.type, // fallback
    };
}


