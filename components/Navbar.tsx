'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { usePathname } from 'next/navigation';

export function Navbar() {
  const { itemCount } = useCart();
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-primary">🍽️ FoodHub</span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/menu"
              className={`font-medium transition-colors ${
                isActive('/menu') ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              Menu
            </Link>
            <Link
              href="/cart"
              className={`font-medium transition-colors ${
                isActive('/cart') ? 'text-primary' : 'text-secondary hover:text-primary'
              }`}
            >
              Cart
            </Link>
          </div>

          {/* Cart Icon */}
          <Link href="/cart" className="relative p-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-secondary"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}