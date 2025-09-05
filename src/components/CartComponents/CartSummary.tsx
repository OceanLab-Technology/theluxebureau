// "use client";

// import { useCartStore } from "@/store/cartStore";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/hooks/use-auth";
// import { useAuthenticatedNavigation } from "@/hooks/use-authenticated-navigation";
// import { LoginRequiredModal } from "@/components/ui/login-required-modal";
// import { useMainStore } from "@/store/mainStore";

// interface CartSummaryProps {
//   onClose?: () => void;
// }

// export function CartSummary({ onClose }: CartSummaryProps) {
//   const { user } = useAuth();
//   const { navigateWithAuth, showLoginModal, handleCloseModal, featureName } = useAuthenticatedNavigation();

//   const cartItems = useMainStore(s => s.cartItems);
//   const cartTotal = useMainStore(s => s.cartTotal);
//   const cartLoading = useMainStore(s => s.cartLoading);
//   const checkInventoryAvailability = useMainStore(s => s.checkInventoryAvailability);
//   const subtotal = useMainStore(s => s.getCartTotal());

//   const handleCheckout = async () => {
//     const inventoryAvailable = await checkInventoryAvailability();

//     if (!inventoryAvailable) {
//       return;
//     }

//     navigateWithAuth("/checkout", "proceed to checkout");

//     if (onClose && user) {
//       onClose();
//     }
//   };

//   if (cartItems.length === 0) {
//     return null;
//   }

//   return (
//     <>
//       <div className="flex justify-between items-end">
//         <div className="md:flex-grow">
//           <span className="md:text-lg font-medium">SUBTOTAL</span>
//           <div className="flex justify-between items-center text-xl font-medium mb-8">
//             {/* <span>£{cartTotal.toFixed(2)}</span> */}
//             <span>£{subtotal.toFixed(2)}</span>
//           </div>
//         </div>

//         <div className="ml-8 md:pb-0 pb-10">
//           <Button
//             onClick={handleCheckout}
//             disabled={cartLoading || cartItems.length === 0}
//             className="md:px-22 md:py-6 rounded-[0.25rem] bg-[#FBD060] hover:bg-[#FBD060]/80 text-stone-700 font-medium uppercase tracking-wider"
//           >
//             CHECKOUT
//           </Button>
//         </div>
//       </div>

//       <LoginRequiredModal
//         isOpen={showLoginModal}
//         onClose={handleCloseModal}
//         onCloseCartSheet={onClose}
//         feature={featureName}
//       />
//     </>
//   );
// }


// "use client";

// import { useCartStore } from "@/store/cartStore";
// import { Button } from "@/components/ui/button";
// import { useRouter } from "next/navigation";
// import { useAuth } from "@/hooks/use-auth";
// import { useAuthenticatedNavigation } from "@/hooks/use-authenticated-navigation";
// import { LoginRequiredModal } from "@/components/ui/login-required-modal";
// import { useMainStore } from "@/store/mainStore";

// interface CartSummaryProps {
//   onClose?: () => void;
// }

// export function CartSummary({ onClose }: CartSummaryProps) {
//   const { user } = useAuth();
//   const { navigateWithAuth, showLoginModal, handleCloseModal, featureName } = useAuthenticatedNavigation();

//   const cartItems = useMainStore(s => s.cartItems);
//   const cartTotal = useMainStore(s => s.cartTotal); // <- use state
//   const cartLoading = useMainStore(s => s.cartLoading);
//   const checkInventoryAvailability = useMainStore(s => s.checkInventoryAvailability);

//   const products = useMainStore(s => s.products); // grab products for debugging

//   // Quick subtotal calculation check
//   const debugSubtotal = cartItems.reduce((total, item) => {
//     const product = products.find(p => p.id === item.product_id);
//     const price = product?.price ?? 0;
//     return total + price * item.quantity;
//   }, 0);

