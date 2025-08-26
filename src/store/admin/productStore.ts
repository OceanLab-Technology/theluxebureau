// import { create } from "zustand";

// // Types

// export type Variant = {
//   name: string;
//   inventory: number;
//   threshold: number;
//   qty_blocked: number;
// };


// export type Product = {
//   id: string;
//   name: string;
//   description?: string;
//   inventory: number;
//   price: number;
//   title?: string;
//   image_1?: string;
//   image_2?: string;
//   image_3?: string;
//   image_4?: string;
//   image_5?: string;
//   slug?: string;
//   category: string;
//   packaging?: string;
//   why_we_chose_it?: string;
//   about_the_maker?: string;
//   particulars?: string;
//   least_inventory_trigger?: number;
//   threshold: number;
    
//   variants: Variant[];                // jsonb
//   related_product_ids?: string[];     // add a jsonb column OR handle via join table

// };

// type ProductUpdate = Partial<Product> | FormData;

// type ProductStore = {
//   products: Product[] | null;
//   selectedProduct: Product | null;
//   categories: string[];
//   loading: boolean;
//   error: string | null;
//   total: number;
//   page: number;
//   totalPages: number;


//   fetchProducts: (page?: number, limit?: number) => Promise<void>;
//   fetchProductById: (id: string) => Promise<void>;
//   fetchCategories: () => Promise<void>;
//   createProduct: (data: FormData) => Promise<void>;
//   updateProduct: (id: string, updates: ProductUpdate) => Promise<Product | null>;
//   deleteProduct: (id: string) => Promise<void>;
// };

// export const useProductAdminStore = create<ProductStore>((set, get) => ({
//   products: null,
//   selectedProduct: null,
//   categories: [],
//   loading: false,
//   error: null,
//   total: 0,
//   page: 1,
//   totalPages: 1,


//   fetchProducts: async (page = 1, limit = 10) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await fetch(`/api/products?page=${page}&limit=${limit}`);
//       const json = await res.json();

//       if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch products");

//       set({
//         products: json.data,
//         page: json.page,
//         total: json.total,
//         totalPages: json.totalPages,
//         loading: false,
//       });
//     } catch (err: any) {
//       set({ loading: false, error: err.message || "Unknown error" });
//     }
//   },


//   fetchCategories: async () => {
//     const state = get();
//     if (!state.products) {
//       await state.fetchProducts();
//     }

//     const products = get().products || [];
//     const uniqueCategories = Array.from(new Set(
//       products.map(product => product.category).filter(Boolean)
//     )).sort();

//     set({ categories: uniqueCategories });
//   },

//   fetchProductById: async (id) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await fetch(`/api/products/${id}`);
//       const json = await res.json();

//       if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch product");

//       set({ selectedProduct: json.data, loading: false });
//     } catch (err: any) {
//       set({ loading: false, error: err.message || "Unknown error" });
//     }
//   },

//   createProduct: async (formData) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await fetch("/api/products", {
//         method: "POST",
//         body: formData,
//       });
//       const json = await res.json();

//       if (!res.ok || !json.success)
//         throw new Error(json.error || "Failed to create product");

//       set((state) => ({
//         loading: false,
//         products: state.products
//           ? [json.data, ...state.products]
//           : [json.data],
//       }));

//       const activityData = {
//         type: "product_created",
//         entity_type: "product",
//         entity_id: json.data.id,
//         title: `Product created: ${json.data.name}`,
//         description: `Product "${json.data.name}" has been created in category "${json.data.category}"`,
//         metadata: {
//           price: json.data.price,
//           inventory: json.data.inventory,
//           category: json.data.category,
//         },
//         user_id: null,
//       };

//       const activityRes = await fetch("/api/activities", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(activityData),
//       });

//       if (!activityRes.ok) {
//         console.error("Failed to create activity:", activityRes.statusText);
//       }
//     } catch (err: any) {
//       set({ loading: false, error: err.message || "Unknown error" });
//     }
//   },

//   updateProduct: async (id: string, updates: FormData | Partial<Product>) => {
//     set({ loading: true, error: null });

//     try {
//       const isForm = updates instanceof FormData;

//       const res = await fetch(`/api/products/${id}`, {
//         method: "PUT",
//         headers: isForm ? undefined : { "Content-Type": "application/json" },
//         body: isForm ? updates : JSON.stringify(updates),
//       });

//       const json = await res.json();
//       if (!res.ok || !json.success) throw new Error(json.error || "Failed to update product");

//       // Update local store
//       set((state) => ({
//         loading: false,
//         products: state.products?.map((p) => (p.id === id ? json.data : p)) || null,
//         selectedProduct: json.data,
//       }));

//       // Activity log
//       const activityData = {
//         type: "product_updated",
//         entity_type: "product",
//         entity_id: json.data.id,
//         title: `Product updated: ${json.data.name}`,
//         description: `Product "${json.data.name}" has been updated`,
//         metadata: {
//           price: json.data.price,
//           inventory: json.data.inventory,
//           category: json.data.category,
//         },
//         user_id: null,
//       };

//       await fetch("/api/activities", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(activityData),
//       });

