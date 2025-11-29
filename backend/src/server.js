import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';

// Import routes
import authRoutes from './routes/auth.js';
import taskRoutes from './routes/tasks.js';
import notificationRoutes from './routes/notifications.js';

// Import scheduler
import schedulerService from './services/schedulerService.js';

dotenv.config();

const app = express();
const server = createServer(app);

// Socket.io setup dengan CORS configuration
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true
  }
});

// Connect to database
connectDB();

// CORS configuration
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

// Middleware
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ 
    message: '🚀 TaskFlow Backend API is running!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK',
    database: 'Connected',
    timestamp: new Date().toISOString()
  });
});

// Socket.io Connection Handling
io.on('connection', (socket) => {
  console.log('🔌 User connected:', socket.id);

  // Join user to their room
  socket.on('join-user', (userId) => {
    socket.join(`user-${userId}`);
    console.log(`👤 User ${userId} joined room: user-${userId}`);
    
    // Broadcast user online status
    socket.broadcast.emit('user-online', { userId, socketId: socket.id });
  });

  // Handle task updates
  socket.on('task-created', (task) => {
    console.log('📝 Task created via socket:', task.title);
    socket.broadcast.emit('new-task', task);
  });

  socket.on('task-updated', (task) => {
    console.log('✏️ Task updated via socket:', task.title);
    socket.broadcast.emit('task-update', task);
  });

  socket.on('task-deleted', (taskId) => {
    console.log('🗑️ Task deleted via socket:', taskId);
    socket.broadcast.emit('task-delete', taskId);
  });

  // Handle task status changes (drag & drop)
  socket.on('task-status-changed', (data) => {
    console.log('🎯 Task status changed:', data);
    socket.broadcast.emit('task-status-update', data);
  });

  // Handle notifications
  socket.on('notification-created', (notification) => {
    console.log('🔔 Notification created via socket');
    // Send to specific user room
    io.to(`user-${notification.user}`).emit('new-notification', notification);
  });

  // Handle user typing (optional - untuk future chat features)
  socket.on('user-typing', (data) => {
    socket.broadcast.emit('user-typing', data);
  });

  // Handle disconnect
  socket.on('disconnect', () => {
    console.log('🔌 User disconnected:', socket.id);
  });
});

// Store io instance untuk digunakan di controllers
app.set('io', io);

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.originalUrl
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  console.error('Error:', error);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🎯 Server running on port ${PORT}`);
  console.log(`🔗 http://localhost:${PORT}`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
  console.log(`🔌 Socket.io ready for real-time connections`);
  
  // Start scheduled tasks
  if (process.env.NODE_ENV !== 'test') {
    schedulerService.startDueDateChecker();
  }
});

export { io };