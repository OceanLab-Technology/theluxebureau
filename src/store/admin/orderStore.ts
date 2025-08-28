// // stores/orderAdminStore.ts
// import { create } from "zustand";
// import axios from "axios";

// type Order = {
//   id: string;
//   customerName: string;
//   recipientName: string;
//   deliveryDate: string;
//   total: string;
//   status: string;
//   paymentStatus?: string;
//   orderItems?: Array<{
//     id: string;
//     products: {
//       id: string;
//       name: string;
//       image_1: string;
//       price: number;
//     };
//     quantity: number;
//     price_at_purchase: number;
//     custom_data: any;
//     selected_variant_name: string | null;
//   }>;
//   personalization?: any[];
//   notes?: string;
//   createdAt?: string;
//   updatedAt?: string;

// };

// type Pagination = {
//   page: number;
//   limit: number;
//   total: number;
//   totalPages: number;
// };

// type OrdersState = {
//   orders: Order[];
//   loading: boolean;
//   updatingOrderId: string | null;
//   pagination: Pagination | null;
//   fetchOrders: (
//     filters?: Record<string, string>,
//     page?: number,
//     limit?: number
//   ) => Promise<void>;
//   updateOrderStatus: (orderId: string, newStatus: string) => Promise<boolean>;
// };

// export const useOrdersStore = create<OrdersState>((set, get) => ({
//   orders: [],
//   loading: true,
//   updatingOrderId: null,
//   pagination: null,

//   fetchOrders: async (filters: Record<string, string> = {}, page = 1, limit = 10) => {
//     set({ loading: true });
//     try {
//       const queryParams = new URLSearchParams({
//         ...filters,
//         page: String(page),
//         limit: String(limit),
//       }).toString();

//       const res = await axios.get(`/api/orders?${queryParams}`);

//       const mappedOrders: Order[] = res.data.data.map((order: any) => ({
//         id: order.id,
//         customerName: order.customer_name || "Unknown",
//         recipientName: order.recipient_name || "",
//         deliveryDate: order.delivery_date || "",
//         total: order.total_amount ? order.total_amount.toFixed(2) : "0.00",
//         status: order.status,
//         paymentStatus: order.payment_status,
//         orderItems: order.order_items || [],
//         personalization: order.personalization || [],
//         notes: order.notes,
//         createdAt: order.created_at,
//         updatedAt: order.updated_at,
//         selected_variant_name: order.selected_variant_name
//       }));

//       set({
//         orders: mappedOrders,
//         loading: false,
//         pagination: res.data.pagination,
//       });
//     } catch (e) {
//       console.error("Failed to fetch orders:", e);
//       set({ loading: false });
//     }
//   },

//   updateOrderStatus: async (orderId: string, newStatus: string) => {
//     set({ updatingOrderId: orderId });
//     try {
//       const response = await fetch(`/api/orders/${orderId}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ status: newStatus }),
//       });

//       if (!response.ok) {
//         throw new Error("Failed to update order status");
//       }

//       const currentOrders = get().orders;
//       const updatedOrders = currentOrders.map(order => 
//         order.id === orderId 
//           ? { ...order, status: newStatus }
//           : order
//       );

//       set({ 
//         orders: updatedOrders,
//         updatingOrderId: null 
//       });

//       return true;
//     } catch (error) {
//       console.error("Error updating order status:", error);
//       set({ updatingOrderId: null });
//       return false;
//     }
//   },
// }));




// interface OrderDetails {
//   id: string;
//   customerInfo: {
//     name: string;
//     email: string;
//   };
//   recipientInfo: {
//     name: string;
//     address: string;
//   };
//   orderInfo: {
//     deliveryDate: string;
//     total: string;
//     status: string;
//     notes: string;
//     placedAt: string;
//     paymentStatus: string;
//     updatedAt: string;
//     preferredDeliveryTime?: string; 
//   };
//   orderItems: Array<{
//     id: string;
//     products: {
//       id: string;
//       name: string;
//       image_1: string;
//       image_2?: string;
//       image_3?: string;
//       price: number;
//       description?: string;
//       category?: string;
//       why_we_chose_it?: string;
//       about_the_maker?: string;
//       particulars?: string;
//     };
//     quantity: number;
//     price_at_purchase: number;
//     custom_data: any;
//     selected_variant_name: string | null;
//   }>;
//   personalization: any[];
// }

// interface OrderDetailsState {
//   order: OrderDetails | null;
//   loading: boolean;
//   error: string | null;
//   fetchOrder: (orderId: string) => Promise<void>;
//   updateOrder: (orderId: string, updatedFields: Partial<OrderDetails>) => Promise<void>;
//   deleteOrder: (orderId: string) => Promise<void>;
// }

// export const useOrderDetailsStore = create<OrderDetailsState>((set, get) => ({
//   order: null,
//   loading: false,
//   error: null,

//   fetchOrder: async (orderId: string) => {
//     set({ loading: true, error: null });

//     try {
//       const res = await fetch(`/api/orders/${orderId}`);
//       const result = await res.json();

//       if (!res.ok) throw new Error(result.error || "Failed to fetch order");

