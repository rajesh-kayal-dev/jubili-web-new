"use client";

import { useRouter } from "next/navigation";
import { Quicksand } from "next/font/google";
import Image from "next/image";
import Navbar from "@/components/layout/Navbar";
import { useLikedProducts } from "@/hooks/useLikedProducts";
import PageHeading from "@/components/shared/PageHeading";
import { Product } from "@/lib/types/product";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
});

export default function FavouritePage() {
  const router = useRouter();
  const { 
    likedProducts, 
    loading, 
    error, 
    handleUnlike, 
  } = useLikedProducts();

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <img src="/icons/loading.svg" alt="Loading..." className="w-8 h-8 animate-spin" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <PageHeading title="Your Liked Products" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Left: Liked Products List */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-2xl border border-gray-300 p-0 overflow-hidden">
              {/* Table Header - hidden on mobile */}
              <div className="hidden md:grid grid-cols-12 items-center px-6 py-3 border-b border-gray-300 text-gray-500 font-semibold text-sm">
                <div className="col-span-6">Product</div>
                <div className="col-span-6 text-center">Description</div>
              </div>
              
              {/* Error State */}
              {error && (
                <div className="p-6 text-red-500 text-center">
                  <p>{error}</p>
                  <button 
                    onClick={() => window.location.reload()}
                    className="mt-2 text-blue-500 underline"
                  >
                    Try again
                  </button>
                </div>
              )}
              
              {/* Table Body */}
              {!error && likedProducts && likedProducts.length > 0 ? (
                likedProducts.map((item: Product) => (
                  <div
                    key={item.productId}
                    className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center ml-2 md:ml-6 mr-2 md:mr-6 py-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                  >
                    {/* Product Info */}
                    <div className="flex items-center gap-4 col-span-6 w-full md:w-auto mb-2 md:mb-0">
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image 
                          src={item.imageUrls[0] || '/placeholder-image.jpg'} 
                          alt={item.productName} 
                          fill
                          className="object-cover rounded-lg" 
                          sizes="64px"
                        />
                      </div>
                      <div>
                        <div className="font-semibold text-base text-gray-900 break-words max-w-[150px] md:max-w-none">
                          {item.productName}
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button
                            className="bg-gray-200 text-gray-700 rounded-full px-4 py-1 text-sm font-semibold hover:bg-gray-300 transition disabled:opacity-50"
                            onClick={() => handleUnlike(item.productId)}
                            disabled={loading}
                          >
                            Unlike
                          </button>
                        </div>
                      </div>
                    </div>
                    
                    {/* Description */}
                    <div className="col-span-6 w-full md:justify-center mb-2 md:mb-0 text-gray-700 text-sm">
                      {item.productDescription ? (
                        <p className="line-clamp-3">{item.productDescription}</p>
                      ) : (
                        <span className="text-gray-400">No description</span>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                !loading && !error && (
                  <div className="p-6 text-gray-500 text-center">
                    <p className="mb-4">You have not liked any products yet.</p>
                    <button 
                      onClick={() => router.push('/search')}
                      className="text-blue-500 underline"
                    >
                      Start browsing products
                    </button>
                  </div>
                )
              )}
            </div>
          </div>
          
          {/* Right: Info/Actions */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-300 p-6 mb-6 flex flex-col items-center justify-center h-full">
              <div className="font-semibold mb-4 text-center">
                Liked products are saved to your account. You can add them to your cart anytime!
              </div>
              <button 
                className="w-full mt-2 bg-black text-white rounded-full py-3 font-semibold text-lg hover:bg-gray-900 transition"
                onClick={() => router.push("/cart")}
              >
                Go to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}