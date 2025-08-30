"use client";
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useToastActions } from '@/hooks/useToastActions';

interface VerificationResponse {
  message: string;
  user?: {
    userId: string;
    name: string;
    email: string;
    phone: string;
  };
  token?: string;
}

export default function EmailVerificationPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('Verifying your email address...');
  const [isRedirecting, setIsRedirecting] = useState(false);
  
  const searchParams = useSearchParams();
  const router = useRouter();
  const { showSuccess, showError } = useToastActions();
  
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('Invalid verification link. No token provided.');
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
      const response = await fetch(`${baseUrl}/api/users/verify?token=${verificationToken}`, {
        method: 'GET',
        credentials: 'include', // Important for cookies
      });
      
      const data: VerificationResponse = await response.json();
      
      if (response.ok) {
        setStatus('success');
        setMessage('Email verified successfully! You are now logged in.');
        
        // Store user data in localStorage (similar to login flow)
        if (data.user && data.token) {
          localStorage.setItem('auth_token', data.token);
          localStorage.setItem('user_info', JSON.stringify(data.user));
        }
        
        showSuccess('Email Verified!', 'Welcome to Jubili! You are now logged in.');
        
        // Redirect to home page after 2 seconds
        setIsRedirecting(true);
        setTimeout(() => {
          router.push('/');
        }, 2000);
        
      } else {
        setStatus('error');
        setMessage(data.message || 'Email verification failed');
        showError('Verification Failed', data.message || 'Please try signing up again.');
      }
    } catch (error) {
      console.error('Verification error:', error);
      setStatus('error');
      setMessage('Something went wrong during verification. Please try again.');
      showError('Verification Error', 'Network error occurred. Please check your connection.');
    }
  };

  const handleResendSignup = () => {
    router.push('/signup');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
        
        {/* Verification Status Icons */}
        <div className="mb-6">
          {status === 'verifying' && (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
              <svg className="animate-spin w-8 h-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
              </svg>
            </div>
          )}
          
          {status === 'success' && (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
          )}
          
          {status === 'error' && (
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
          )}
        </div>

        {/* Status Headers */}
        <div className="mb-4">
          {status === 'verifying' && (
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Verifying Email</h1>
          )}
          {status === 'success' && (
            <h1 className="text-2xl font-bold text-green-600 mb-2">Email Verified!</h1>
          )}
          {status === 'error' && (
            <h1 className="text-2xl font-bold text-red-600 mb-2">Verification Failed</h1>
          )}
        </div>

        {/* Status Messages */}
        <p className={`text-lg mb-6 ${
          status === 'success' ? 'text-green-700' : 
          status === 'error' ? 'text-red-700' : 
          'text-gray-600'
        }`}>
          {message}
        </p>

        {/* Action Buttons */}
        <div className="space-y-3">
          {status === 'success' && (
            <>
              <div className={`transition-all duration-300 ${isRedirecting ? 'opacity-50' : ''}`}>
                <p className="text-sm text-gray-500 mb-3">
                  {isRedirecting ? 'Redirecting to home page...' : 'You will be redirected shortly'}
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                  disabled={isRedirecting}
                >
                  {isRedirecting ? 'Redirecting...' : 'Continue to Home'}
                </button>
              </div>
            </>
          )}
          
          {status === 'error' && (
            <div className="space-y-3">
              <button
                onClick={handleResendSignup}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Try Signing Up Again
              </button>
              <button
                onClick={() => router.push('/login')}
                className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Go to Login
              </button>
            </div>
          )}
          
          {status === 'verifying' && (
            <p className="text-sm text-gray-500">
              This should only take a moment...
            </p>
          )}
        </div>

        {/* Help Text */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Having trouble? Contact us at{' '}
            <a href="mailto:support@jubili.in" className="text-blue-600 hover:underline">
              support@jubili.in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}