//       const order = result.data;

//       set({
//         order: {
//           id: order.id,
//           customerInfo: {
//             name: order.customer_name,
//             email: order.customer_email,
//           },
//           recipientInfo: {
//             name: order.recipient_name,
//             address: order.recipient_address,
//           },
//           orderInfo: {
//             deliveryDate: order.delivery_date,
//             total: order.total_amount,
//             status: order.status,
//             notes: order.notes,
//             placedAt: order.created_at,
//             paymentStatus: order.payment_status,
//             updatedAt: order.updated_at
//           },
//           orderItems: order.order_items || [],
//           personalization: order.personalization || [],
//           selected_variant_name: order.selected_variant_name
//         },
//         loading: false,
//       });
//     } catch (err: any) {
//       set({ error: err.message, loading: false });
//     }
//   },

//   updateOrder: async (orderId, updatedFields) => {
//     set({ loading: true, error: null });

//     try {
//       const payload: any = {};

//       if (updatedFields.customerInfo) {
//         if (updatedFields.customerInfo.name !== undefined)
//           payload.customer_name = updatedFields.customerInfo.name;
//         if (updatedFields.customerInfo.email !== undefined)
//           payload.customer_email = updatedFields.customerInfo.email;
//       }

//       if (updatedFields.recipientInfo) {
//         if (updatedFields.recipientInfo.name !== undefined)
//           payload.recipient_name = updatedFields.recipientInfo.name;
//         if (updatedFields.recipientInfo.address !== undefined)
//           payload.recipient_address = updatedFields.recipientInfo.address;
//       }

//       if (updatedFields.orderInfo) {
//         if (updatedFields.orderInfo.deliveryDate !== undefined)
//           payload.delivery_date = updatedFields.orderInfo.deliveryDate;
//         if (updatedFields.orderInfo.status !== undefined)
//           payload.status = updatedFields.orderInfo.status;
//         if (updatedFields.orderInfo.notes !== undefined)
//           payload.notes = updatedFields.orderInfo.notes;
//         if (updatedFields.orderInfo.total !== undefined)
//           payload.total_amount = parseFloat(updatedFields.orderInfo.total);
//         if (updatedFields.orderInfo.updatedAt !== undefined)
//           payload.updated_at = updatedFields.orderInfo.updatedAt;
//       }

//       const res = await fetch(`/api/orders/${orderId}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload),
//       });

//       const result = await res.json();

//       if (!res.ok) throw new Error(result.error || "Failed to update order");

//       // Re-fetch updated order to sync state
//       await get().fetchOrder(orderId);
//     } catch (err: any) {
//       set({ error: err.message, loading: false });
//     }
//   },
//   deleteOrder: async (orderId) => {
//     set({ loading: true, error: null });
//     try {
//       const res = await fetch(`/api/orders/${orderId}`, {
//         method: "DELETE",
//       });

//       const result = await res.json();
//       if (!res.ok) throw new Error(result.error || "Failed to delete order");

//       set({ order: null, loading: false });
//     } catch (err: any) {
//       set({ error: err.message, loading: false });
//     }
//   }

// }));



// stores/orderAdminStore.ts
import { create } from "zustand";
import axios from "axios";

/** ---------- Types ---------- **/
type OrderItem = {
  id: string;
  products: {
    id: string;
    name: string;
    image_1: string | null;
    price: number;
  };
  quantity: number;
  price_at_purchase: number;
  custom_data: any;
  selected_variant_name: string | null;
};

type Order = {
  id: string;
  customerName: string;
  recipientName: string | null;
  deliveryDate: string | null;
  total: string; // UI-friendly, already formatted: "123.45"
  status: string;
  paymentStatus?: string | null;
  orderItems?: OrderItem[];
  personalization?: any[];
  notes?: string | null;
  createdAt?: string | null;
  updatedAt?: string | null;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type OrdersState = {
  orders: Order[];
  loading: boolean;
  updatingOrderId: string | null;
  pagination: Pagination | null;
  fetchOrders: (
    filters?: Record<string, string>,
    page?: number,
    limit?: number
  ) => Promise<void>;
  updateOrderStatus: (orderId: string, newStatus: string) => Promise<boolean>;
};

/** ---------- List Store ---------- **/
export const useOrdersStore = create<OrdersState>((set, get) => ({
  orders: [],
  loading: true,
  updatingOrderId: null,
  pagination: null,

  fetchOrders: async (filters: Record<string, string> = {}, page = 1, limit = 10) => {
    set({ loading: true });
    try {
      const queryParams = new URLSearchParams({
        ...filters,
        page: String(page),
        limit: String(limit),
      }).toString();

      const res = await axios.get(`/api/orders?${queryParams}`);

      const rows = Array.isArray(res.data?.data) ? res.data.data : [];

      const mappedOrders: Order[] = rows.map((order: any) => ({
        id: order.id,
        customerName: order.customer_name || "Unknown",
        recipientName: order.recipient_name ?? null,
        deliveryDate: order.delivery_date ?? null,
        total:
          typeof order.total_amount === "number"
            ? order.total_amount.toFixed(2)
            : "0.00",
        status: order.status,
        paymentStatus: order.payment_status ?? null,
        orderItems: Array.isArray(order.order_items) ? order.order_items : [],
        personalization: order.personalization ?? [],
        notes: order.notes ?? null,
        createdAt: order.created_at ?? null,
        updatedAt: order.updated_at ?? null,
      }));

      set({
        orders: mappedOrders,
        loading: false,
        pagination: res.data?.pagination ?? null,
      });
    } catch (e) {
      console.error("Failed to fetch orders:", e);
      set({ loading: false });
    }
  },

  updateOrderStatus: async (orderId: string, newStatus: string) => {
    set({ updatingOrderId: orderId });
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        const body = await response.json().catch(() => ({}));
        throw new Error(body?.error || "Failed to update order status");
      }

      const updatedOrders = get().orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );

      set({ orders: updatedOrders, updatingOrderId: null });
      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      set({ updatingOrderId: null });
      return false;
    }
  },
}));

