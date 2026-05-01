import { Order, IOrder } from '@/models/order';
import { CreateOrderInput, UpdateOrderStatusInput } from '@/utils/orderValidation';

function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ORD-${timestamp}-${random}`;
}

export class OrderService {
  async getAllOrders() {
    return Order.find().sort({ createdAt: -1 });
  }

  async getOrderById(id: string) {
    return Order.findById(id);
  }

  async getOrderByNumber(orderNumber: string) {
    return Order.findOne({ orderNumber });
  }

  async createOrder(data: CreateOrderInput) {
    const orderNumber = generateOrderNumber();
    
    const order = await Order.create({
      ...data,
      orderNumber,
    });

    return order;
  }

  async updateOrderStatus(id: string, data: UpdateOrderStatusInput) {
    const order = await Order.findByIdAndUpdate(
      id,
      { status: data.status },
      { new: true, runValidators: true }
    );

    return order;
  }

  async getOrdersByStatus(status: string) {
    return Order.find({ status }).sort({ createdAt: -1 });
  }

  async getOrdersByPhone(phone: string) {
    return Order.find({ 'customer.phone': phone }).sort({ createdAt: -1 });
  }

  async cancelOrder(id: string) {
    const order = await Order.findByIdAndUpdate(
      id,
      { status: 'cancelled' },
      { new: true, runValidators: true }
    );

    return order;
  }

  async getRecentOrders(limit: number = 10) {
    return Order.find().sort({ createdAt: -1 }).limit(limit);
  }

  async getOrderStats() {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({ status: 'pending' });
    const preparingOrders = await Order.countDocuments({ status: 'preparing' });
    const readyOrders = await Order.countDocuments({ status: 'ready' });
    const deliveredOrders = await Order.countDocuments({ status: 'delivered' });
    const cancelledOrders = await Order.countDocuments({ status: 'cancelled' });

    return {
      total: totalOrders,
      pending: pendingOrders,
      preparing: preparingOrders,
      ready: readyOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders,
    };
  }
}

export const orderService = new OrderService();