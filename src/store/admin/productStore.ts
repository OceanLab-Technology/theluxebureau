import { create } from "zustand";

// Types
export type Product = {
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

type ProductUpdate = Partial<Product> | FormData;

type ProductStore = {
  products: Product[] | null;
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  fetchProducts: (page?: number, limit?: number) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  createProduct: (data: FormData) => Promise<void>;
  updateProduct: (id: string, updates: ProductUpdate) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<void>;

  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
};

export const useProductAdminStore = create<ProductStore>((set, get) => ({
  products: null,
  selectedProduct: null,
  loading: false,
  error: null,

  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,

  fetchProducts: async (pageParam, limitParam) => {
    const state = get();
    const page = pageParam || state.page;
    const limit = limitParam || state.limit;

    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/products?page=${page}&limit=${limit}`);
      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch products");

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

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/products/${id}`);
      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch product");

      set({ selectedProduct: json.data, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.message || "Unknown error" });
    }
  },

  createProduct: async (formData) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        body: formData,
      });
      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.error || "Failed to create product");

      set((state) => ({
        loading: false,
        products: state.products ? [json.data, ...state.products] : [json.data],
      }));
    } catch (err: any) {
      set({ loading: false, error: err.message || "Unknown error" });
    }
  },

  updateProduct: async (id, updates) => {
    set({ loading: true, error: null });

    try {
      const isForm = updates instanceof FormData;
      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: isForm ? undefined : { "Content-Type": "application/json" },
        body: isForm ? updates : JSON.stringify(updates),
      });

      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to update product");

      set((state) => ({
        loading: false,
        products: state.products?.map((p) => (p.id === id ? json.data : p)) || null,
        selectedProduct: json.data,
      }));

      return json.data as Product;
    } catch (err: any) {
      set({ loading: false, error: err.message || "Unknown error" });
      return null;
    }
  },

  deleteProduct: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete product");

      set((state) => ({
        loading: false,
        products: state.products?.filter((p) => p.id !== id) || null,
        selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
      }));
    } catch (err: any) {
      set({ loading: false, error: err.message || "Unknown error" });
    }
  },

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
}));
