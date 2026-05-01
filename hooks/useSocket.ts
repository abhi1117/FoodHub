'use client';

import { useEffect, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { useOrderStore, Order } from '@/store/orderStore';

let socket: Socket | null = null;

export function useSocket() {
  const { updateOrder, setCurrentOrder } = useOrderStore();
  const isConnected = useRef(false);

  const connect = useCallback(() => {
    if (socket?.connected || isConnected.current) return;

    const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001';
    
    socket = io(socketUrl, {
      autoConnect: true,
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socket.on('connect', () => {
      console.log('Socket connected:', socket?.id);
      isConnected.current = true;
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
      isConnected.current = false;
    });

    socket.on('order:created', (order: Order) => {
      console.log('New order created:', order);
    });

    socket.on('order:updated', (order: Order) => {
      console.log('Order updated:', order);
      updateOrder(order);
    });

    // Listen for real-time order status updates
    socket.on('order:status', (data: { 
      orderId: string; 
      status: string; 
      order: Order;
      updatedAt: string;
    }) => {
      console.log('Order status update received:', data);
      if (data.order) {
        updateOrder(data.order);
        // Also update current order if it matches
        setCurrentOrder(data.order);
      }
    });

    // Listen for broadcast status updates
    socket.on('order:status:broadcast', (data: { 
      orderId: string; 
      status: string; 
      order: Order;
      updatedAt: string;
    }) => {
      console.log('Broadcast order status update:', data);
      if (data.order) {
        updateOrder(data.order);
      }
    });
  }, [updateOrder, setCurrentOrder]);

  const disconnect = useCallback(() => {
    if (socket) {
      socket.disconnect();
      socket = null;
      isConnected.current = false;
    }
  }, []);

  const joinOrderRoom = useCallback((orderId: string) => {
    if (socket?.connected) {
      socket.emit('join-order', orderId);
      console.log('Joined order room:', orderId);
    }
  }, []);

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);

  return {
    socket,
    joinOrderRoom,
    disconnect,
    isConnected: isConnected.current,
  };
}