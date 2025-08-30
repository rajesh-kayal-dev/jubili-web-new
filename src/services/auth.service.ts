import { AuthResponse, LoginCredentials, SignupCredentials } from '../lib/types/auth';
import { API_ENDPOINTS } from '../lib/constants/api';

// New interface for signup response (different from login)
interface SignupResponse {
  message: string;
  email: string;
}

class AuthService {
  private baseUrl: string;

  constructor() {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) {
      throw new Error('API URL not found in environment variables');
    }
    this.baseUrl = baseUrl;
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      const queryParams = new URLSearchParams({
        email: credentials.email,
        password: credentials.password
      });
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.AUTH.LOGIN}?${queryParams}`, {
        method: 'GET',
        credentials: 'include', // Include cookies
      });      
      if (!response.ok) {
        const error = await response.json(); 
        throw new Error(error.message || 'Failed to login');
      }
      const data: AuthResponse = await response.json();      
      return data;
    } catch (error) {
      throw error;
    }
  }

  async signup(credentials: SignupCredentials): Promise<SignupResponse> {
    try {
      const response = await fetch(`${this.baseUrl}${API_ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', // Include cookies for future requests
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to sign up');
      }

      const data: SignupResponse = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  async verifyEmail(token: string): Promise<AuthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/api/users/verify?token=${token}`, {
        method: 'GET',
        credentials: 'include', // Important for cookies
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Email verification failed');
      }

      const data: AuthResponse = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  }

  logout(): void {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  }
}

export const authService = new AuthService();