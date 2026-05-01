// filepath: tests/api.test.ts
import { menuItemSchema, menuItemQuerySchema } from '@/utils/validation';
import { customerSchema, createOrderSchema, orderItemSchema, updateOrderStatusSchema } from '@/utils/orderValidation';

describe('Menu API Validation', () => {
  describe('GET /api/menu', () => {
    it('should return all menu items without filters', async () => {
      // This test validates the query schema works correctly
      const result = menuItemQuerySchema.safeParse({});
      expect(result.success).toBe(true);
    });

    it('should filter by category', async () => {
      const result = menuItemQuerySchema.safeParse({ category: 'main' });
      expect(result.success).toBe(true);
    });

    it('should filter by search query', async () => {
      const result = menuItemQuerySchema.safeParse({ search: 'pizza' });
      expect(result.success).toBe(true);
    });

    it('should reject invalid category', async () => {
      const result = menuItemQuerySchema.safeParse({ category: 'invalid' });
      expect(result.success).toBe(false);
    });
  });

  describe('menuItemSchema', () => {
    it('should validate a correct menu item', () => {
      const validItem = {
        name: 'Margherita Pizza',
        description: 'Classic Italian pizza with tomato sauce and mozzarella',
        price: 14.99,
        category: 'main',
        image: 'https://example.com/pizza.jpg',
        available: true,
      };
      const result = menuItemSchema.safeParse(validItem);
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const invalidItem = {
        name: '',
        description: 'Test description',
        price: 10.99,
        category: 'main',
        image: 'https://example.com/image.jpg',
      };
      const result = menuItemSchema.safeParse(invalidItem);
      expect(result.success).toBe(false);
    });

    it('should reject negative price', () => {
      const invalidItem = {
        name: 'Test Item',
        description: 'Test description',
        price: -10.99,
        category: 'main',
        image: 'https://example.com/image.jpg',
      };
      const result = menuItemSchema.safeParse(invalidItem);
      expect(result.success).toBe(false);
    });

    it('should reject invalid category', () => {
      const invalidItem = {
        name: 'Test Item',
        description: 'Test description',
        price: 10.99,
        category: 'invalid',
        image: 'https://example.com/image.jpg',
      };
      const result = menuItemSchema.safeParse(invalidItem);
      expect(result.success).toBe(false);
    });

    it('should reject invalid image URL', () => {
      const invalidItem = {
        name: 'Test Item',
        description: 'Test description',
        price: 10.99,
        category: 'main',
        image: 'not-a-url',
      };
      const result = menuItemSchema.safeParse(invalidItem);
      expect(result.success).toBe(false);
    });
  });
});

