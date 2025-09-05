// import { Product, ApiResponse } from "@/app/api/types";
// import { create } from "zustand";

// interface ProductStore {
//   products: Product[];
//   currentProduct: Product | null;
//   loading: boolean;
//   error: string | null;
//   detailedProductLoading: boolean;
  
//   fetchProducts: (params?: { category?: string; name?: string }) => Promise<void>;
//   fetchProductById: (id: string) => Promise<void>;
//   setCurrentProduct: (product: Product | null) => void;
//   resetProducts: () => void;
// }

// export const useProductStore = create<ProductStore>((set, get) => ({
//   products: [],
//   currentProduct: null,
//   loading: false,
//   error: null,
//   detailedProductLoading: false,

//   fetchProducts: async (params = {}) => {
//     try {
//       set({ loading: true, error: null });

//       const searchParams = new URLSearchParams();
//       if (params.category) searchParams.append("category", params.category);
//       if (params.name) searchParams.append("name", params.name);

//       const url = `/api/products${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
//       const response = await fetch(url);
//       const apiResponse: ApiResponse<Product[]> = await response.json();

//       if (!response.ok) {
//         throw new Error(apiResponse.error || "Failed to fetch products");
//       }

//       set({
//         loading: false,
//         products: apiResponse.data || [],
//       });
//     } catch (error) {
//       set({
//         error: error instanceof Error ? error.message : "An error occurred",
//         loading: false,
//       });
//     }
//   },

//   fetchProductById: async (id: string) => {
//     if (get().currentProduct?.id === id) {
//       return;
//     }
//     try {
//       set({ error: null, detailedProductLoading: true });

//       const response = await fetch(`/api/products/${id}`);
//       const apiResponse: ApiResponse<Product> = await response.json();

//       if (!response.ok) {
//         throw new Error(apiResponse.error || "Failed to fetch product");
//       }
      
//       set({
//         currentProduct: apiResponse.data,
//         detailedProductLoading: false,
//         error: null,
//       });
//     } catch (error) {
//       set({
//         error: error instanceof Error ? error.message : "An error occurred",
//         detailedProductLoading: false,
//       });
//     }
//   },

//   setCurrentProduct: (product: Product | null) => {
//     set({ currentProduct: product });
//   },

//   resetProducts: () => {
//     set({
//       products: [],
//       currentProduct: null,
//       loading: false,
//       error: null,
//       detailedProductLoading: false,
//     });
//   },
// }));


// /store/productStore.ts
import { Product, ApiResponse } from "@/app/api/types";
import { create } from "zustand";

interface ProductStore {
  products: Product[];
  currentProduct: Product | null;
  loading: boolean;           // initial / full-load
  loadingMore: boolean;       // pagination loader
  error: string | null;
  detailedProductLoading: boolean;

  page: number;
  limit: number;
  hasMore: boolean;

  fetchProducts: (opts?: { category?: string; name?: string; page?: number; append?: boolean }) => Promise<void>;
  fetchProductById: (id: string) => Promise<void>;
  setCurrentProduct: (product: Product | null) => void;
  resetProducts: (keepDefaults?: boolean) => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
  products: [],
  currentProduct: null,
  loading: false,
  loadingMore: false,
  error: null,
  detailedProductLoading: false,

  page: 1,
  limit: 18, // default page size — tweak as needed
  hasMore: true,

  // opts.page (1-indexed). append = true -> merge into existing products
  fetchProducts: async (opts = {}) => {
    const { category, name, page = 1, append = false } = opts;
    const limit = get().limit;

    try {
      // choose which loader to flip
      if (append && page > 1) {
        set({ loadingMore: true, error: null });
      } else {
        set({ loading: true, error: null });
      }

      const searchParams = new URLSearchParams();
      if (category) searchParams.append("category", category);
      if (name) searchParams.append("name", name);
      searchParams.append("page", String(page));
      searchParams.append("limit", String(limit));

      const url = `/api/products${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
      const response = await fetch(url);
      const apiResponse: ApiResponse<Product[] | { items: Product[]; total?: number }> = await response.json();

      if (!response.ok) {
        throw new Error((apiResponse as any).error || "Failed to fetch products");
      }

      // Normalize response to array if api returns { items: [], total }
      let newProducts: Product[] = [];
      if (Array.isArray(apiResponse.data)) {
        newProducts = apiResponse.data;
      } else if ((apiResponse.data as any)?.items) {
        newProducts = (apiResponse.data as any).items;
      } else {
        // fallback if shape unexpected
        newProducts = (apiResponse.data as any) || [];
      }

      // Determine hasMore: if returned < limit -> no more pages
      const hasMore = newProducts.length >= limit;

      set((state) => ({
        loading: false,
        loadingMore: false,
        products: append && page > 1 ? [...state.products, ...newProducts] : newProducts,
        page,
        hasMore,
        error: null,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "An error occurred",
        loading: false,
        loadingMore: false,
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
        throw new Error((apiResponse as any).error || "Failed to fetch product");
      }

      set({
        currentProduct: apiResponse.data as Product,
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

  resetProducts: (keepDefaults = false) => {
    set({
      products: [],
      currentProduct: null,
      loading: false,
      loadingMore: false,
      error: null,
      detailedProductLoading: false,
      page: keepDefaults ? get().page : 1,
      hasMore: keepDefaults ? get().hasMore : true,
    });
  },
}));
