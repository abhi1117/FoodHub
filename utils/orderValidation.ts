import { z } from 'zod';

// Phone regex: accepts formats like (123) 456-7890, 123-456-7890, 1234567890, +1 123 456 7890
const phoneRegex = /^(\+1)?[\s.-]?\(?[0-9]{3}\)?[\s.-]?[0-9]{3}[\s.-]?[0-9]{4}$/;

export const customerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  phone: z.string()
    .min(1, 'Phone is required')
    .max(20, 'Phone is too long')
    .regex(phoneRegex, 'Invalid phone format. Use formats like (123) 456-7890, 123-456-7890, or 1234567890'),
  address: z.string().min(1, 'Address is required').max(500, 'Address is too long'),
  notes: z.string().max(500, 'Notes are too long').optional(),
});

export const orderItemSchema = z.object({
  menuItem: z.string().min(1, 'Menu item ID is required'),
  name: z.string().min(1, 'Item name is required'),
  price: z.number().positive('Price must be positive'),
  quantity: z.number().int().positive('Quantity must be a positive integer'),
});

export const createOrderSchema = z.object({
  customer: customerSchema,
  items: z.array(orderItemSchema).min(1, 'At least one item is required'),
  subtotal: z.number().positive('Subtotal must be positive'),
  tax: z.number().min(0, 'Tax cannot be negative'),
  total: z.number().positive('Total must be positive'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'preparing', 'ready', 'delivered', 'cancelled']),
});

export type CustomerInput = z.infer<typeof customerSchema>;
export type OrderItemInput = z.infer<typeof orderItemSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type UpdateOrderStatusInput = z.infer<typeof updateOrderStatusSchema>;