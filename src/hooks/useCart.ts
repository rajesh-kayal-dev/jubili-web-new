import { useState, useCallback } from 'react';
import { userActionsService } from '@/services/userActions.service';
import { CartResponse, CartAction } from '@/lib/types/cart';
import { useAuth } from './useAuth';

interface UseCartReturn {
  cart: CartResponse | null;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<CartResponse | null>;
  refetch: () => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
}

export const useCart = (): UseCartReturn => {
  const { userId } = useAuth();
  const [cart, setCart] = useState<CartResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = useCallback(async (): Promise<CartResponse | null> => {
    if (!userId) {
      setError('User not authenticated');
      setLoading(false);
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const cartData = await userActionsService.getCart(userId);
      setCart(cartData);
      return cartData;
    await fetchCart();
    } catch (err) {
      console.error('Error fetching cart:', err);
      setError('Failed to fetch cart');
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const addToCart = useCallback(async (productId: string) => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cartAction: CartAction = {
        userId,
        actionType: 'CART',
        productId,
        quantity: "1"
      };

      const response = await userActionsService.addToCart(cartAction);
      console.log('Product added to cart:', response);
      await fetchCart(); // Refresh cart after adding item
    } catch (err) {
      console.error('Failed to add product to cart:', err);
      setError('Failed to add product to cart');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchCart]);

  const refetch = useCallback(async () => {
    await fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    error,
    fetchCart,
    refetch,
    addToCart,}
  };