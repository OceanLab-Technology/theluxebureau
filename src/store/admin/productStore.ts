import { create } from "zustand";

// Product type
type Product = {
  id: string;
  name: string;
  description?: string;
  inventory: number;
  price: number;
  title?: string;
  image_1?: string;
  image_2?: string;
  image_3?: string;
  image_4?: string;
  image_5?: string;
  slug?: string;
  category: string;
  why_we_chose_it?: string;
  about_the_maker?: string;
  particulars?: string;
};

type ProductStore = {
  products: Product[] | null;
  loading: boolean;
  error: string | null;

  // Pagination
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  // Methods
  fetchProducts: (page?: number, limit?: number) => Promise<void>;
  
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
};

export const useProductAdminStore = create<ProductStore>((set, get) => ({
  products: null,
  loading: false,
  error: null,

  // Default pagination
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,

  // Fetch with pagination
  fetchProducts: async (pageParam, limitParam) => {
    const state = get();
    const page = pageParam || state.page;
    const limit = limitParam || state.limit;

    set({ loading: true, error: null });

    try {
      const res = await fetch(`/api/products?page=${page}&limit=${limit}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch products");
      }

      set({
        products: json.data,
        loading: false,
        page,
        limit,
        total: json.pagination.total,
        totalPages: json.pagination.totalPages,
      });
    } catch (err: any) {
      set({ loading: false, error: err.message || "Unknown error" });
    }
  },

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
}));
