'use client';

import Link from 'next/link';
import { Order } from '@/store/orderStore';

interface OrderCardProps {
  order: Order;
}

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

export function OrderCard({ order }: OrderCardProps) {
  const orderDate = new Date(order.createdAt);
  const formattedDate = orderDate.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Link href={`/order/${order._id}`}>
      <div className="card hover:shadow-card-hover cursor-pointer">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-semibold text-secondary">Order #{order.orderNumber}</h3>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[order.status]}`}>
            {statusLabels[order.status]}
          </span>
        </div>

        {/* Items */}
        <div className="space-y-2 mb-4">
          {order.items.slice(0, 3).map((item, index) => (
            <div key={index} className="flex justify-between text-sm">
              <span className="text-gray-600">{item.quantity}x {item.name}</span>
              <span className="text-gray-500">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-sm text-gray-500">+ {order.items.length - 3} more items</p>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-between items-center pt-4 border-t border-border">
          <span className="font-medium text-secondary">Total</span>
          <span className="text-lg font-bold text-primary">${order.total.toFixed(2)}</span>
        </div>
      </div>
    </Link>
  );
}