//       return json.data as Product;
//     } catch (err: any) {
//       set({ loading: false, error: err.message || "Unknown error" });
//       return null;
//     }
//   },

//   deleteProduct: async (id) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
//       const json = await res.json();
//       if (!res.ok || !json.success) throw new Error(json.error || "Failed to delete product");

//       set((state) => ({
//         loading: false,
//         products: state.products?.filter((p) => p.id !== id) || null,
//         selectedProduct: state.selectedProduct?.id === id ? null : state.selectedProduct,
//       }));

//       // Activity log
//       const activityData = {
//         type: "product_deleted",
//         entity_type: "product",
//         entity_id: id,
//         title: `Product deleted`,
//         description: `A product with ID "${id}" has been deleted`,
//         metadata: {},
//         user_id: null,
//       };

//       await fetch("/api/activities", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(activityData),
//       });

//     } catch (err: any) {
//       set({ loading: false, error: err.message || "Unknown error" });
//     }
//   },
// }));



// store/admin/productStore.ts
import { create } from "zustand";

/* -------------------- Types -------------------- */
export type Variant = {
  name: string;
  inventory: number;
  threshold: number;
  qty_blocked: number;
};

export type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number;
  title?: string | null;
  image_1?: string | null;
  image_2?: string | null;
  image_3?: string | null;
  image_4?: string | null;
  image_5?: string | null;
  slug?: string | null;
  category: string;
  packaging?: string | null;
  why_we_chose_it?: string | null;
  about_the_maker?: string | null;
  particulars?: string | null;

  // ✅ DB jsonb
  variants: Variant[];                  // required
  contains_alcohol: boolean;
};

export type ProductUpdateJson = Partial<{
  name: string;
  description: string | null;
  price: number;
  title: string | null;
  image_1: string | null;
  image_2: string | null;
  image_3: string | null;
  image_4: string | null;
  image_5: string | null;
  slug: string | null;
  category: string;
  packaging: string | null;
  why_we_chose_it: string | null;
  about_the_maker: string | null;
  particulars: string | null;

  variants: Variant[];
  contains_alcohol: boolean;
}>;

type ProductUpdate = ProductUpdateJson | FormData;

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

/* -------------------- Helpers -------------------- */
function n(x: any, f = 0) {
  if (typeof x === "number" && !Number.isNaN(x)) return x;
  if (typeof x === "string" && x.trim() !== "" && !Number.isNaN(Number(x))) return Number(x);
  return f;
}
function normalizeVariant(v: any): Variant {
  return {
    name: String(v?.name ?? "default"),
    inventory: n(v?.inventory, 0),
    threshold: n(v?.threshold, 0),
    qty_blocked: n(v?.qty_blocked, 0),
  };
}
function totalAvailable(variants: Variant[] = []): number {
  return variants.reduce((sum, v) => sum + Math.max(0, n(v.inventory) - n(v.qty_blocked)), 0);
}

/* -------------------- Store -------------------- */
export const useProductAdminStore = create<ProductStore>((set, get) => ({
  products: null,
  selectedProduct: null,
  categories: [],
  loading: false,
  error: null,
  total: 0,
  page: 1,
  totalPages: 1,

  fetchProducts: async (page = 1, limit = 10) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/products?page=${page}&limit=${limit}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch products");

      set({
        products: json.data as Product[],
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
    const unique = Array.from(
      new Set(products.map(p => p.category).filter(Boolean))
    ).sort();
    set({ categories: unique });
  },

  fetchProductById: async (id) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/products/${id}`);
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to fetch product");
      set({ selectedProduct: json.data as Product, loading: false });
    } catch (err: any) {
      set({ loading: false, error: err.message || "Unknown error" });
    }
  },

  createProduct: async (formData) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/products", { method: "POST", body: formData });
      const json = await res.json();
      if (!res.ok || !json.success) throw new Error(json.error || "Failed to create product");

      set((state) => ({
        loading: false,
        products: state.products ? [json.data, ...state.products] : [json.data],
      }));

      // Activity log (no top-level inventory anymore; compute from variants)
      const stock = totalAvailable(json.data?.variants || []);
      await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "product_created",
          entity_type: "product",
          entity_id: json.data.id,
          title: `Product created: ${json.data.name}`,
          description: `Product "${json.data.name}" created in category "${json.data.category}"`,
          metadata: { price: json.data.price, total_stock: stock, category: json.data.category },
          user_id: null,
        }),
      });
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

      const stock = totalAvailable(json.data?.variants || []);
      await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "product_updated",
          entity_type: "product",
          entity_id: json.data.id,
          title: `Product updated: ${json.data.name}`,
          description: `Product "${json.data.name}" has been updated`,
          metadata: { price: json.data.price, total_stock: stock, category: json.data.category },
          user_id: null,
        }),
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

      await fetch("/api/activities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "product_deleted",
          entity_type: "product",
          entity_id: id,
          title: `Product deleted`,
          description: `Product "${id}" deleted`,
          metadata: {},
          user_id: null,
        }),
      });
    } catch (err: any) {
      set({ loading: false, error: err.message || "Unknown error" });
    }
  },
}));
