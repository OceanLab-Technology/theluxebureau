'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingBag, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export function EmptyCart() {
  const router = useRouter();

  const handleStartShopping = () => {
    router.push('/products');
  };

  return (
    <div className="max-w-md mx-auto">
      <Card>
        <CardContent className="pt-6">
          <div className="text-center space-y-6">
            {/* Empty Cart Icon */}
            <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
              <ShoppingBag className="h-12 w-12 text-gray-400" />
            </div>

            {/* Empty Cart Message */}
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
              <p className="text-gray-600">
                Looks like you haven't added any items to your cart yet. 
                Start exploring our products and add some items you love.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={handleStartShopping}
                className="w-full"
                size="lg"
              >
                Start Shopping
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              
              <div className="text-sm text-gray-500">
                Or browse our featured products below
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
