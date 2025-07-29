// stores/useCustomerAdminStore.ts
import { create } from "zustand";

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpent: number;
  joinDate: string;
  status: string;
};

type CustomerStore = {
  customers: Customer[] | null;
  loading: boolean;
  error: string | null;

  // Pagination
  page: number;
  limit: number;
  total: number;
  totalPages: number;

  // Methods
  fetchCustomers: (page?: number, limit?: number) => Promise<void>;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
};

export const useCustomerAdminStore = create<CustomerStore>((set, get) => ({
  customers: null,
  loading: false,
  error: null,

  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,

  fetchCustomers: async (pageParam, limitParam) => {
    const state = get();
    const page = pageParam || state.page;
    const limit = limitParam || state.limit;

    set({ loading: true, error: null });

    try {
      const res = await fetch(`/api/customers?page=${page}&limit=${limit}`);
      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch customers");
      }


      const mappedCustomers: Customer[] = json.data.map((cust: any) => ({
        id: cust.id,
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        address: cust.address,
        totalOrders: cust.order_count,
        totalSpent: cust.total_spent,
        joinDate: new Date(cust.created_at).toISOString().split("T")[0], // format as YYYY-MM-DD
        status: cust.status,
      }));

      set({
        customers: mappedCustomers,
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
