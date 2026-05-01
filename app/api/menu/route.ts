import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { menuService } from '@/services/menuService';
import { menuItemQuerySchema } from '@/utils/validation';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category') || undefined;
    const search = searchParams.get('search') || undefined;

    // ✅ Validate query
    const queryValidation = menuItemQuerySchema.safeParse({
      category,
      search,
    });

    if (!queryValidation.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: queryValidation.error.issues },
        { status: 400 }
      );
    }

    // ✅ Fix TypeScript issue
const validCategories = ['appetizer', 'main', 'dessert', 'beverage'] as const;

const categoryParam = validCategories.includes(category as 'appetizer' | 'main' | 'dessert' | 'beverage')
  ? (category as typeof validCategories[number])
  : undefined;

    // ✅ THIS WAS MISSING
    const menuItems = await menuService.getAllMenuItems({
      category: categoryParam,
      search,
    });

    return NextResponse.json({
      success: true,
      data: menuItems,
    });

  } catch (error) {
    console.error('Error fetching menu items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menu items' },
      { status: 500 }
    );
  }
}