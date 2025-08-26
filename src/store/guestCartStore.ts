import { Product } from "@/app/api/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface GuestCartItem {
  id: string; // temporary local ID
  product_id: string;
  quantity: number;
  custom_data?: Record<string, any>;
  selected_variant_name?: string;
  added_at: string;
}

interface GuestCartStore {
  items: GuestCartItem[];
  isGuestMode: boolean;

  // Actions
  addItem: (productId: string, quantity: number, customData?: Record<string, any>, selected_variant_name?: string) => void;
  updateItem: (localId: string, quantity: number, customData?: Record<string, any>) => void;
  removeItem: (localId: string) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getTotal: (products: Product[]) => number;

  // Helper functions
  findItemByProductId: (productId: string, selected_variant_name?: string) => GuestCartItem | undefined;
  generateLocalId: () => string;

  // Migration functions
  migrateToUserCart: (userCartFunction: (items: GuestCartItem[]) => Promise<void>) => Promise<void>;
  mergeWithUserCart: (userItems: any[]) => void;
}

export const useGuestCartStore = create<GuestCartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isGuestMode: true,

      addItem: (productId, quantity, customData, selected_variant_name) => {
        const existingItem = get().findItemByProductId(productId, selected_variant_name);

        if (existingItem && !customData) {
          set(state => ({
            items: state.items.map(item =>
              item.id === existingItem.id
                ? { ...item, quantity: item.quantity + quantity }
                : item
            )
          }));
        } else {
          const newItem: GuestCartItem = {
            id: get().generateLocalId(),
            product_id: productId,
            quantity,
            custom_data: customData,
            selected_variant_name,                // ✅ stays
            added_at: new Date().toISOString(),
          };
          set(state => ({ items: [...state.items, newItem] }));
        }
      },


      updateItem: (localId: string, quantity: number, customData?: Record<string, any>) => {
        if (quantity <= 0) {
          get().removeItem(localId);
          return;
        }

        set(state => ({
          items: state.items.map(item =>
            item.id === localId
              ? { ...item, quantity, custom_data: customData || item.custom_data }
              : item
          )
        }));
      },

      removeItem: (localId: string) => {
        set(state => ({
          items: state.items.filter(item => item.id !== localId)
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      getItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotal: (products: Product[]) => {
        return get().items.reduce((total, item) => {
          const product = products.find(p => p.id === item.product_id);
          return total + (product?.price || 0) * item.quantity;
        }, 0);
      },

      // findItemByProductId: (productId: string) => {
      //   return get().items.find(item =>
      //     item.product_id === productId && !item.custom_data
      //   );
      // },
      findItemByProductId: (productId: string, selected_variant_name?: string) => {
        return get().items.find(item =>
          item.product_id === productId &&
          !item.custom_data &&
          item.selected_variant_name === selected_variant_name
        );
      },

      generateLocalId: () => {
        return `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      },

      migrateToUserCart: async (userCartFunction: (items: GuestCartItem[]) => Promise<void>) => {
        const items = get().items;
        if (items.length > 0) {
          await userCartFunction(items);
          get().clearCart();
        }
        set({ isGuestMode: false });
      },

      mergeWithUserCart: (userItems: any[]) => {
        // This function is called when user logs in with existing cart
        // We keep both guest items and user items, but clear guest storage
        // The actual merging will be handled by the backend
        set({ items: [], isGuestMode: false });
      },
    }),
    {
      name: 'guest-cart-storage',
      partialize: (state) => ({
        items: state.items,
        isGuestMode: state.isGuestMode,
      }),
    }
  )
);
