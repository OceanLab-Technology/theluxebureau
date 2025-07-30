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
};

type OrdersState = {
  orders: Order[];
  loading: boolean;
  fetchOrders: () => Promise<void>;
};

export const useOrdersStore = create<OrdersState>((set) => ({
  orders: [],
  loading: true,
  fetchOrders: async () => {
    set({ loading: true });
    try {
      const res = await axios.get("/api/orders");

      const mappedOrders: Order[] = res.data.data.map((order: any) => ({
        id: order.id,
        customerName: order.customer_name || "Unknown",
        recipientName: order.recipient_name || "",
        deliveryDate: order.delivery_date || "",
        total: order.total_amount.toFixed(2),
        status: order.status,
      }));

      set({ orders: mappedOrders, loading: false });
    } catch (e) {
      console.error("Failed to fetch orders:", e);
      set({ loading: false });
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
    // productDetails: any[];
    // personalization: any[];
    updatedAt: string;
  };
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
            paymentStatus: order.paymentStatus,
            // productDetails: order.product_details,
            // personalization: order.personalization,
            updatedAt: order.updated_at
          },
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
