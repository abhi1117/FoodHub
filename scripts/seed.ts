import mongoose from 'mongoose';
import { MenuItem, IMenuItem } from '@/models/menuItem';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/food-delivery';

const menuItems: Partial<IMenuItem>[] = [
  {
    name: 'Caesar Salad',
    description: 'Fresh romaine lettuce with classic Caesar dressing, parmesan cheese, and croutons',
    price: 12.99,
    category: 'appetizer',
    image: 'https://images.unsplash.com/photo-1546793665-c74683f338c7?w=800',
    available: true,
  },
  {
    name: 'Bruschetta',
    description: 'Toasted bread topped with fresh tomatoes, basil, and balsamic glaze',
    price: 9.99,
    category: 'appetizer',
    image: 'https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=800',
    available: true,
  },
  {
    name: 'Garlic Bread',
    description: 'Crispy bread with garlic butter and herbs',
    price: 6.99,
    category: 'appetizer',
    image: 'https://images.unsplash.com/photo-1619535860434-ba1d8fa12536?w=800',
    available: true,
  },
  {
    name: 'Grilled Salmon',
    description: 'Fresh Atlantic salmon with lemon herb butter, served with seasonal vegetables',
    price: 24.99,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800',
    available: true,
  },
  {
    name: 'Chicken Parmesan',
    description: 'Breaded chicken breast with marinara sauce and melted mozzarella',
    price: 18.99,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=800',
    available: true,
  },
  {
    name: 'Beef Tenderloin',
    description: 'Premium beef tenderloin with red wine reduction, mashed potatoes',
    price: 32.99,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1558030006-450675393462?w=800',
    available: true,
  },
  {
    name: 'Vegetable Stir Fry',
    description: 'Fresh seasonal vegetables in a savory ginger soy sauce with rice',
    price: 15.99,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800',
    available: true,
  },
  {
    name: 'Pasta Carbonara',
    description: 'Classic Italian pasta with creamy egg sauce, pancetta, and parmesan',
    price: 16.99,
    category: 'main',
    image: 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=800',
    available: true,
  },
  {
    name: 'Chocolate Lava Cake',
    description: 'Warm chocolate cake with a molten center, served with vanilla ice cream',
    price: 10.99,
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=800',
    available: true,
  },
  {
    name: 'Tiramisu',
    description: 'Classic Italian dessert with espresso-soaked ladyfingers and mascarpone',
    price: 9.99,
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800',
    available: true,
  },
  {
    name: 'Cheesecake',
    description: 'New York style cheesecake with berry compote',
    price: 8.99,
    category: 'dessert',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800',
    available: true,
  },
  {
    name: 'Fresh Lemonade',
    description: 'House-made lemonade with fresh lemons and mint',
    price: 4.99,
    category: 'beverage',
    image: 'https://images.unsplash.com/photo-1621263764928-df1444c5e859?w=800',
    available: true,
  },
  {
    name: 'Iced Coffee',
    description: 'Cold brew coffee with your choice of milk',
    price: 5.99,
    category: 'beverage',
    image: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=800',
    available: true,
  },
  {
    name: 'Green Tea',
    description: 'Premium Japanese green tea',
    price: 3.99,
    category: 'beverage',
    image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=800',
    available: true,
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB');

    // Check if menu items already exist
    const existingCount = await MenuItem.countDocuments();
    if (existingCount > 0) {
      console.log(`Database already has ${existingCount} menu items. Skipping seed.`);
      await mongoose.disconnect();
      return;
    }

    // Insert menu items
    await MenuItem.insertMany(menuItems);
    console.log(`Successfully seeded ${menuItems.length} menu items`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

seedDatabase();