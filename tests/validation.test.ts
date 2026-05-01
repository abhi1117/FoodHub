import { menuItemSchema } from '@/utils/validation';
import { customerSchema, createOrderSchema, orderItemSchema } from '@/utils/orderValidation';

describe('Validation Schemas', () => {
  describe('menuItemSchema', () => {
    it('should validate a correct menu item', () => {
      const validItem = {
        name: 'Test Item',
        description: 'Test description',
        price: 10.99,
        category: 'main',
        image: 'https://example.com/image.jpg',
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
  });

  describe('customerSchema', () => {
    it('should validate correct customer data', () => {
      const validCustomer = {
        name: 'John Doe',
        phone: '555-123-4567',
        address: '123 Main St',
      };
      const result = customerSchema.safeParse(validCustomer);
      expect(result.success).toBe(true);
    });

    it('should reject empty name', () => {
      const invalidCustomer = {
        name: '',
        phone: '555-123-4567',
        address: '123 Main St',
      };
      const result = customerSchema.safeParse(invalidCustomer);
      expect(result.success).toBe(false);
    });

    it('should accept optional notes', () => {
      const validCustomer = {
        name: 'John Doe',
        phone: '555-123-4567',
        address: '123 Main St',
        notes: 'Leave at door',
      };
      const result = customerSchema.safeParse(validCustomer);
      expect(result.success).toBe(true);
    });
  });

  describe('orderItemSchema', () => {
    it('should validate correct order item', () => {
      const validItem = {
        menuItem: '507f1f77bcf86cd799439011',
        name: 'Test Item',
        price: 10.99,
        quantity: 2,
      };
      const result = orderItemSchema.safeParse(validItem);
      expect(result.success).toBe(true);
    });

    it('should reject zero quantity', () => {
      const invalidItem = {
        menuItem: '507f1f77bcf86cd799439011',
        name: 'Test Item',
        price: 10.99,
        quantity: 0,
      };
      const result = orderItemSchema.safeParse(invalidItem);
      expect(result.success).toBe(false);
    });

    it('should reject negative price', () => {
      const invalidItem = {
        menuItem: '507f1f77bcf86cd799439011',
        name: 'Test Item',
        price: -10.99,
        quantity: 2,
      };
      const result = orderItemSchema.safeParse(invalidItem);
      expect(result.success).toBe(false);
    });
  });

  describe('createOrderSchema', () => {
    it('should validate correct order', () => {
      const validOrder = {
        customer: {
          name: 'John Doe',
          phone: '555-123-4567',
          address: '123 Main St',
        },
        items: [
          {
            menuItem: '507f1f77bcf86cd799439011',
            name: 'Test Item',
            price: 10.99,
            quantity: 2,
          },
        ],
        subtotal: 21.98,
        tax: 1.76,
        total: 23.74,
      };
      const result = createOrderSchema.safeParse(validOrder);
      expect(result.success).toBe(true);
    });

    it('should reject empty items array', () => {
      const invalidOrder = {
        customer: {
          name: 'John Doe',
          phone: '555-123-4567',
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

    it('should reject negative total', () => {
      const invalidOrder = {
        customer: {
          name: 'John Doe',
          phone: '555-123-4567',
          address: '123 Main St',
        },
        items: [
          {
            menuItem: '507f1f77bcf86cd799439011',
            name: 'Test Item',
            price: 10.99,
            quantity: 2,
          },
        ],
        subtotal: 21.98,
        tax: 1.76,
        total: -10,
      };
      const result = createOrderSchema.safeParse(invalidOrder);
      expect(result.success).toBe(false);
    });
  });
});