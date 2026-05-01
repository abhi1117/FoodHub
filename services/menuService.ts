import { MenuItem } from '@/models/menuItem';
import { MenuItemQuery, MenuItemInput, MenuItemUpdateInput } from '@/utils/validation';

export class MenuService {

  // ✅ Get all menu items with filters
  async getAllMenuItems(query: MenuItemQuery = {}) {
    const filter: Record<string, any> = {};

    if (query.category && query.category !== 'all') {
      filter.category = query.category;
    }

    if (query.search && query.search.trim() !== '') {
      filter.$or = [
        { name: { $regex: query.search, $options: 'i' } },
        { description: { $regex: query.search, $options: 'i' } },
      ];
    }

    return await MenuItem.find(filter).sort({ createdAt: -1 });
  }

  // ✅ Get single item
  async getMenuItemById(id: string) {
    return await MenuItem.findById(id);
  }

  // ✅ Create item
  async createMenuItem(data: MenuItemInput) {
    return await MenuItem.create(data);
  }

  // ✅ Update item
  async updateMenuItem(id: string, data: MenuItemUpdateInput) {
    return await MenuItem.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
  }

  // ✅ Delete item
  async deleteMenuItem(id: string) {
    return await MenuItem.findByIdAndDelete(id);
  }

  // ✅ Get multiple items
  async getMenuItemByIds(ids: string[]) {
    return await MenuItem.find({ _id: { $in: ids } });
  }

  // 🚀 Seed database
  async seedMenuItems() {
    const existingCount = await MenuItem.countDocuments();

    if (existingCount > 0) {
      return {
        message: 'Menu items already seeded',
        count: existingCount,
      };
    }

    const menuItems: MenuItemInput[] = [
      {
        name: 'Caesar Salad',
        description: 'Fresh romaine lettuce with classic Caesar dressing',
        price: 12.99,
        category: 'appetizer',
        image: 'https://images.unsplash.com/photo-1550304943-4f24f54ddde9',
        available: true,
      },
      {
        name: 'Bruschetta',
        description: 'Toasted bread topped with fresh tomatoes and basil',
        price: 9.99,
        category: 'appetizer',
        image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f',
        available: true,
      },
      {
        name: 'Grilled Salmon',
        description: 'Fresh salmon with lemon butter and vegetables',
        price: 24.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288',
        available: true,
      },
      {
        name: 'Chicken Parmesan',
        description: 'Breaded chicken with marinara sauce and cheese',
        price: 18.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8',
        available: true,
      },
      {
        name: 'Pasta Carbonara',
        description: 'Classic creamy pasta with pancetta',
        price: 16.99,
        category: 'main',
        image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3',
        available: true,
      },
      {
        name: 'Chocolate Lava Cake',
        description: 'Warm cake with molten chocolate center',
        price: 10.99,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51',
        available: true,
      },
      {
        name: 'Cheesecake',
        description: 'New York style cheesecake',
        price: 8.99,
        category: 'dessert',
        image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad',
        available: true,
      },
      {
        name: 'Iced Coffee',
        description: 'Cold brew coffee with milk',
        price: 5.99,
        category: 'beverage',
        image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5',
        available: true,
      },
      {
        name: 'Fresh Lemonade',
        description: 'Refreshing lemonade with mint',
        price: 4.99,
        category: 'beverage',
        image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859',
        available: true,
      },
    ];

    const inserted = await MenuItem.insertMany(menuItems);

    return {
      message: 'Menu items seeded successfully',
      count: inserted.length,
    };
  }
}

export const menuService = new MenuService();