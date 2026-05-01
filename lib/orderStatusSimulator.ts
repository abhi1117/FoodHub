// filepath: lib/orderStatusSimulator.ts
import { Order, IOrder } from '@/models/order';
import { emitOrderStatusUpdate } from './socket';

type OrderStatus = 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

interface StatusTransition {
  from: OrderStatus;
  to: OrderStatus;
  delayMs: number;
}

// Define the order status progression flow
const statusTransitions: StatusTransition[] = [
  { from: 'pending', to: 'preparing', delayMs: 5000 },    // 5 seconds
  { from: 'preparing', to: 'ready', delayMs: 10000 },    // 10 seconds
  { from: 'ready', to: 'delivered', delayMs: 15000 },    // 15 seconds
];

// Map of active intervals for each order
const activeIntervals: Map<string, NodeJS.Timeout> = new Map();

/**
 * Start simulating order status progression for a new order
 * This simulates the backend processing that would normally happen
 */
export function startOrderStatusSimulation(orderId: string): void {
  // Clear any existing simulation for this order
  stopOrderStatusSimulation(orderId);

  let currentStep = 0;

  const simulateNextStep = async () => {
    if (currentStep >= statusTransitions.length) {
      // Order has completed all status transitions
      console.log(`Order ${orderId} simulation complete`);
      return;
    }

    const transition = statusTransitions[currentStep];
    
    try {
      // Update the order status in the database
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { status: transition.to },
        { new: true, runValidators: true }
      );

      if (updatedOrder) {
        console.log(`Order ${orderId} status: ${transition.from} → ${transition.to}`);
        
        // Emit the status update via Socket.io
        await emitOrderStatusUpdate(orderId, transition.to, updatedOrder);
      }

      currentStep++;

      // Schedule the next status update
      if (currentStep < statusTransitions.length) {
        const interval = setTimeout(simulateNextStep, statusTransitions[currentStep].delayMs);
        activeIntervals.set(orderId, interval);
      }
    } catch (error) {
      console.error(`Error simulating order ${orderId} status:`, error);
    }
  };

  // Start the first transition after the initial delay
  const initialDelay = setTimeout(simulateNextStep, statusTransitions[0].delayMs);
  activeIntervals.set(orderId, initialDelay);
}

/**
 * Stop the status simulation for a specific order
 */
export function stopOrderStatusSimulation(orderId: string): void {
  const interval = activeIntervals.get(orderId);
  if (interval) {
    clearTimeout(interval);
    activeIntervals.delete(orderId);
    console.log(`Stopped simulation for order ${orderId}`);
  }
}

/**
 * Manually trigger a status update for an order (admin function)
 */
export async function manuallyUpdateOrderStatus(
  orderId: string, 
  newStatus: OrderStatus
): Promise<IOrder | null> {
  // Stop any existing simulation
  stopOrderStatusSimulation(orderId);

  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { status: newStatus },
      { new: true, runValidators: true }
    );

    if (updatedOrder) {
      await emitOrderStatusUpdate(orderId, newStatus, updatedOrder);
    }

    return updatedOrder;
  } catch (error) {
    console.error(`Error manually updating order ${orderId}:`, error);
    return null;
  }
}

/**
 * Get all active simulations (for debugging/monitoring)
 */
export function getActiveSimulations(): string[] {
  return Array.from(activeIntervals.keys());
}

/**
 * Clear all active simulations (for cleanup)
 */
export function clearAllSimulations(): void {
  for (const orderId of activeIntervals.keys()) {
    stopOrderStatusSimulation(orderId);
  }
}