'use client';

import { useEffect, useState } from 'react';
import { useMenu } from '@/hooks/useMenu';
import { MenuCard } from '@/components/MenuCard';

const categories = [
  { id: 'all', label: 'All' },
  { id: 'appetizer', label: 'Appetizers' },
  { id: 'main', label: 'Main Course' },
  { id: 'dessert', label: 'Desserts' },
  { id: 'beverage', label: 'Beverages' },
] as const;

export default function MenuPage() {
  const { items, isLoading, error, selectedCategory, searchQuery, setCategory, setSearchQuery } = useMenu();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(localSearch);
    }, 300);

    return () => clearTimeout(timer);
  }, [localSearch, setSearchQuery]);

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-secondary mb-2">Our Menu</h1>
          <p className="text-gray-500">Discover our delicious selection of dishes</p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search menu..."
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="input-field pl-12"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setCategory(category.id)}
              className={`px-4 py-2 rounded-full font-medium transition-all ${
                selectedCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-border'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="text-center py-12">
            <p className="text-error mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="btn-secondary"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !error && items.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found</p>
          </div>
        )}

        {/* Menu Grid */}
        {!isLoading && !error && items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <MenuCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}