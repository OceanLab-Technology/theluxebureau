// stores/orderAdminStore.ts
import { create } from "zustand";
import axios from "axios";

type Order = {
  id: string;
  customerName: string;
  recipientName: string;
  deliveryDate: string;
  total: string;
  status: string;
  paymentStatus?: string;
  orderItems?: Array<{
    id: string;
    products: {
      id: string;
      name: string;
      image_1: string;
      price: number;
    };
    quantity: number;
    price_at_purchase: number;
    custom_data: any;
  }>;
  personalization?: any[];
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
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

      const mappedOrders: Order[] = res.data.data.map((order: any) => ({
        id: order.id,
        customerName: order.customer_name || "Unknown",
        recipientName: order.recipient_name || "",
        deliveryDate: order.delivery_date || "",
        total: order.total_amount ? order.total_amount.toFixed(2) : "0.00",
        status: order.status,
        paymentStatus: order.payment_status,
        orderItems: order.order_items || [],
        personalization: order.personalization || [],
        notes: order.notes,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
      }));

      set({
        orders: mappedOrders,
        loading: false,
        pagination: res.data.pagination,
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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update order status");
      }

      const currentOrders = get().orders;
      const updatedOrders = currentOrders.map(order => 
        order.id === orderId 
          ? { ...order, status: newStatus }
          : order
      );

      set({ 
        orders: updatedOrders,
        updatingOrderId: null 
      });

      return true;
    } catch (error) {
      console.error("Error updating order status:", error);
      set({ updatingOrderId: null });
      return false;
    }
  },
}));




interface OrderDetails {
  id: string;
  customerInfo: {
    name: string;
    email: string;
  };
  recipientInfo: {
    name: string;
    address: string;
  };
  orderInfo: {
    deliveryDate: string;
    total: string;
    status: string;
    notes: string;
    placedAt: string;
    paymentStatus: string;
    updatedAt: string;
  };
  orderItems: Array<{
    id: string;
    products: {
      id: string;
      name: string;
      image_1: string;
      image_2?: string;
      image_3?: string;
      price: number;
      description?: string;
      category?: string;
      why_we_chose_it?: string;
      about_the_maker?: string;
      particulars?: string;
    };
    quantity: number;
    price_at_purchase: number;
    custom_data: any;
  }>;
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

export const useOrderDetailsStore = create<OrderDetailsState>((set, get) => ({
  order: null,
  loading: false,
  error: null,

  fetchOrder: async (orderId: string) => {
    set({ loading: true, error: null });

    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Failed to fetch order");

      const order = result.data;

      set({
        order: {
          id: order.id,
          customerInfo: {
            name: order.customer_name,
            email: order.customer_email,
          },
          recipientInfo: {
            name: order.recipient_name,
            address: order.recipient_address,
          },
          orderInfo: {
            deliveryDate: order.delivery_date,
            total: order.total_amount,
            status: order.status,
            notes: order.notes,
            placedAt: order.created_at,
            paymentStatus: order.payment_status,
            updatedAt: order.updated_at
          },
          orderItems: order.order_items || [],
          personalization: order.personalization || [],
        },
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  updateOrder: async (orderId, updatedFields) => {
    set({ loading: true, error: null });

    try {
      const payload: any = {};

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
        if (updatedFields.orderInfo.deliveryDate !== undefined)
          payload.delivery_date = updatedFields.orderInfo.deliveryDate;
        if (updatedFields.orderInfo.status !== undefined)
          payload.status = updatedFields.orderInfo.status;
        if (updatedFields.orderInfo.notes !== undefined)
          payload.notes = updatedFields.orderInfo.notes;
        if (updatedFields.orderInfo.total !== undefined)
          payload.total_amount = parseFloat(updatedFields.orderInfo.total);
        if (updatedFields.orderInfo.updatedAt !== undefined)
          payload.updated_at = updatedFields.orderInfo.updatedAt;
      }

      const res = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Failed to update order");

      // Re-fetch updated order to sync state
      await get().fetchOrder(orderId);
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
  deleteOrder: async (orderId) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.error || "Failed to delete order");

      set({ order: null, loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  }

}));