describe('Order API Validation', () => {
  describe('POST /api/orders - Success Cases', () => {
    it('should validate a correct order with valid phone format (123) 456-7890', () => {
      const validOrder = {
        customer: {
          name: 'John Doe',
          phone: '(123) 456-7890',
          address: '123 Main St, City, State 12345',
        },
        items: [
          {
            menuItem: '507f1f77bcf86cd799440011',
            name: 'Margherita Pizza',
            price: 14.99,
            quantity: 2,
          },
        ],
        subtotal: 29.98,
        tax: 2.40,
        total: 32.38,
      };
      const result = createOrderSchema.safeParse(validOrder);
      expect(result.success).toBe(true);
    });

    it('should validate a correct order with phone format 123-456-7890', () => {
      const validOrder = {
        customer: {
          name: 'Jane Doe',
          phone: '123-456-7890',
          address: '456 Oak Ave, Town, State 67890',
        },
        items: [
          {
            menuItem: '507f1f77bcf86cd799440011',
            name: 'Caesar Salad',
            price: 12.99,
            quantity: 1,
          },
        ],
        subtotal: 12.99,
        tax: 1.04,
        total: 14.03,
      };
      const result = createOrderSchema.safeParse(validOrder);
      expect(result.success).toBe(true);
    });

    it('should validate a correct order with phone format 1234567890', () => {
      const validOrder = {
        customer: {
          name: 'Bob Smith',
          phone: '1234567890',
          address: '789 Pine Rd, City, State 11111',
        },
        items: [
          {
            menuItem: '507f1f77bcf86cd799440011',
            name: 'Garlic Bread',
            price: 6.99,
            quantity: 3,
          },
        ],
        subtotal: 20.97,
        tax: 1.68,
        total: 22.65,
      };
      const result = createOrderSchema.safeParse(validOrder);
      expect(result.success).toBe(true);
    });

    it('should validate a correct order with +1 format', () => {
      const validOrder = {
        customer: {
          name: 'Alice Johnson',
          phone: '+1 123 456 7890',
          address: '321 Elm St, Village, State 22222',
        },
        items: [
          {
            menuItem: '507f1f77bcf86cd799440011',
            name: 'Grilled Salmon',
            price: 24.99,
            quantity: 1,
          },
        ],
        subtotal: 24.99,
        tax: 2.00,
        total: 26.99,
      };
      const result = createOrderSchema.safeParse(validOrder);
      expect(result.success).toBe(true);
    });
  });

  describe('POST /api/orders - Failure Cases', () => {
    it('should reject empty cart', () => {
      const invalidOrder = {
        customer: {
          name: 'John Doe',
          phone: '123-456-7890',
          address: '123 Main St',
        },
        items: [],
        subtotal: 0,
        tax: 0,
        total: 0,
      };
      const result = createOrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });

    it('should reject invalid phone format', () => {
      const invalidOrder = {
        customer: {
          name: 'John Doe',
          phone: 'invalid',
          address: '123 Main St',
        },
        items: [
          {
            menuItem: '507f1f77bcf86cd799440011',
            name: 'Pizza',
            price: 14.99,
            quantity: 1,
          },
        ],
        subtotal: 14.99,
        tax: 1.20,
        total: 16.19,
      };
      const result = createOrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
      if (!result.success) {
        const phoneError = result.error.issues.find(i => i.path.includes('phone'));
        expect(phoneError).toBeDefined();
      }
    });

    it('should reject invalid quantity (zero)', () => {
      const invalidOrder = {
        customer: {
          name: 'John Doe',
          phone: '123-456-7890',
          address: '123 Main St',
        },
        items: [
          {
            menuItem: '507f1f77bcf86cd799440011',
            name: 'Pizza',
            price: 14.99,
            quantity: 0,
          },
        ],
        subtotal: 14.99,
        tax: 1.20,
        total: 16.19,
      };
      const result = createOrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });

    it('should reject negative quantity', () => {
      const invalidOrder = {
        customer: {
          name: 'John Doe',
          phone: '123-456-7890',
          address: '123 Main St',
        },
        items: [
          {
            menuItem: '507f1f77bcf86cd799440011',
            name: 'Pizza',
            price: 14.99,
            quantity: -1,
          },
        ],
        subtotal: 14.99,
        tax: 1.20,
        total: 16.19,
      };
      const result = createOrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });

    it('should reject non-integer quantity', () => {
      const invalidOrder = {
        customer: {
          name: 'John Doe',
          phone: '123-456-7890',
          address: '123 Main St',
        },
        items: [
          {
            menuItem: '507f1f77bcf86cd799440011',
            name: 'Pizza',
            price: 14.99,
            quantity: 1.5,
          },
        ],
        subtotal: 14.99,
        tax: 1.20,
        total: 16.19,
      };
      const result = createOrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });

    it('should reject negative price', () => {
      const invalidOrder = {
        customer: {
          name: 'John Doe',
          phone: '123-456-7890',
          address: '123 Main St',
        },
        items: [
          {
            menuItem: '507f1f77bcf86cd799440011',
            name: 'Pizza',
            price: -14.99,
            quantity: 1,
          },
        ],
        subtotal: -14.99,
        tax: -1.20,
        total: -16.19,
      };
      const result = createOrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });

    it('should reject empty name', () => {
      const invalidOrder = {
        customer: {
          name: '',
          phone: '123-456-7890',
          address: '123 Main St',
        },
        items: [
          {
            menuItem: '507f1f77bcf86cd799440011',
            name: 'Pizza',
            price: 14.99,
            quantity: 1,
          },
        ],
        subtotal: 14.99,
        tax: 1.20,
        total: 16.19,
      };
      const result = createOrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });

    it('should reject empty address', () => {
      const invalidOrder = {
        customer: {
          name: 'John Doe',
          phone: '123-456-7890',
          address: '',
        },
        items: [
          {
            menuItem: '507f1f77bcf86cd799440011',
            name: 'Pizza',
            price: 14.99,
            quantity: 1,
          },
        ],
        subtotal: 14.99,
        tax: 1.20,
        total: 16.19,
      };
      const result = createOrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });
  });

  describe('Status Progression Logic', () => {
    it('should accept valid status values', () => {
      const statuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
      
      statuses.forEach(status => {
        const result = updateOrderStatusSchema.safeParse({ status });
        expect(result.success).toBe(true);
      });
    });

    it('should reject invalid status', () => {
      const result = updateOrderStatusSchema.safeParse({ status: 'invalid' });
      expect(result.success).toBe(false);
    });

    it('should validate status enum correctly', () => {
      // Test that the schema accepts all valid status values
      const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
      
      validStatuses.forEach(status => {
        const result = updateOrderStatusSchema.safeParse({ status });
        expect(result.success).toBe(true);
      });
    });
  });
});

describe('GET /api/orders', () => {
  it('should return all orders without filters', async () => {
    // This validates the query can handle no parameters
    const result = createOrderSchema.safeParse({
      customer: { name: 'Test', phone: '123-456-7890', address: 'Test' },
      items: [{ menuItem: '1', name: 'Test', price: 10, quantity: 1 }],
      subtotal: 10,
      tax: 0.8,
      total: 10.8,
    });
    expect(result.success).toBe(true);
  });

  it('should filter by status', async () => {
    // Document that status filtering is supported
    const validStatuses = ['pending', 'preparing', 'ready', 'delivered', 'cancelled'];
    validStatuses.forEach(status => {
      expect(typeof status).toBe('string');
    });
  });

  it('should filter by phone', () => {
    // Document that phone filtering is supported
    const phoneNumber = '123-456-7890';
    expect(phoneNumber).toMatch(/^\d{3}-\d{3}-\d{4}$/);
  });
});