import { create } from 'zustand';
import { MenuItem } from './cartStore';

type Category = 'all' | 'appetizer' | 'main' | 'dessert' | 'beverage';

interface MenuState {
  items: MenuItem[];
  filteredItems: MenuItem[];
  selectedCategory: Category;
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
  
  setItems: (items: MenuItem[]) => void;
  setFilteredItems: (items: MenuItem[]) => void;
  setCategory: (category: Category) => void;
  setSearchQuery: (query: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  filterItems: () => void;
}

export const useMenuStore = create<MenuState>((set, get) => ({
  items: [],
  filteredItems: [],
  selectedCategory: 'all',
  searchQuery: '',
  isLoading: false,
  error: null,

  setItems: (items: MenuItem[]) => {
    set({ items });
    get().filterItems();
  },
  
  setFilteredItems: (items: MenuItem[]) => set({ filteredItems: items }),
  
  setCategory: (category: Category) => {
    set({ selectedCategory: category });
    get().filterItems();
  },
  
  setSearchQuery: (query: string) => {
    set({ searchQuery: query });
    get().filterItems();
  },
  
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  
  setError: (error: string | null) => set({ error }),
  
  clearError: () => set({ error: null }),
  
  filterItems: () => {
    const { items, selectedCategory, searchQuery } = get();
    
    let filtered = [...items];
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    
    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      );
    }
    
    set({ filteredItems: filtered });
  },
}));