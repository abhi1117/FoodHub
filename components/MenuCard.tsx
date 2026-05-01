'use client';

import Image from 'next/image';
import { MenuItem } from '@/store/cartStore';
import { useCart } from '@/hooks/useCart';

interface MenuCardProps {
  item: MenuItem;
}

export function MenuCard({ item }: MenuCardProps) {
  const { addItem } = useCart();

  return (
    <div className="card group cursor-pointer">
      {/* Image */}
      <div className="relative aspect-video mb-4 overflow-hidden rounded-lg">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {!item.available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="space-y-2">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-secondary">{item.name}</h3>
          <span className="text-primary font-bold text-lg">${item.price.toFixed(2)}</span>
        </div>
        
        <p className="text-sm text-gray-500 line-clamp-2">{item.description}</p>
        
        <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 text-gray-600 rounded-full capitalize">
          {item.category}
        </span>
      </div>

      {/* Add to Cart Button */}
      <button
        onClick={() => addItem(item)}
        disabled={!item.available}
        className="mt-4 w-full btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
          />
        </svg>
        Add to Cart
      </button>
    </div>
  );
}