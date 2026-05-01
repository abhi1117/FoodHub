import { Server as HTTPServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { IOrder } from '@/models/order';

let io: SocketIOServer | null = null;

export function initSocketServer(httpServer: HTTPServer) {
  if (io) {
    return io;
  }

  io = new SocketIOServer(httpServer, {
    cors: {
      origin: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000',
      methods: ['GET', 'POST'],
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('join-order', (orderId: string) => {
      socket.join(`order-${orderId}`);
      console.log(`Socket ${socket.id} joined order-${orderId}`);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  console.log('Socket.io server initialized');
  return io;
}

export function getIO() {
  return io;
}

export function emitOrderCreated(order: unknown) {
  if (io) {
    io.emit('order:created', order);
  }
}

export function emitOrderUpdated(order: unknown) {
  if (io) {
    io.emit('order:updated', order);
  }
}

export function emitOrderStatusUpdate(orderId: string, status: string, order: IOrder) {
  if (io) {
    // Emit to specific order room
    io.to(`order-${orderId}`).emit('order:status', {
      orderId,
      status,
      order: order.toObject(),
      updatedAt: new Date().toISOString(),
    });
    
    // Also emit to all connected clients for global updates
    io.emit('order:status:broadcast', {
      orderId,
      status,
      order: order.toObject(),
      updatedAt: new Date().toISOString(),
    });
  }
}