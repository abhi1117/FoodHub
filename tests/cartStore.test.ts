import { useCartStore, MenuItem } from '../store/cartStore';

describe('Cart Store', () => {
  beforeEach(() => {
    // Reset store before each test
    useCartStore.setState({ items: [] });
  });

  const mockMenuItem: MenuItem = {
    _id: '1',
    name: 'Test Item',
    description: 'Test description',
    price: 10.99,
    category: 'main',
    image: 'https://example.com/image.jpg',
    available: true,
  };

  describe('addItem', () => {
    it('should add a new item to cart', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockMenuItem);
      
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].menuItem).toEqual(mockMenuItem);
      expect(items[0].quantity).toBe(1);
    });

    it('should increment quantity for existing item', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockMenuItem);
      addItem(mockMenuItem);
      
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(1);
      expect(items[0].quantity).toBe(2);
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const { addItem, removeItem } = useCartStore.getState();
      addItem(mockMenuItem);
      removeItem('1');
      
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(0);
    });
  });

  describe('updateQuantity', () => {
    it('should update item quantity', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockMenuItem);
      updateQuantity('1', 5);
      
      const items = useCartStore.getState().items;
      expect(items[0].quantity).toBe(5);
    });

    it('should remove item when quantity is 0', () => {
      const { addItem, updateQuantity } = useCartStore.getState();
      addItem(mockMenuItem);
      updateQuantity('1', 0);
      
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(0);
    });
  });

  describe('clearCart', () => {
    it('should remove all items from cart', () => {
      const { addItem, clearCart } = useCartStore.getState();
      addItem(mockMenuItem);
      addItem({ ...mockMenuItem, _id: '2' });
      clearCart();
      
      const items = useCartStore.getState().items;
      expect(items).toHaveLength(0);
    });
  });

  describe('getSubtotal', () => {
    it('should calculate correct subtotal', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockMenuItem);
      addItem({ ...mockMenuItem, _id: '2', price: 5.99 });
      
      const subtotal = useCartStore.getState().getSubtotal();
      expect(subtotal).toBe(16.98);
    });
  });

  describe('getTax', () => {
    it('should calculate 8% tax', () => {
      const { addItem, getTax } = useCartStore.getState();
      addItem({ ...mockMenuItem, price: 100 });
      
      const tax = getTax();
      expect(tax).toBe(8);
    });
  });

  describe('getTotal', () => {
    it('should calculate total with tax', () => {
      const { addItem, getTotal } = useCartStore.getState();
      addItem({ ...mockMenuItem, price: 100 });
      
      const total = getTotal();
      expect(total).toBe(108);
    });
  });

  describe('getItemCount', () => {
    it('should return total item count', () => {
      const { addItem } = useCartStore.getState();
      addItem(mockMenuItem);
      addItem(mockMenuItem);
      addItem({ ...mockMenuItem, _id: '2' });
      
      const count = useCartStore.getState().getItemCount();
      expect(count).toBe(3);
    });
  });
});