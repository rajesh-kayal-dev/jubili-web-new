import { useState, useCallback } from 'react';
import { userActionsService } from '@/services/userActions.service';
import { CartResponse, CartAction, CartDelete } from '@/lib/types/cart';
import { useAuth } from './useAuth';

interface UseCartReturn {
  cart: CartResponse | null;
  loading: boolean;
  error: string | null;
  fetchCart: () => Promise<CartResponse | null>;
  refetch: () => Promise<void>;
  addToCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, newQuantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
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

  const updateQuantity = useCallback(async (productId: string, newQuantity: number) => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    if (newQuantity < 1) {
      setError('Quantity must be at least 1');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cartAction: CartAction = {
        userId,
        actionType: 'CART',
        productId,
        quantity: newQuantity.toString()
      };

      await userActionsService.addToCart(cartAction);
      await fetchCart(); // Refresh cart after updating quantity
    } catch (err) {
      console.error('Failed to update quantity:', err);
      setError('Failed to update quantity');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, fetchCart]);

  const removeFromCart = useCallback(async (productId: string) => {
    if (!userId) {
      setError('User not authenticated');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Set quantity to 0 to remove the item
      const cartDelete: CartDelete = {
        userId,
        actionType: 'CART',
        productId,
      };

      await userActionsService.deleteCart(cartDelete);
      await fetchCart(); // Refresh cart after removing item
    } catch (err) {
      console.error('Failed to remove from cart:', err);
      setError('Failed to remove from cart');
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
    addToCart,
    updateQuantity,
    removeFromCart,
  };
};