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
  packaging?: string;
  why_we_chose_it?: string;
  about_the_maker?: string;
  particulars?: string;
  least_inventory_trigger?: number;
};

type ProductUpdate = Partial<Product> | FormData;

type ProductStore = {
  products: Product[] | null;
  selectedProduct: Product | null;
  categories: string[];
  loading: boolean;
  error: string | null;
  total: number;
  page: number;
  totalPages: number;


  fetchProducts: (page?: number, limit?: number) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  fetchCategories: () => Promise<void>;
  createProduct: (data: FormData) => Promise<void>;
  updateProduct: (id: string, updates: ProductUpdate) => Promise<Product | null>;
  deleteProduct: (id: string) => Promise<void>;
};

export const useProductAdminStore = create<ProductStore>((set, get) => ({
  products: null,
  selectedProduct: null,
  categories: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 1,


  fetchProducts: async (page = 1, limit = 5) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/products?page=${page}&limit=${limit}`);
      const json = await res.json();

      if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch products");

      set({
        products: json.data,
        page: json.page,
        total: json.total,
        totalPages: json.totalPages,
        loading: false,
      });
    } catch (err: any) {
      set({ loading: false, error: err.message || "Unknown error" });
    }
  },


  fetchCategories: async () => {
    const state = get();
    if (!state.products) {
      await state.fetchProducts();
    }

    const products = get().products || [];
    const uniqueCategories = Array.from(new Set(
      products.map(product => product.category).filter(Boolean)
    )).sort();

    set({ categories: uniqueCategories });
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

      if (!res.ok || !json.success)
        throw new Error(json.error || "Failed to create product");

      set((state) => ({
        loading: false,
        products: state.products
          ? [json.data, ...state.products]
          : [json.data],
      }));

      const activityData = {
        type: "product_created",
        entity_type: "product",
        entity_id: json.data.id,
        title: `Product created: ${json.data.name}`,
        description: `Product "${json.data.name}" has been created in category "${json.data.category}"`,
        metadata: {
          price: json.data.price,
          inventory: json.data.inventory,
          category: json.data.category,
        },
        user_id: null,
      };

      const activityRes = await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
      });

      if (!activityRes.ok) {
        console.error("Failed to create activity:", activityRes.statusText);
      }
    } catch (err: any) {
      set({ loading: false, error: err.message || "Unknown error" });
    }
  },

  updateProduct: async (id: string, updates: FormData | Partial<Product>) => {
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

      // Update local store
      set((state) => ({
        loading: false,
        products: state.products?.map((p) => (p.id === id ? json.data : p)) || null,
        selectedProduct: json.data,
      }));

      // Activity log
      const activityData = {
        type: "product_updated",
        entity_type: "product",
        entity_id: json.data.id,
        title: `Product updated: ${json.data.name}`,
        description: `Product "${json.data.name}" has been updated`,
        metadata: {
          price: json.data.price,
          inventory: json.data.inventory,
          category: json.data.category,
        },
        user_id: null,
      };

      await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
      });

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

      // Activity log
      const activityData = {
        type: "product_deleted",
        entity_type: "product",
        entity_id: id,
        title: `Product deleted`,
        description: `A product with ID "${id}" has been deleted`,
        metadata: {},
        user_id: null,
      };

      await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(activityData),
      });

    } catch (err: any) {
      set({ loading: false, error: err.message || "Unknown error" });
    }
  },
}));
