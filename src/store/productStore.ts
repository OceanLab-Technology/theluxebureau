import { Product, ApiResponse } from "@/app/api/types";
import { create } from "zustand";

interface ProductStore {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;
  error: string | null;
  detailedProductLoading: boolean;
  
  fetchProducts: (params?: { category?: string; name?: string }) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  setCurrentProduct: (product: Product | null) => void;
  resetProducts: () => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  currentProduct: null,
  loading: false,
  error: null,
  detailedProductLoading: false,

  fetchProducts: async (params = {}) => {
    try {
      set({ loading: true, error: null });

      const searchParams = new URLSearchParams();
      if (params.category) searchParams.append("category", params.category);
      if (params.name) searchParams.append("name", params.name);

      const url = `/api/products${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await fetch(url);
      const apiResponse: ApiResponse<Product[]> = await response.json();

      if (!response.ok) {
        throw new Error(apiResponse.error || "Failed to fetch products");
      }

      set({
        loading: false,
        products: apiResponse.data || [],
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
      return;
    }
    try {
      set({ error: null, detailedProductLoading: true });

      const response = await fetch(`/api/products/${id}`);
      const apiResponse: ApiResponse<Product> = await response.json();

      if (!response.ok) {
        throw new Error(apiResponse.error || "Failed to fetch product");
      }
      
      set({
        currentProduct: apiResponse.data,
        detailedProductLoading: false,
        error: null,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        detailedProductLoading: false,
      });
    }
  },

  setCurrentProduct: (product: Product | null) => {
    set({ currentProduct: product });
  },

  resetProducts: () => {
    set({
      products: [],
      currentProduct: null,
      loading: false,
      error: null,
      detailedProductLoading: false,
    });
  },
}));
