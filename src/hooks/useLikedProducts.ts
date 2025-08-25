import { useState, useEffect, useCallback } from 'react';
import { Product } from '@/lib/types/product';
import { getLikedProducts, toggleProductLike } from '@/services/product.service';
import { useAuth } from './useAuth';
import { useToastActions } from './useToastActions';

interface UseLikedProductsReturn {
  likedProducts: Product[];
  loading: boolean;
  error: string | null;
  handleUnlike: (productId: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export const useLikedProducts = (): UseLikedProductsReturn => {
  const [likedProducts, setLikedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const {showInfo} = useToastActions();

  const fetchLikedProducts = useCallback(async () => {
    if (!token) {
      setError('Please login to view liked products');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getLikedProducts(token);
      setLikedProducts(data || []);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to fetch liked products';
      setError(errorMessage);
      console.error('Error fetching liked products:', err);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchLikedProducts();
  }, [fetchLikedProducts]);

  const handleUnlike = useCallback(async (productId: string): Promise<void> => {
    if (!token) {
      setError('Please login to unlike products');
      return;
    }

    if (!productId) {
      setError('Invalid product ID');
      return;
    }

    try {
      // Optimistic update
      setLikedProducts((prev) => 
        prev.filter((item) => item.productId !== productId)
      );
      
      await toggleProductLike(productId, token);
      setError(null);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : 'Failed to unlike product';
      setError(errorMessage);
      
      // Revert optimistic update on error
      await fetchLikedProducts();
      
      console.error('Error unliking product:', err);
    }
  }, [token, fetchLikedProducts]);

  const refetch = useCallback(async (): Promise<void> => {
    await fetchLikedProducts();
  }, [fetchLikedProducts]);

  return {
    likedProducts,
    loading,
    error,
    handleUnlike,
    refetch,
  };
};