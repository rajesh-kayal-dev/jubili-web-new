//src/hooks/useProduct.ts
import { useCallback, useEffect, useState } from 'react';
import { Product } from '@/lib/types/product';
import { getProductById } from '@/services/product.service';

export function useProduct(productId: string | null, token?: string) {
  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchProduct = useCallback(async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await getProductById(id, token);
      setProduct(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to fetch product';
      setError(message);
      setProduct(null);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (productId) {
      fetchProduct(productId);
    } else {
      setProduct(null);
      setError(null);
    }
  }, [productId, fetchProduct]);

  const handleLikeToggle = useCallback((productId: string, isLiked: boolean) => {
    setProduct(prevProduct => 
      prevProduct && prevProduct.productId === productId 
        ? { 
            ...prevProduct, 
            isLiked, 
            likeCount: isLiked ? prevProduct.likeCount + 1 : prevProduct.likeCount - 1 
          }
        : prevProduct
    );
  }, []);

  return {
    isLoading,
    product,
    error,
    handleLikeToggle,
    retry: () => (productId ? fetchProduct(productId) : undefined),
  };
}


