'use client';

import { useMainStore } from '@/store/mainStore';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function CartIcon() {
  const { 
    cartItemCount, 
    fetchCartItems 
  } = useMainStore();
  
  const router = useRouter();

  useEffect(() => {
    // Fetch cart items when component mounts
    fetchCartItems();
  }, [fetchCartItems]);

  const handleCartClick = () => {
    router.push('/cart');
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleCartClick}
      className="relative"
    >
      CART ({cartItemCount})
    </Button>
  );
}
