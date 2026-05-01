import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import { orderService } from '@/services/orderService';
import { createOrderSchema } from '@/utils/orderValidation';
import { startOrderStatusSimulation } from '@/lib/orderStatusSimulator';

export async function GET(request: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const phone = searchParams.get('phone');

    let orders;
    if (status) {
      orders = await orderService.getOrdersByStatus(status);
    } else if (phone) {
      orders = await orderService.getOrdersByPhone(phone);
    } else {
      orders = await orderService.getAllOrders();
    }

    return NextResponse.json({ success: true, data: orders });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB();

    const body = await request.json();

    // Validate request body
    const validation = createOrderSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: validation.error.issues },
        { status: 400 }
      );
    }

    // Validate cart is not empty (additional check)
    if (!validation.data.items || validation.data.items.length === 0) {
      return NextResponse.json(
        { error: 'Cart is empty. Add items to your cart before placing an order.' },
        { status: 400 }
      );
    }

    // Validate all quantities are valid
    for (const item of validation.data.items) {
      if (!item.quantity || item.quantity < 1) {
        return NextResponse.json(
          { error: `Invalid quantity for item: ${item.name}` },
          { status: 400 }
        );
      }
    }

    const order = await orderService.createOrder(validation.data);

    // Start real-time status simulation for the new order
    if (order && order._id) {
      startOrderStatusSimulation(order._id.toString());
    }

    return NextResponse.json(
      { success: true, data: order },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}