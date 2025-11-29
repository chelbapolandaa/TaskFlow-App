import React, { createContext, useState, useContext, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { useSocket } from './SocketContext';
// import { useNotification } from './NotificationContext'; // ❌ COMMENT DULU

const TaskContext = createContext();

export const useTask = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTask must be used within a TaskProvider');
  }
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { socket, isConnected, emitTaskCreated, emitTaskUpdated, emitTaskDeleted, emitTaskStatusChanged } = useSocket();
  // const { fetchNotifications } = useNotification(); // ❌ COMMENT DULU

  // Get all tasks
  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await taskService.getTasks();
      setTasks(response.data);
    } catch (error) {
      setError('Failed to fetch tasks');
      console.error('Fetch tasks error:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create new task
  const createTask = async (taskData) => {
    try {
      setError('');
      const response = await taskService.createTask(taskData);
      
      if (response.success) {
        setTasks(prev => [response.data, ...prev]);
        
        // 🔄 Emit real-time event
        if (isConnected) {
          emitTaskCreated(response.data);
        }
        
        return { success: true, data: response.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create task';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Update task
  const updateTask = async (id, taskData) => {
    try {
      setError('');
      const response = await taskService.updateTask(id, taskData);
      
      if (response.success) {
        setTasks(prev => prev.map(task => 
          task._id === id ? response.data : task
        ));
        
        // 🔄 Emit real-time event
        if (isConnected) {
          emitTaskUpdated(response.data);
        }
        
        return { success: true, data: response.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Update task status
  const updateTaskStatus = async (id, status) => {
    try {
      setError('');
      const response = await taskService.updateTaskStatus(id, status);
      
      if (response.success) {
        setTasks(prev => prev.map(task => 
          task._id === id ? response.data : task
        ));
        
        // 🔄 Emit real-time event
        if (isConnected) {
          emitTaskStatusChanged({
            taskId: id,
            newStatus: status,
            task: response.data
          });
        }

        // Refresh notifications - COMMENT DULU
        // fetchNotifications();
        
        return { success: true, data: response.data };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update task status';
      setError(message);
      return { success: false, error: message };
    }
  };

  // Delete task
  const deleteTask = async (id) => {
    try {
      setError('');
      await taskService.deleteTask(id);
      setTasks(prev => prev.filter(task => task._id !== id));
      
      // 🔄 Emit real-time event
      if (isConnected) {
        emitTaskDeleted(id);
      }
      
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete task';
      setError(message);
      return { success: false, error: message };
    }
  };

  // 🔄 Listen for real-time updates from other users
  useEffect(() => {
    if (socket && isConnected) {
      console.log('👂 Listening for real-time task updates...');

      // New task created by other users
      socket.on('new-task', (task) => {
        console.log('📥 Real-time: New task received', task.title);
        setTasks(prev => {
          const exists = prev.find(t => t._id === task._id);
          if (!exists) {
            return [task, ...prev];
          }
          return prev;
        });
      });

      // Task updated by other users
      socket.on('task-update', (task) => {
        console.log('📥 Real-time: Task update received', task.title);
        setTasks(prev => prev.map(t => 
          t._id === task._id ? task : t
        ));
      });

      // Task deleted by other users
      socket.on('task-delete', (taskId) => {
        console.log('📥 Real-time: Task delete received', taskId);
        setTasks(prev => prev.filter(t => t._id !== taskId));
      });

      // Task status changed by other users
      socket.on('task-status-update', (data) => {
        console.log('📥 Real-time: Task status update received', data);
        setTasks(prev => prev.map(t => 
          t._id === data.taskId ? { ...t, status: data.newStatus, column: data.newStatus } : t
        ));
      });

      // Cleanup listeners
      return () => {
        socket.off('new-task');
        socket.off('task-update');
        socket.off('task-delete');
        socket.off('task-status-update');
      };
    }
  }, [socket, isConnected]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const value = {
    tasks,
    loading,
    error,
    fetchTasks,
    createTask,
    updateTask,
    updateTaskStatus,
    deleteTask
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
};