import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { menuService } from '@/services/menuService';

export async function GET() {
  try {
    await connectDB();

    const result = await menuService.seedMenuItems();

    return NextResponse.json(result);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Seeding failed' }, { status: 500 });
  }
}