//   console.log("debugSubtotal:", debugSubtotal);
//   console.log("cartTotal from store:", cartTotal);


//   const handleCheckout = async () => {
//     const inventoryAvailable = await checkInventoryAvailability();

//     if (!inventoryAvailable) {
//       return;
//     }

//     navigateWithAuth("/checkout", "proceed to checkout");

//     if (onClose && user) {
//       onClose();
//     }
//   };

//   if (cartItems.length === 0) {
//     return null;
//   }

//   return (
//     <>
//       <div className="flex justify-between items-end">
//         <div className="md:flex-grow">
//           <span className="md:text-lg font-medium">SUBTOTAL</span>
//           <div className="flex justify-between items-center text-xl font-medium mb-8">
//             <span>£{cartTotal.toFixed(2)}</span> {/* <- only cartTotal */}
//           </div>
//         </div>

//         <div className="ml-8 md:pb-0 pb-10">
//           <Button
//             onClick={handleCheckout}
//             disabled={cartLoading || cartItems.length === 0}
//             className="md:px-22 md:py-6 rounded-[0.25rem] bg-[#FBD060] hover:bg-[#FBD060]/80 text-stone-700 font-medium uppercase tracking-wider"
//           >
//             CHECKOUT
//           </Button>
//         </div>
//       </div>

//       <LoginRequiredModal
//         isOpen={showLoginModal}
//         onClose={handleCloseModal}
//         onCloseCartSheet={onClose}
//         feature={featureName}
//       />
//     </>
//   );
// }



"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useAuthenticatedNavigation } from "@/hooks/use-authenticated-navigation";
import { LoginRequiredModal } from "@/components/ui/login-required-modal";
import { useMainStore } from "@/store/mainStore";

interface CartSummaryProps {
  onClose?: () => void;
}

export function CartSummary({ onClose }: CartSummaryProps) {
  const { user } = useAuth();
  const { navigateWithAuth, showLoginModal, handleCloseModal, featureName } = useAuthenticatedNavigation();

  const checkInventoryAvailability = useMainStore(s => s.checkInventoryAvailability);

  const cartItems = useMainStore(s => s.cartItems);
  const products = useMainStore(s => s.products);
  const cartTotal = useMainStore(s => s.cartTotal);
  const cartLoading = useMainStore(s => s.cartLoading);

  // Fallback subtotal calculation in case store's cartTotal is not yet calculated
  const subtotalFallback = cartItems.reduce((acc, item) => {
    const p = products.find(pp => pp.id === item.product_id);
    return acc + (p?.price ?? 0) * item.quantity;
  }, 0);

  // Prefer store cartTotal if it's available (> 0), otherwise use fallback
  const displayTotal = cartTotal && cartTotal > 0 ? cartTotal : subtotalFallback;

  const handleCheckout = async () => {
    const inventoryAvailable = await checkInventoryAvailability();

    if (!inventoryAvailable) {
      return;
    }

    navigateWithAuth("/checkout", "proceed to checkout");

    if (onClose && user) {
      onClose();
    }
  };

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <>
      <div className="flex justify-between items-end">
        <div className="md:flex-grow">
          <span className="md:text-lg font-medium">SUBTOTAL</span>
          <div className="flex justify-between items-center text-xl font-medium mb-8">
            <span>£{displayTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="ml-8 md:pb-0 pb-10">
          <Button
            onClick={handleCheckout}
            disabled={cartLoading || cartItems.length === 0}
            className="md:px-22 md:py-6 rounded-[0.25rem] bg-[#FBD060] hover:bg-[#FBD060]/80 text-stone-700 font-medium uppercase tracking-wider"
          >
            CHECKOUT
          </Button>
        </div>
      </div>

      <LoginRequiredModal
        isOpen={showLoginModal}
        onClose={handleCloseModal}
        onCloseCartSheet={onClose}
        feature={featureName}
      />
    </>
  );
}
