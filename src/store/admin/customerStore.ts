// // stores/useCustomerAdminStore.ts
// import { create } from "zustand";

// export type Customer = {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   address: string;
//   totalOrders: number;
//   totalSpent: number;
//   joinDate: string;
//   status: string;
// };

// type CustomerStore = {
//   customers: Customer[] | null;
//   loading: boolean;
//   error: string | null;

//   // Pagination
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;

//   // Methods
//   fetchCustomers: (page?: number, limit?: number) => Promise<void>;
//   setPage: (page: number) => void;
//   setLimit: (limit: number) => void;
// };

// export const useCustomerAdminStore = create<CustomerStore>((set, get) => ({
//   customers: null,
//   loading: false,
//   error: null,

//   page: 1,
//   limit: 10,
//   total: 0,
//   totalPages: 0,

//   fetchCustomers: async (pageParam, limitParam) => {
//     const state = get();
//     const page = pageParam || state.page;
//     const limit = limitParam || state.limit;

//     set({ loading: true, error: null });

//     try {
//       const res = await fetch(`/api/customers?page=${page}&limit=${limit}`);
//       const json = await res.json();

//       if (!res.ok || !json.success) {
//         throw new Error(json.error || "Failed to fetch customers");
//       }


//       const mappedCustomers: Customer[] = json.data.map((cust: any) => ({
//         id: cust.id,
//         name: cust.name,
//         email: cust.email,
//         phone: cust.phone,
//         address: cust.address,
//         totalOrders: cust.order_count,
//         totalSpent: cust.total_spent,
//         joinDate: new Date(cust.created_at).toISOString().split("T")[0], // format as YYYY-MM-DD
//         status: cust.status,
//       }));

//       set({
//         customers: mappedCustomers,
//         loading: false,
//         page,
//         limit,
//         total: json.pagination.total,
//         totalPages: json.pagination.totalPages,
//       });
//     } catch (err: any) {
//       set({ loading: false, error: err.message || "Unknown error" });
//     }
//   },

//   setPage: (page) => set({ page }),
//   setLimit: (limit) => set({ limit }),
// }));


// // stores/useCustomerAdminStore.ts
// import { create } from "zustand"

// export type Customer = {
//   id: string
//   name: string
//   email: string
//   phone: string
//   address: string
//   totalOrders: number
//   totalSpent: number
//   joinDate: string
//   status: string
// }

// type CustomerStore = {
//   customers: Customer[] | null
//   customer: Customer | null // 👈 Add this
//   loading: boolean
//   error: string | null

//   // Pagination
//   page: number
//   limit: number
//   total: number
//   totalPages: number

//   // Methods
//   fetchCustomers: (page?: number, limit?: number) => Promise<void>
//   fetchCustomer: (id: string) => Promise<void> // 👈 Add this
//   setPage: (page: number) => void
//   setLimit: (limit: number) => void
// }

// export const useCustomerAdminStore = create<CustomerStore>((set, get) => ({
//   customers: null,
//   customer: null, // 👈

//   loading: false,
//   error: null,

//   page: 1,
//   limit: 10,
//   total: 0,
//   totalPages: 0,

//   fetchCustomers: async (pageParam, limitParam) => {
//     const state = get()
//     const page = pageParam || state.page
//     const limit = limitParam || state.limit

//     set({ loading: true, error: null })

//     try {
//       const res = await fetch(`/api/customers?page=${page}&limit=${limit}`)
//       const json = await res.json()

//       if (!res.ok || !json.success) {
//         throw new Error(json.error || "Failed to fetch customers")
//       }

//       const mappedCustomers: Customer[] = json.data.map((cust: any) => ({
//         id: cust.id,
//         name: cust.name,
//         email: cust.email,
//         phone: cust.phone,
//         address: cust.address,
//         totalOrders: cust.order_count,
//         totalSpent: cust.total_spent,
//         joinDate: new Date(cust.created_at).toISOString().split("T")[0],
//         status: cust.status,
//       }))

//       set({
//         customers: mappedCustomers,
//         loading: false,
//         page,
//         limit,
//         total: json.pagination.total,
//         totalPages: json.pagination.totalPages,
//       })
//     } catch (err: any) {
//       set({ loading: false, error: err.message || "Unknown error" })
//     }
//   },

//   fetchCustomer: async (id: string) => {
//     set({ loading: true, error: null })
//     try {
//       const res = await fetch(`/api/customers/${id}`)
//       const json = await res.json()

//       if (!res.ok || !json.success) {
//         throw new Error(json.error || "Failed to fetch customer")
//       }

//       const cust = json.data

//       const mapped: Customer = {
//         id: cust.id,
//         name: cust.name,
//         email: cust.email,
//         phone: cust.phone,
//         address: cust.address,
//         totalOrders: cust.order_count,
//         totalSpent: cust.total_spent,
//         joinDate: new Date(cust.created_at).toISOString().split("T")[0],
//         status: cust.status,
//       }

