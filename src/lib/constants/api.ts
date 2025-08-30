export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/users/login',
    REGISTER: '/api/users/signup',
    VERIFY: '/api/users/verify',
    LOGOUT: '/api/users/logout',
  },
  PRODUCTS: {
    SEARCH: '/api/products/search-products',
    LIKE: '/api/products/like',
    // Product details endpoint expects a query param: ?id={productId}
    DETAIL: '/api/products',
  },
  USER_ACTIONS: {
    BASE: '/api/user-actions',
    LIKED_PRODUCTS: '/api/user-actions/liked-products',
    CART: (userId: string) => `/api/user-actions/cart?userId=${userId}`,
    // DY_CART_RTE: '/api/user-actions',
    // DELETE_CART: '/api/user-actions'
  },
} as const;