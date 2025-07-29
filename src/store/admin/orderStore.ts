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




// useOrderDetailsStore

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
  };
}

interface OrderDetailsState {
  order: OrderDetails | null;
  loading: boolean;
  error: string | null;
  fetchOrder: (orderId: string) => Promise<void>;
}

export const useOrderDetailsStore = create<OrderDetailsState>((set) => ({
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
            total: order.total_price,
            status: order.status,
          },
        },
        loading: false,
      });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
