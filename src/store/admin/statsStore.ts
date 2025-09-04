import { create } from 'zustand'

// Stats
type StatItem = {
  value: number;
  change: number;
};

type StatsData = {
  revenue: StatItem;
  orders: StatItem;
  customers: StatItem;
  growthRate: StatItem;
};

type StatsStore = {
  stats: StatsData | null;
  loading: boolean;
  error: string | null;
  fetchStats: () => Promise<void>;
};

export const useStatsStore = create<StatsStore>((set) => ({
  stats: null,
  loading: false,
  error: null,

  fetchStats: async () => {
    set({ loading: true, error: null });

    try {
      const res = await fetch('/api/stats');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || 'Failed to fetch stats');
      console.log('Fetched stats:', json);

      set({ stats: json.data, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.message });
    }
  },
}));
