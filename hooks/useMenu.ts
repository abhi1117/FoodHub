import { useEffect, useCallback } from 'react';
import { useMenuStore } from '@/store/menuStore';

export function useMenu() {
  const {
    filteredItems,
    selectedCategory,
    searchQuery,
    isLoading,
    error,
    setItems,
    setCategory,
    setSearchQuery,
    setLoading,
    setError,
    clearError,
  } = useMenuStore();

  const fetchMenuItems = useCallback(async () => {
    setLoading(true);
    clearError();

    try {
      const params = new URLSearchParams();

      if (selectedCategory && selectedCategory !== 'all') {
        params.set('category', selectedCategory);
      }

      if (searchQuery) {
        params.set('search', searchQuery);
      }

      const query = params.toString();
      const url = query ? `/api/menu?${query}` : `/api/menu`;

      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setItems(result.data);
      } else {
        setError(result.error || 'Failed to fetch menu items');
      }
    } catch (err) {
      setError('An error occurred while fetching menu items');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchQuery, setItems, setLoading, setError, clearError]);

  useEffect(() => {
    fetchMenuItems();
  }, [fetchMenuItems]);

  return {
    items: filteredItems,
    isLoading,
    error,
    selectedCategory,
    searchQuery,
    setCategory,
    setSearchQuery,
    refetch: fetchMenuItems,
  };
}