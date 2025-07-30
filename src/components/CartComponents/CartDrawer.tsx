'use client';

import { useState } from 'react';
import { useMainStore } from '@/store/mainStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { ShoppingCart, X, Plus, Minus, ShoppingBagIcon } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export function CartDrawer() {
  const { 
    cartItems, 
    cartTotal, 
    cartItemCount,
    products,
    updateCartItem,
    removeFromCart,
    cartLoading
  } = useMainStore();
  
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const cartItemsWithProducts = cartItems.map(item => {
    const product = products.find(p => p.id === item.product_id);
    return {
      ...item,
      product
    };
  }).filter(item => item.product);

  const handleViewCart = () => {
    setIsOpen(false);
    router.push('/cart');
  };

  const handleCheckout = () => {
    setIsOpen(false);
    router.push('/checkout');
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    await updateCartItem(itemId, newQuantity);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="sm" className="relative">
          <ShoppingBagIcon className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      
      <SheetContent className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5" />
            <span>Cart ({cartItemCount})</span>
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 flex flex-col h-full">
          {cartItems.length === 0 ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center space-y-4">
                <ShoppingCart className="h-12 w-12 text-block-300 mx-auto" />
                <p className="text-block-500">Your cart is empty</p>
                <Button onClick={() => setIsOpen(false)}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto space-y-4">
                {cartItemsWithProducts.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-16 h-16 relative bg-block-100 rounded-md overflow-hidden flex-shrink-0">
                      {item.product?.image_1 ? (
                        <Image
                          src={item.product.image_1}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-block-200">
                          <span className="text-block-400 text-xs">No Image</span>
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm truncate">{item.product?.name}</h4>
                      <p className="text-xs text-block-500">
                        ${item.product?.price ? (item.product.price / 100).toFixed(2) : '0.00'} each
                      </p>
                      
                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-2 mt-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id!, item.quantity - 1)}
                          disabled={item.quantity <= 1 || cartLoading}
                          className="h-6 w-6 p-0"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        
                        <span className="text-sm font-medium w-8 text-center">
                          {item.quantity}
                        </span>
                        
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleUpdateQuantity(item.id!, item.quantity + 1)}
                          disabled={cartLoading}
                          className="h-6 w-6 p-0"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Remove Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCart(item.id!)}
                      disabled={cartLoading}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span>${(cartTotal / 100).toFixed(2)}</span>
                </div>

                <div className="space-y-2">
                  <Button onClick={handleViewCart} variant="outline" className="w-full">
                    View Cart
                  </Button>
                  <Button onClick={handleCheckout} className="w-full">
                    Checkout
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
