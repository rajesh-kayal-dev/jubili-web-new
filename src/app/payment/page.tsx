"use client";

import { useMemo, useState } from "react";
import { FaTrash, FaMinus, FaPlus } from 'react-icons/fa';
import PageHeading from "@/components/shared/PageHeading";
import CustomButton from "@/components/ui/CustomButton";
import Image from "next/image";

type DemoItem = {
  id: string;
  name: string;
  brand: string;
  color: string;
  size: string;
  price: number; // original per unit
  discountPercent: number; // e.g. 20 for 20%
  quantity: number;
  imageUrl: string;
};

type DemoAddress = {
  id: string;
  label: string;
  name: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
};

function currency(amount: number) {
  return `₹${amount.toLocaleString()}`;
}

export default function PaymentPage() {
  // Demo cart items
  const [items, setItems] = useState<DemoItem[]>([
    {
      id: "pant-101",
      name: "Slim Fit Chinos",
      brand: "Jubili",
      color: "Navy",
      size: "32",
      price: 1999,
      discountPercent: 15,
      quantity: 1,
      imageUrl: "/public/logo.svg".replace("/public", ""),
    },
    {
      id: "pant-202",
      name: "Stretch Jeans",
      brand: "Jubili",
      color: "Black",
      size: "34",
      price: 2499,
      discountPercent: 25,
      quantity: 2,
      imageUrl: "/public/logo.svg".replace("/public", ""),
    },
  ]);

  // Demo addresses
  const [addresses] = useState<DemoAddress[]>([
    {
      id: "home",
      label: "Home",
      name: "Alex Doe",
      phone: "9876543210",
      street: "221B Baker Street",
      city: "Mumbai",
      state: "MH",
      postalCode: "400001",
    },
    {
      id: "office",
      label: "Office",
      name: "Alex Doe",
      phone: "9876543210",
      street: "Plot 14, Tech Park",
      city: "Pune",
      state: "MH",
      postalCode: "411001",
    },
  ]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>("home");

  // Totals
  const totals = useMemo(() => {
    const subTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const discount = items.reduce(
      (sum, item) => sum + Math.round((item.price * item.discountPercent) / 100) * item.quantity,
      0
    );
    const shipping = subTotal - discount > 2999 ? 0 : 99;
    const grandTotal = subTotal - discount + shipping;
    return { subTotal, discount, shipping, grandTotal };
  }, [items]);

  const onQty = (id: string, delta: number) => {
    setItems(prev =>
      prev.map(it => (it.id === id ? { ...it, quantity: Math.max(1, it.quantity + delta) } : it))
    );
  };

  const onRemove = (id: string) => {
    setItems(prev => prev.filter(it => it.id !== id));
  };

  const selectedAddress = addresses.find(a => a.id === selectedAddressId) ?? addresses[0];

  return (
    <div className="max-w-6xl mx-auto p-4">
      <PageHeading title="Secure Checkout" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left: Items + Address */}
        <div className="md:col-span-2 space-y-8">
          {/* Items (mirrors cart table layout) */}
          <div className="bg-white rounded-2xl border border-gray-300 overflow-hidden">
            <div className="hidden md:grid grid-cols-12 items-center px-6 py-3 border-b border-gray-300 text-gray-500 font-semibold text-sm">
              <div className="col-span-5">Product Info</div>
              <div className="col-span-3 text-center">Quantity</div>
              <div className="col-span-2 text-center">Total</div>
              <div className="col-span-2 text-center">Action</div>
            </div>
            {items.length === 0 ? (
              <div className="p-6 text-center text-gray-500">No items in your bag.</div>
            ) : (
              items.map(item => {
                const unitDiscount = Math.round((item.price * item.discountPercent) / 100);
                const discountedUnit = item.price - unitDiscount;
                const total = discountedUnit * item.quantity;
                return (
                  <div
                    key={item.id}
                    className="flex flex-col md:grid md:grid-cols-12 items-start md:items-center px-6 py-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition"
                  >
                    {/* info */}
                    <div className="col-span-5 w-full md:w-auto mb-4 md:mb-0">
                      <div className="flex items-center gap-4">
                        <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                          {/* demo thumb */}
                          <Image src={item.imageUrl} alt={item.imageUrl} width={500} height={500} priority />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-semibold text-base text-gray-900 break-words">
                            {item.name}
                          </h3>
                          <div className="text-xs text-gray-500 mt-1">
                            <span>Brand: {item.brand}</span>
                            <span className="mx-1">•</span>
                            <span>Color: {item.color}</span>
                            <span className="mx-1">•</span>
                            <span>Size: {item.size}</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">
                            MRP: <span className="line-through">{currency(item.price * item.quantity)}</span>
                            <span className="ml-2 text-green-600">({item.discountPercent}% off)</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* qty */}
                    <div className="flex items-center gap-2 col-span-3 w-full md:justify-center mb-4 md:mb-0">
                      <button 
                        className="w-8 h-8 rounded-full border border-gray-300 text-sm font-bold flex items-center justify-center hover:bg-gray-100 transition"
                        onClick={() => onQty(item.id, -1)}
                        aria-label="Decrease quantity"
                      >
                        <FaMinus size={10} />
                      </button>
                      <span className="mx-2 font-medium text-base min-w-[2ch] text-center">{item.quantity}</span>
                      <button 
                        className="w-8 h-8 rounded-full border border-gray-300 text-sm font-bold flex items-center justify-center hover:bg-gray-100 transition"
                        onClick={() => onQty(item.id, 1)}
                        aria-label="Increase quantity"
                      >
                        <FaPlus size={10} />
                      </button>
                    </div>

                    {/* total */}
                    <div className="col-span-2 w-full md:text-center mb-4 md:mb-0">
                      <div className="flex flex-col items-start md:items-center">
                        <span className="font-semibold text-lg text-gray-900">{currency(total)}</span>
                        {item.discountPercent > 0 && (
                          <div className="text-xs text-gray-500 mt-1">
                            <span className="line-through mr-1">{currency(item.price * item.quantity)}</span>
                            <span className="text-green-600">({item.discountPercent}% off)</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* action */}
                    <div className="col-span-2 w-full md:text-center">
                      <button 
                        className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 transition text-gray-500 hover:text-red-600"
                        onClick={() => onRemove(item.id)}
                        aria-label="Remove item from cart"
                      >
                        <FaTrash size={14} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Address (inspired by user page cards) */
          }
          <div className="bg-white rounded-2xl border border-gray-300 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-lg">Delivery Address</h2>
              <a href="/user#add-address" className="text-sm text-blue-600 hover:underline">+ Add new address</a>
            </div>

            <div className="space-y-3">
              {addresses.map(addr => (
                <label key={addr.id} className="flex items-start gap-3 p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="address"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="font-medium flex items-center gap-2">
                        <span>{addr.label}</span>
                        {addr.id === selectedAddressId && (
                          <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full">Selected</span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm text-gray-700">
                      <div className="font-medium">{addr.name} • {addr.phone}</div>
                      <div className="text-gray-600">{addr.street}, {addr.city}, {addr.state} - {addr.postalCode}</div>
                    </div>
                  </div>
                </label>
              ))}
            </div>

            {selectedAddress && (
              <div className="mt-4 text-sm text-gray-600">
                Delivering to: <span className="font-medium text-gray-800">{selectedAddress.name}</span>, {selectedAddress.street}, {selectedAddress.city}
              </div>
            )}
          </div>
        </div>

        {/* Right: Summary (mirrors cart summary) */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-gray-300 p-6 sticky top-4">
            <h2 className="font-semibold text-lg mb-6">Order Summary</h2>

            {/* Voucher input */}
            <div className="relative mb-6">
              <input
                type="text"
                placeholder="Discount voucher"
                className="w-full rounded-full border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200 pr-20"
              />
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-gray-900 text-white px-4 py-2 text-xs font-semibold hover:bg-black transition shadow"
              >
                Apply
              </button>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span>Sub Total ({items.reduce((s, it) => s + it.quantity, 0)} items)</span>
                <span>{currency(totals.subTotal)}</span>
              </div>
              {totals.discount > 0 && (
                <div className="flex justify-between text-sm text-green-700">
                  <span>Discount</span>
                  <span>-{currency(totals.discount)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{totals.shipping > 0 ? currency(totals.shipping) : "Free"}</span>
              </div>
              <hr className="my-4" />
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span>{currency(totals.grandTotal)}</span>
              </div>
            </div>

            <div className="flex items-start gap-2 text-xs text-gray-500 mb-6">
              <input 
                type="checkbox" 
                id="terms"
                className="mt-1 h-3 w-3"
                defaultChecked
              />
              <label htmlFor="terms" className="flex-1">
                I agree to the <button className="underline hover:text-gray-700">terms and conditions</button>
              </label>
            </div>

            <CustomButton
              label={`Pay ${currency(totals.grandTotal)}`}
              loading={false}
              onClick={() => alert("Demo: Proceeding to payment gateway")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}