/** ---------- Details Types ---------- **/
interface OrderDetailsItem {
  id: string;
  products: {
    id: string;
    name: string;
    image_1: string | null;
    image_2?: string | null;
    image_3?: string | null;
    price: number;
    description?: string | null;
    category?: string | null;
    why_we_chose_it?: string | null;
    about_the_maker?: string | null;
    particulars?: string | null;
  };
  quantity: number;
  price_at_purchase: number;
  custom_data: any;
  selected_variant_name: string | null;
}

interface OrderDetails {
  id: string;
  customerInfo: {
    name: string;
    email: string | null;
  };
  recipientInfo: {
    name: string | null;
    address: string | null;
  };
  orderInfo: {
    deliveryDate: string | null;
    total: string; // keep as string for UI (e.g., "123.45")
    status: string;
    notes: string | null;
    placedAt: string;
    paymentStatus: string | null;
    updatedAt: string;
    preferredDeliveryTime?: string | null;
  };
  orderItems: OrderDetailsItem[];
  personalization: any[];
}

interface OrderDetailsState {
  order: OrderDetails | null;
  loading: boolean;
  error: string | null;
  fetchOrder: (orderId: string) => Promise<void>;
  updateOrder: (orderId: string, updatedFields: Partial<OrderDetails>) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
}

/** ---------- Details Store ---------- **/
export const useOrderDetailsStore = create<OrderDetailsState>((set, get) => ({
  order: null,
  loading: false,
  error: null,

  fetchOrder: async (orderId: string) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const result = await res.json();

      if (!res.ok) throw new Error(result?.error || "Failed to fetch order");

      const order = result.data;
      console.log("Personalization:", order.personalization);

      const orderDetails: OrderDetails = {
        id: order.id,
        customerInfo: {
          name: order.customer_name ?? "Unknown",
          email: order.customer_email ?? null,
        },
        recipientInfo: {
          name: order.recipient_name ?? null,
          address: order.recipient_address ?? null,
        },
        orderInfo: {
          deliveryDate: order.delivery_date ?? null,
          total:
            typeof order.total_amount === "number"
              ? order.total_amount.toFixed(2)
              : "0.00",
          status: order.status,
          notes: order.notes ?? null,
          placedAt: order.created_at,
          paymentStatus: order.payment_status ?? null,
          updatedAt: order.updated_at,
        },
        orderItems: Array.isArray(order.order_items) ? order.order_items : [],
        personalization: order.personalization ?? [],
      };

      set({ order: orderDetails, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updateOrder: async (orderId, updatedFields) => {
    set({ loading: true, error: null });

    try {
      const payload: Record<string, any> = {};

      if (updatedFields.customerInfo) {
        if (updatedFields.customerInfo.name !== undefined)
          payload.customer_name = updatedFields.customerInfo.name;
        if (updatedFields.customerInfo.email !== undefined)
          payload.customer_email = updatedFields.customerInfo.email;
      }

      if (updatedFields.recipientInfo) {
        if (updatedFields.recipientInfo.name !== undefined)
          payload.recipient_name = updatedFields.recipientInfo.name;
        if (updatedFields.recipientInfo.address !== undefined)
          payload.recipient_address = updatedFields.recipientInfo.address;
      }

      if (updatedFields.orderInfo) {
        const oi = updatedFields.orderInfo;
        if (oi.deliveryDate !== undefined) payload.delivery_date = oi.deliveryDate;
        if (oi.status !== undefined) payload.status = oi.status;
        if (oi.notes !== undefined) payload.notes = oi.notes;

        if (oi.total !== undefined) {
          // be safe with formatted strings like "1,234.56"
          const num = Number(String(oi.total).replace(/,/g, ""));
          if (!Number.isNaN(num)) payload.total_amount = num;
        }
        if (oi.updatedAt !== undefined) payload.updated_at = oi.updatedAt;
      }

      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Failed to update order");

      // Re-sync
      await get().fetchOrder(orderId);
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  deleteOrder: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      const result = await res.json();
      if (!res.ok) throw new Error(result?.error || "Failed to delete order");

      set({ order: null, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