//       set({ customer: mapped, loading: false })
//     } catch (err: any) {
//       set({ loading: false, error: err.message || "Unknown error" })
//     }
//   },

//   setPage: (page) => set({ page }),
//   setLimit: (limit) => set({ limit }),
// }))


// stores/useCustomerAdminStore.ts
import { create } from "zustand"

export type Customer = {
  id: string
  name: string
  email: string
  phone: string
  address: string
  totalOrders: number
  totalSpent: number
  joinDate: string
  status: string
  notes: string
}

type CustomerStore = {
  customers: Customer[] | null
  customer: Customer | null
  loading: boolean
  error: string | null

  // Pagination
  page: number
  limit: number
  total: number
  totalPages: number
  totalCustomers: number 

  // Methods
  fetchCustomers: (page?: number, limit?: number) => Promise<void>
  fetchCustomer: (id: string) => Promise<void>
  createCustomer: (data: Partial<Customer>) => Promise<void>
  updateCustomer: (id: string, data: Partial<Customer>) => Promise<void>
  deleteCustomer: (id: string) => Promise<void>
  setPage: (page: number) => void
  setLimit: (limit: number) => void


  updatingCustomerId: string | null
}

export const useCustomerAdminStore = create<CustomerStore>((set, get) => ({
  customers: null,
  customer: null,
  loading: false,
  error: null,
  updatingCustomerId: null,

  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0,
  totalCustomers: 0, 

  fetchCustomers: async (pageParam, limitParam) => {
    const state = get()
    const page = pageParam || state.page
    const limit = limitParam || state.limit

    set({ loading: true, error: null })

    try {
      const res = await fetch(`/api/customers?page=${page}&limit=${limit}`)
      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch customers")
      }

      const mappedCustomers: Customer[] = json.data.map((cust: any) => ({
        id: cust.id,
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        address: cust.address,
        totalOrders: cust.order_count,
        totalSpent: cust.total_spent,
        joinDate: new Date(cust.created_at).toISOString().split("T")[0],
        status: cust.status,
        notes: cust.notes
      }))

      set({
        customers: mappedCustomers,
        loading: false,
        page,
        limit,
        total: json.pagination.total,
        totalPages: json.pagination.totalPages,
        totalCustomers: json.pagination.total
      })
    } catch (err: any) {
      set({ loading: false, error: err.message || "Unknown error" })
    }
  },

  fetchCustomer: async (id: string) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`/api/customers/${id}`)
      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to fetch customer")
      }

      const cust = json.data

      const mapped: Customer = {
        id: cust.id,
        name: cust.name,
        email: cust.email,
        phone: cust.phone,
        address: cust.address,
        totalOrders: cust.order_count,
        totalSpent: cust.total_spent,
        joinDate: new Date(cust.created_at).toISOString().split("T")[0],
        status: cust.status,
        notes: cust.notes
      }

      set({ customer: mapped, loading: false })
    } catch (err: any) {
      set({ loading: false, error: err.message || "Unknown error" })
    }
  },

  createCustomer: async (data) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`/api/customers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to create customer")
      }

      await get().fetchCustomers()
      set({ loading: false })
    } catch (err: any) {
      set({ loading: false, error: err.message || "Unknown error" })
    }
  },

  //   updateCustomer: async (id, data) => {
  //   set({ updatingCustomerId: id, error: null })
  //   try {
  //     const res = await fetch(`/api/customers/${id}`, {
  //       method: "PUT",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify(data),
  //     })
  //     const json = await res.json()

  //     if (!res.ok || !json.success) throw new Error(json.error || "Failed to update customer")

  //     // update the customer list locally without refetching everything (optional)
  //     set((state) => ({
  //       customers: state.customers?.map(c => c.id === id ? { ...c, ...data } : c) || null
  //     }))

  //     await get().fetchCustomer(id)
  //   } catch (err: any) {
  //     set({ error: err.message || "Unknown error" })
  //   } finally {
  //     set({ updatingCustomerId: null })
  //   }
  // },

  updateCustomer: async (id, data) => {
    set({ updatingCustomerId: id, error: null })
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      const json = await res.json()

      if (!res.ok || !json.success) throw new Error(json.error || "Failed to update customer")

      // Update the customer locally without refetching all
      set((state) => ({
        customers: state.customers?.map(c => c.id === id ? { ...c, ...data } : c) || null
      }))

      await get().fetchCustomer(id) // update single customer detail if needed
    } catch (err: any) {
      set({ error: err.message || "Unknown error" })
    } finally {
      set({ updatingCustomerId: null })
    }
  },


  deleteCustomer: async (id) => {
    set({ loading: true, error: null })
    try {
      const res = await fetch(`/api/customers/${id}`, {
        method: "DELETE",
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Failed to delete customer")
      }

      await get().fetchCustomers()
      set({ loading: false })
    } catch (err: any) {
      set({ loading: false, error: err.message || "Unknown error" })
    }
  },

  setPage: (page) => set({ page }),
  setLimit: (limit) => set({ limit }),
}))
