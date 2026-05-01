'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useOrder } from '@/hooks/useOrder';
import { useSocket } from '@/hooks/useSocket';
import { Order } from '@/store/orderStore';

const statusColors = {
  pending: 'bg-warning text-secondary',
  preparing: 'bg-blue-400 text-white',
  ready: 'bg-success text-white',
  delivered: 'bg-secondary text-white',
  cancelled: 'bg-error text-white',
};

const statusLabels = {
  pending: 'Pending',
  preparing: 'Preparing',
  ready: 'Ready',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

const statusSteps = [
  { key: 'pending', label: 'Order Placed' },
  { key: 'preparing', label: 'Preparing' },
  { key: 'ready', label: 'Ready' },
  { key: 'delivered', label: 'Delivered' },
];

export default function OrderPage() {
  const params = useParams();
  const router = useRouter();
  const { fetchOrderById, currentOrder, isLoading, error } = useOrder();
  const { joinOrderRoom } = useSocket();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (params.id) {
      fetchOrderById(params.id as string).then((data) => {
        if (!data) {
          router.push('/menu');
        } else {
          // Join the order room for real-time updates
          joinOrderRoom(params.id as string);
        }
      });
    }
  }, [params.id, fetchOrderById, router, joinOrderRoom]);

  useEffect(() => {
    if (currentOrder) {
      setOrder(currentOrder);
    }
  }, [currentOrder]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <p className="text-error mb-4">{error || 'Order not found'}</p>
          <Link href="/menu" className="btn-primary">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex((s) => s.key === order.status);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link href="/menu" className="text-primary hover:underline mb-4 inline-flex items-center">
          ← Back to Menu
        </Link>

        {/* Order Card */}
        <div className="card">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-2xl font-bold text-secondary">Order #{order.orderNumber}</h1>
              <p className="text-gray-500 text-sm mt-1">
                {new Date(order.createdAt).toLocaleString('en-US', {
                  dateStyle: 'long',
                  timeStyle: 'short',
                })}
              </p>
            </div>
            <span className={`px-4 py-2 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
              {statusLabels[order.status]}
            </span>
          </div>

          {/* Status Timeline */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {statusSteps.map((step, index) => (
                <div key={step.key} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      index <= currentStepIndex
                        ? order.status === 'cancelled'
                          ? 'bg-error text-white'
                          : 'bg-primary text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {index < currentStepIndex ? '✓' : index + 1}
                  </div>
                  <span className="text-xs mt-2 text-gray-600 text-center hidden sm:block">
                    {step.label}
                  </span>
                </div>
              ))}
            </div>
            
            {/* Progress Bar */}
            {order.status !== 'cancelled' && (
              <div className="mt-2 h-1 bg-gray-200 rounded-full">
                <div
                  className="h-full bg-primary rounded-full transition-all duration-500"
                  style={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
                ></div>
              </div>
            )}
          </div>

          {/* Customer Info */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-secondary mb-2">Delivery Details</h3>
            <p className="text-gray-600">{order.customer.name}</p>
            <p className="text-gray-600">{order.customer.phone}</p>
            <p className="text-gray-600">{order.customer.address}</p>
            {order.customer.notes && (
              <p className="text-gray-500 text-sm mt-2">Note: {order.customer.notes}</p>
            )}
          </div>

          {/* Items */}
          <div className="mb-6">
            <h3 className="font-semibold text-secondary mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center py-2 border-b border-border last:border-0">
                  <div>
                    <span className="text-secondary font-medium">{item.quantity}x {item.name}</span>
                  </div>
                  <span className="text-gray-600">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="border-t border-border pt-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-secondary">${order.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="text-secondary">${order.tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold">
                <span className="text-secondary">Total</span>
                <span className="text-primary">${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex gap-4">
          <Link href="/menu" className="btn-primary flex-1 text-center">
            Order More
          </Link>
        </div>
      </div>
    </div>
  );
}