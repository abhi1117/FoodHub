'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { useOrder } from '@/hooks/useOrder';
import { customerSchema } from '@/utils/orderValidation';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, tax, total, clearCart } = useCart();
  const { createOrder, isLoading } = useOrder();
  
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    notes: '',
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Redirect if cart is empty
  if (items.length === 0) {
    router.push('/menu');
    return null;
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = customerSchema.safeParse(formData);
    if (!validation.success) {
      const newErrors: Record<string, string> = {};
      validation.error.issues.forEach((err) => {
        const path = err.path[0];
        if (path && typeof path === 'string') {
          newErrors[path] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    // Prepare order data
    const orderItems = items.map((item) => ({
      menuItem: item.menuItem._id,
      name: item.menuItem.name,
      price: item.menuItem.price,
      quantity: item.quantity,
    }));

    // Create order
    const order = await createOrder(formData as { name: string; phone: string; address: string; notes?: string }, orderItems, subtotal, tax, total);

    if (order) {
      clearCart();
      router.push(`/order/${order._id}`);
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/cart" className="text-primary hover:underline mb-4 inline-flex items-center">
            ← Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-secondary">Checkout</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="card space-y-6">
              <h2 className="text-xl font-semibold text-secondary mb-4">Customer Information</h2>
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`input-field ${errors.name ? 'border-error' : ''}`}
                  placeholder="John Doe"
                />
                {errors.name && <p className="text-error text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`input-field ${errors.phone ? 'border-error' : ''}`}
                  placeholder="(555) 123-4567"
                />
                {errors.phone && <p className="text-error text-sm mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  Delivery Address *
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                  className={`input-field ${errors.address ? 'border-error' : ''}`}
                  placeholder="123 Main St, Apt 4, City, State 12345"
                />
                {errors.address && <p className="text-error text-sm mt-1">{errors.address}</p>}
              </div>

              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Order Notes (Optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  rows={2}
                  className="input-field"
                  placeholder="Any special instructions..."
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="btn-primary w-full"
              >
                {isLoading ? 'Placing Order...' : `Place Order - $${total.toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="card sticky top-24">
              <h2 className="text-xl font-semibold text-secondary mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                {items.map((item) => (
                  <div key={item.menuItem._id} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.menuItem.name}
                    </span>
                    <span className="text-gray-500">
                      ${(item.menuItem.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="text-secondary">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (8%)</span>
                  <span className="text-secondary">${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span className="text-secondary">Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}