import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { FiPlus, FiFilter, FiSearch, FiEdit2, FiTrash2, FiClock, FiCheckCircle, FiDownload, FiMenu } from 'react-icons/fi';
import { format } from 'date-fns';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Papa from 'papaparse';

import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const TaskModal = ({ task, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'Medium',
    category: 'Personal',
    dueDate: '',
  });

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title,
        description: task.description || '',
        status: task.status,
        priority: task.priority,
        category: task.category,
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : '',
      });
    }
  }, [task]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto m-4">
        <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-white">
          {task ? 'Edit Task' : 'Create New Task'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Title</label>
            <input
              type="text"
              required
              className="input-field mt-1"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description</label>
            <textarea
              className="input-field mt-1 resize-none h-24"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
              <select
                className="input-field mt-1"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                {['Work', 'Personal', 'Study', 'Shopping', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Priority</label>
              <select
                className="input-field mt-1"
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              >
                {['Low', 'Medium', 'High'].map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Status</label>
              <select
                className="input-field mt-1"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Due Date</label>
              <input
                type="date"
                className="input-field mt-1"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-slate-200 dark:border-slate-700">
            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
            <button type="submit" className="btn-primary" style={{ margin: 0 }}>Save Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SortableTaskItem = ({ task, updateTask, deleteTask, openApp }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style} 
      className={`glass-card p-5 group flex flex-col sm:flex-row gap-4 sm:items-center justify-between hover:bg-white/80 dark:hover:bg-slate-800/80 ${isDragging ? 'shadow-2xl border-blue-500 ring-2 ring-blue-500/50' : ''}`}
    >
      <div className="flex gap-4 items-start w-full">
        <div {...attributes} {...listeners} className="mt-1 cursor-grab active:cursor-grabbing text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
          <FiMenu className="text-lg" />
        </div>
        
        <button 
          onClick={() => updateTask(task._id, { status: task.status === 'completed' ? 'pending' : 'completed' })}
          className={`w-6 h-6 mt-1 shrink-0 rounded-full border-2 flex items-center justify-center transition-all ${
            task.status === 'completed' 
              ? 'bg-emerald-500 border-emerald-500 text-white' 
              : 'border-slate-300 dark:border-slate-600 hover:border-blue-500 text-transparent'
          }`}
        >
          <FiCheckCircle className="text-sm" />
        </button>
        <div className="flex-1">
          <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-white'}`}>
            {task.title}
          </h3>
          {task.description && (
            <p className={`text-sm mt-1 line-clamp-2 ${task.status === 'completed' ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
              {task.description}
            </p>
          )}
          <div className="flex flex-wrap gap-2 mt-3 items-center text-xs font-medium text-slate-500">
            <span className="bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 px-2.5 py-1 rounded-md border border-blue-100 dark:border-blue-800/50">
              {task.category}
            </span>
            <span className={`px-2.5 py-1 rounded-md border ${
              task.priority === 'High' ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800/50' : 
              task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border-amber-100 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800/50' : 
              'bg-emerald-50 text-emerald-600 border-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800/50'
            }`}>
              {task.priority}
            </span>
            {task.dueDate && (
              <span className="flex items-center gap-1 bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 px-2.5 py-1 rounded-md">
                <FiClock className="text-[10px]" /> 
                {format(new Date(task.dueDate), 'MMM dd, yyyy')}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:opacity-0 group-hover:opacity-100 transition-opacity ml-10 sm:ml-0 self-end sm:self-center">
        <button onClick={() => openApp(task)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
          <FiEdit2 />
        </button>
        <button onClick={() => deleteTask(task._id)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-slate-700/50 rounded-lg transition-colors">
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

const Tasks = () => {
  const { tasks, loading, filters, setFilters, addTask, updateTask, deleteTask, reorderTasks } = useTasks();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (searchParams.get('new') === 'true') {
      setEditingTask(null);
      setIsModalOpen(true);
      searchParams.delete('new');
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const handleSave = async (formData) => {
    try {
      if (editingTask) {
        await updateTask(editingTask._id, formData);
      } else {
        await addTask(formData);
      }
      setIsModalOpen(false);
      setEditingTask(null);
    } catch (error) {
    }
  };

  const openApp = (task = null) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = tasks.findIndex((item) => item._id === active.id);
      const newIndex = tasks.findIndex((item) => item._id === over.id);
      
      const newTasks = arrayMove(tasks, oldIndex, newIndex);
      reorderTasks(newTasks);
    }
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text('My Tasks List', 14, 15);
    const tableColumn = ["Title", "Description", "Category", "Priority", "Status", "Due Date"];
    const tableRows = tasks.map(t => [
      t.title, 
      t.description || '',
      t.category, 
      t.priority, 
      t.status, 
      t.dueDate ? format(new Date(t.dueDate), 'MMM dd, yyyy') : 'N/A'
    ]);
    autoTable(doc, { 
      head: [tableColumn], 
      body: tableRows, 
      startY: 20,
      styles: { fontSize: 8 },
      columnStyles: { 1: { cellWidth: 40 } }
    });
    doc.save(`tasks_${format(new Date(), 'yyyy-MM-dd')}.pdf`);
  };

  const exportCSV = () => {
    const csvData = tasks.map(t => ({
      Title: t.title,
      Description: t.description || '',
      Category: t.category,
      Priority: t.priority,
      Status: t.status,
      DueDate: t.dueDate ? format(new Date(t.dueDate), 'yyyy-MM-dd') : 'N/A'
    }));
    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `tasks_${format(new Date(), 'yyyy-MM-dd')}.csv`;
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col xl:flex-row justify-between xl:items-center gap-4 animate-fade-in stagger-1">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">All Tasks</h1>
        <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200 dark:border-slate-700 rounded-lg pl-10 pr-4 py-2 text-sm text-slate-700 dark:text-slate-200 focus:ring-2 ring-blue-500/30 outline-none w-full sm:w-48 lg:w-64"
              value={filters.search}
              onChange={(e) => setFilters({...filters, search: e.target.value})}
            />
          </div>
          
          <div className="flex items-center gap-2 bg-white/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 rounded-lg p-1">
            <button onClick={exportPDF} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" title="Export PDF">
              <FiDownload /> PDF
            </button>
            <button onClick={exportCSV} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors" title="Export CSV">
              <FiDownload /> CSV
            </button>
          </div>

          <button onClick={() => openApp()} className="btn-primary py-2 px-4 shadow-sm flex items-center justify-center gap-2">
            <FiPlus /> <span>New Task</span>
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6 overflow-x-auto pb-2 hide-scrollbar animate-fade-in stagger-2">
        <select 
          className="bg-white/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm max-w-[150px] cursor-pointer outline-none"
          value={filters.category}
          onChange={(e) => setFilters({...filters, category: e.target.value})}
        >
          <option value="">All Categories</option>
          <option value="Work">Work</option>
          <option value="Personal">Personal</option>
          <option value="Study">Study</option>
          <option value="Shopping">Shopping</option>
        </select>
        <select 
          className="bg-white/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm max-w-[150px] cursor-pointer outline-none"
          value={filters.priority}
          onChange={(e) => setFilters({...filters, priority: e.target.value})}
        >
          <option value="">All Priorities</option>
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
        <select 
          className="bg-white/50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-sm max-w-[150px] cursor-pointer outline-none"
          value={filters.status}
          onChange={(e) => setFilters({...filters, status: e.target.value})}
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
        
        <button 
          onClick={() => setFilters({ category: '', priority: '', status: '', search: '' })}
          className="text-sm text-slate-500 hover:text-red-500 transition-colors ml-auto grid place-items-center whitespace-nowrap px-4 border border-transparent"
        >
          Clear Filters
        </button>
      </div>

      <div className="grid gap-4 animate-fade-in stagger-3">
        {loading ? (
          <div className="flex justify-center py-20"><span className="animate-spin w-8 h-8 border-4 border-t-blue-500 border-slate-200 rounded-full" /></div>
        ) : tasks.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <FiCheckCircle className="text-6xl text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-300">No tasks Found</h3>
            <p className="text-slate-500 mt-2">Adjust your filters or create a new task.</p>
          </div>
        ) : (
          <DndContext 
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext 
              items={tasks.map(t => t._id)}
              strategy={verticalListSortingStrategy}
            >
              {tasks.map((task) => (
                <SortableTaskItem 
                  key={task._id} 
                  task={task} 
                  updateTask={updateTask} 
                  deleteTask={deleteTask} 
                  openApp={openApp} 
                />
              ))}
            </SortableContext>
          </DndContext>
        )}
      </div>

      {isModalOpen && (
        <TaskModal
          task={editingTask}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Tasks;
