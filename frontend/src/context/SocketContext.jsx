import React, { createContext, useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';
import { useAuth } from './AuthContext';

const SocketContext = createContext();

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      console.log('🔌 Connecting to socket server...');
      
      const newSocket = io('http://localhost:5000', {
        withCredentials: true,
        transports: ['websocket', 'polling']
      });

      newSocket.on('connect', () => {
        console.log('✅ Socket connected:', newSocket.id);
        setIsConnected(true);
        
        // Join user room
        newSocket.emit('join-user', user.id);
      });

      newSocket.on('disconnect', () => {
        console.log('❌ Socket disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('❌ Socket connection error:', error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      // Cleanup on unmount
      return () => {
        console.log('🧹 Cleaning up socket connection');
        newSocket.disconnect();
      };
    }
  }, [user]);

  // Listen for online users
  useEffect(() => {
    if (socket) {
      socket.on('user-online', (userData) => {
        setOnlineUsers(prev => {
          const exists = prev.find(u => u.userId === userData.userId);
          if (!exists) {
            return [...prev, userData];
          }
          return prev;
        });
      });

      return () => {
        socket.off('user-online');
      };
    }
  }, [socket]);

  const value = {
    socket,
    isConnected,
    onlineUsers,
    emitTaskCreated: (task) => {
      if (socket && isConnected) {
        socket.emit('task-created', task);
      }
    },
    emitTaskUpdated: (task) => {
      if (socket && isConnected) {
        socket.emit('task-updated', task);
      }
    },
    emitTaskDeleted: (taskId) => {
      if (socket && isConnected) {
        socket.emit('task-deleted', taskId);
      }
    },
    emitTaskStatusChanged: (data) => {
      if (socket && isConnected) {
        socket.emit('task-status-changed', data);
      }
    },
    emitNotificationCreated: (notification) => {
      if (socket && isConnected) {
        socket.emit('notification-created', notification);
      }
    }
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
};