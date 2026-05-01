import { z } from 'zod';

export const menuItemSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  description: z.string().min(1, 'Description is required').max(500, 'Description is too long'),
  price: z.number().positive('Price must be positive'),
  category: z.enum(['appetizer', 'main', 'dessert', 'beverage']),
  image: z.string().url('Invalid image URL'),
  available: z.boolean().optional(),
});

export const menuItemUpdateSchema = menuItemSchema.partial();

export const menuItemQuerySchema = z.object({
  category: z.enum(['appetizer', 'main', 'dessert', 'beverage']).optional(),
  search: z.string().optional(),
});

export type MenuItemInput = z.infer<typeof menuItemSchema>;
export type MenuItemUpdateInput = z.infer<typeof menuItemUpdateSchema>;
export type MenuItemQuery = z.infer<typeof menuItemQuerySchema>;