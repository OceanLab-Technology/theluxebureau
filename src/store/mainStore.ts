import { Product, ApiResponse } from "@/app/api/types";
import { create } from "zustand";

interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface MainStore {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  pagination: PaginationInfo | null;

  // Actions
  fetchProducts: (params?: {
    page?: number;
    limit?: number;
    category?: string;
    name?: string;
  }) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  clearError: () => void;
  setLoading: (loading: boolean) => void;
}

export const useMainStore = create<MainStore>((set, get) => ({
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  pagination: null,

  fetchProducts: async (params = {}) => {
    try {
      set({ loading: true, error: null });

      const searchParams = new URLSearchParams();
      if (params.page) searchParams.append("page", params.page.toString());
      if (params.limit) searchParams.append("limit", params.limit.toString());
      if (params.category) searchParams.append("category", params.category);
      if (params.name) searchParams.append("name", params.name);

      const url = `/api/products${
        searchParams.toString() ? `?${searchParams.toString()}` : ""
      }`;
      const response = await fetch(url);
      const apiResponse: ApiResponse<Product[]> = await response.json();

      if (!response.ok) {
        throw new Error(apiResponse.error || "Failed to fetch products");
      }

      set({
        loading: false,
        products: apiResponse.data || [],
        pagination: (apiResponse as any).pagination || null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },

  fetchProductById: async (id: string) => {
    if (get().currentProduct?.id === id) {
      return; // If the product is already fetched, do nothing
    }
    try {
      set({ loading: true, error: null });

      const response = await fetch(`/api/products/${id}`);
      const apiResponse: ApiResponse<Product> = await response.json();

      if (!response.ok) {
        throw new Error(apiResponse.error || "Failed to fetch product");
      }
      set({
        currentProduct: apiResponse.data,
        loading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
      });
    }
  },

  clearError: () => set({ error: null }),
  setLoading: (loading: boolean) => set({ loading }),
}));
