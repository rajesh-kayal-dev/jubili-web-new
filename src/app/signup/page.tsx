"use client";
import { useState } from "react";
// import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function SignupPage() {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const { signup, loading, error: authError } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await signup({
        fullname,
        email,
        phone,
        password
      });
      // Set success state to show verification message
      setIsSuccess(true);
    } catch (err) {
      console.error('Signup failed:', err);
    }
  };

  // Show success message after signup
  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-md w-full bg-white shadow-lg rounded-2xl p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 7.89a1 1 0 001.42 0L21 7M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
            </svg>
          </div>
          
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Check Your Email!</h1>
          
          <p className="text-gray-600 mb-6">
            We&apos;ve sent a verification email to <strong>{email}</strong>. 
            Please click the verification link in the email to complete your registration.
          </p>
          
          <div className="space-y-3">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                <strong>Important:</strong> The verification link will expire in 10 minutes for security reasons.
              </p>
            </div>
            
            <button
              onClick={() => window.location.href = '/login'}
              className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Go to Login
            </button>
            
            <button
              onClick={() => {
                setIsSuccess(false);
                // Reset form
                setFullname("");
                setEmail("");
                setPhone("");
                setPassword("");
              }}
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Sign Up Again
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500">
              Didn&apos;t receive the email? Check your spam folder or contact{' '}
              <a href="mailto:support@jubili.in" className="text-blue-600 hover:underline">
                support@jubili.in
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <div className="max-w-5xl w-full grid grid-cols-1 md:grid-cols-2 bg-white shadow-lg rounded-2xl overflow-hidden">
          {/* Right - Image Section */}
          <div className="hidden md:block">
            <img
              src="https://images.pexels.com/photos/15485500/pexels-photo-15485500/free-photo-of-a-group-of-young-people-at-an-event.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2"
              alt="Login visual"
              className="w-full h-full object-cover"
            />
          </div>
          {/* Left - Form Section */}
          <div className="p-10">
            <h2 className="text-4xl font-bold mb-2">Create Account</h2>
            <p className="text-gray-600 mb-6">
              Create an account and discover a world of amazing products, personalized shopping experiences, and special offers.
            </p>

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="fullname" className="block text-sm font-medium text-gray-700">Full Name</label>
                <input
                  type="text"
                  id="fullname"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="eg. John Doe"
                  value={fullname}
                  onChange={e => setFullname(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Example@email.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                <input
                  type="text"
                  id="phone"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="+91"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                <input
                  type="password"
                  id="password"
                  className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="At least 8 characters"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>
              {authError && <div className="text-red-500 text-sm">{authError}</div>}
              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition flex items-center justify-center"
                disabled={loading}
              >
                {loading ? (
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                  </svg>
                ) : null}
                {loading ? "Creating Account..." : "Sign up"}
              </button>
            </form>

            <div className="flex items-center my-6">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="mx-4 text-sm text-gray-500">Or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="space-y-3">
              <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100">
                <img src="https://www.svgrepo.com/show/355037/google.svg" alt="Google" className="w-5 h-5" />
                Sign in with Google
              </button>
              <button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-100">
                <img src="https://www.svgrepo.com/show/448224/facebook.svg" alt="Facebook" className="w-5 h-5" />
                Sign in with Facebook
              </button>
            </div>

            <p className="mt-6 text-center text-sm">
              Already have an account?{" "}
              <a href="/login" className="text-blue-500 hover:underline">Sign in</a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}