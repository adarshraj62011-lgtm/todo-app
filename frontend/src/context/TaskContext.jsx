import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../utils/api';
import { useAuth } from './AuthContext';
import { toast } from 'react-toastify';

/**
 * TaskContext serves as the central state management for task-related data and operations.
 * It handles fetching, creating, updating, deleting, and reordering tasks via API integration.
 */
const TaskContext = createContext();

export const useTasks = () => useContext(TaskContext);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  
  // Local state for sidebar filters and search
  const [filters, setFilters] = useState({ category: '', priority: '', status: '', search: '' });

  /**
   * Fetch all tasks from the backend based on currently applied filters.
   */
  const fetchTasks = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Construct dynamic query string for server-side filtering
      const params = new URLSearchParams();
      if (filters.category) params.append('category', filters.category);
      if (filters.priority) params.append('priority', filters.priority);
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);

      const { data } = await api.get(`/tasks?${params.toString()}`);
      setTasks(data);
    } catch (error) {
      toast.error('Failed to sync tasks with server');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch tasks whenever filters change or user session updates
  useEffect(() => {
    fetchTasks();
  }, [user, filters]);

  /**
   * Monitor tasks for upcoming due dates and display browser notifications.
   */
  useEffect(() => {
    if (tasks.length === 0) return;
    
    const today = new Date().toISOString().split('T')[0];
    const dueToday = tasks.filter(t => t.status !== 'completed' && t.dueDate && t.dueDate.startsWith(today));
    
    if (dueToday.length > 0) {
      const shownKey = `notified_${today}`;
      // Ensure notification is only shown once per day session
      if (!localStorage.getItem(shownKey)) {
        toast.info(`Reminder: You have ${dueToday.length} task(s) due today!`, { 
          autoClose: false,
          position: "top-center"
        });
        localStorage.setItem(shownKey, '1');
      }
    }
  }, [tasks]);

  /**
   * Create a new task and update local state upon success.
   */
  const addTask = async (taskData) => {
    try {
      const { data } = await api.post('/tasks', taskData);
      setTasks(prev => [...prev, data]);
      toast.success('Task created successfully');
      return data;
    } catch (error) {
      toast.error('Failed to create task');
      throw error;
    }
  };

  /**
   * Update an existing task's properties.
   */
  const updateTask = async (id, taskData) => {
    try {
      const { data } = await api.put(`/tasks/${id}`, taskData);
      setTasks(prev => prev.map(task => task._id === id ? data : task));
      
      // Only show success toast if we're not just toggling completion/status
      if (!taskData.hasOwnProperty('status') || Object.keys(taskData).length > 1) {
        toast.success('Task updated');
      }
      return data;
    } catch (error) {
      toast.error('Failed to update task');
      throw error;
    }
  };

  /**
   * Delete a task from both backend and local state.
   */
  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(prev => prev.filter(task => task._id !== id));
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
      throw error;
    }
  };

  /**
   * PERSISTENT REORDERING: Updates tasks on the server.
   * Uses optimistic UI updates for zero-latency feel during Drag & Drop.
   */
  const reorderTasks = async (reorderedTasksData) => {
    try {
      // Update local state instantly for UI responsiveness
      setTasks(reorderedTasksData);

      // Prepare lightweight payload for server-side bulk update
      const tasksPayload = reorderedTasksData.map((task, index) => ({
        id: task._id,
        order: index,
        status: task.status
      }));

      await api.put('/tasks/reorder', { tasks: tasksPayload });
    } catch (error) {
      toast.error('Reordering sync failed');
      console.error(error);
      fetchTasks(); // Rollback to server state on error
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      loading,
      filters,
      setFilters,
      addTask,
      updateTask,
      deleteTask,
      reorderTasks,
      fetchTasks
    }}>
      {children}
    </TaskContext.Provider>
  );
};
