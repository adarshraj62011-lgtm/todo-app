import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useAuth } from '../context/AuthContext';
import { FiCheckCircle, FiClock, FiActivity, FiStar, FiPlus, FiList } from 'react-icons/fi';
import { format } from 'date-fns';

const StatCard = ({ title, value, icon, colorClass, delayClass }) => (
  <div className={`glass-card p-6 flex items-center gap-4 animate-fade-in ${delayClass} hover:translate-y-[-4px] transition-all duration-300 cursor-pointer`}>
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl ${colorClass}`}>
      {icon}
    </div>
    <div>
      <h3 className="text-slate-500 dark:text-slate-400 font-medium text-sm lg:text-base">{title}</h3>
      <p className="text-3xl font-bold text-slate-800 dark:text-white mt-1">{value}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const navigate = useNavigate();
  const { tasks, loading, fetchTasks } = useTasks();
  const { user } = useAuth();
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, highPriority: 0 });

  useEffect(() => {
    fetchTasks();
  }, []);

  useEffect(() => {
    if (tasks) {
      setStats({
        total: tasks.length,
        completed: tasks.filter(t => t.status === 'completed').length,
        pending: tasks.filter(t => t.status === 'pending').length,
        highPriority: tasks.filter(t => t.priority === 'High' && t.status === 'pending').length,
      });
    }
  }, [tasks]);

  const recentTasks = tasks?.slice(0, 5) || [];

  return (
    <div className="space-y-8">
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fade-in stagger-1">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back, {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Here's what's happening with your tasks today.
          </p>
        </div>
        <button 
          onClick={() => navigate('/tasks?new=true')} 
          className="btn-primary"
        >
          <FiPlus className="text-lg" />
          <span>New Task</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Tasks" 
          value={stats.total} 
          icon={<FiActivity />} 
          colorClass="bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400 shadow-inner shadow-blue-500/20"
          delayClass="stagger-1"
        />
        <StatCard 
          title="Completed" 
          value={stats.completed} 
          icon={<FiCheckCircle />} 
          colorClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400 shadow-inner shadow-emerald-500/20"
          delayClass="stagger-2"
        />
        <StatCard 
          title="Pending" 
          value={stats.pending} 
          icon={<FiClock />} 
          colorClass="bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-400 shadow-inner shadow-amber-500/20"
          delayClass="stagger-3"
        />
        <StatCard 
          title="High Priority" 
          value={stats.highPriority} 
          icon={<FiStar />} 
          colorClass="bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-400 shadow-inner shadow-rose-500/20"
          delayClass="stagger-4"
        />
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Tasks */}
        <div className="lg:col-span-2 glass-card p-6 animate-fade-in stagger-3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white">Recent Tasks</h2>
            <button className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              View All
            </button>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-8">
              <span className="w-8 h-8 border-4 border-slate-200 border-t-blue-500 rounded-full animate-spin"></span>
            </div>
          ) : recentTasks.length === 0 ? (
            <div className="text-center py-10">
              <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                <FiList className="text-2xl text-slate-400" />
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-medium">No tasks found. Create one to get started!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task._id} className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-700/50 bg-white/50 dark:bg-slate-800/30 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-colors group">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${
                      task.priority === 'High' ? 'bg-red-500' : 
                      task.priority === 'Medium' ? 'bg-amber-500' : 'bg-green-500'
                    }`} />
                    <div>
                      <h4 className={`font-semibold text-sm sm:text-base ${task.status === 'completed' ? 'text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>
                        {task.title}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 flex items-center gap-2">
                        <span className="bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded text-[10px] font-medium uppercase tracking-wider">
                          {task.category}
                        </span>
                        {task.dueDate && (
                          <span>Due: {format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${
                      task.status === 'completed' 
                        ? 'bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20' 
                        : 'bg-amber-50 text-amber-600 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20'
                    }`}>
                      {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Productivity Chart (Mock) */}
        <div className="glass-card p-6 animate-fade-in stagger-4 overflow-hidden">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Productivity</h2>
          <div className="overflow-x-auto pb-4 hide-scrollbar">
            <div className="min-w-[300px]">
              <div className="flex items-end justify-between h-48 mb-4 border-b border-slate-200 dark:border-slate-700 pb-2">
                {[40, 70, 45, 90, 60, 80, 50].map((height, i) => (
                  <div key={i} className="w-[10%] bg-gradient-to-t from-blue-500 to-indigo-400 rounded-t-md hover:opacity-80 transition-opacity cursor-pointer group relative" style={{ height: `${height}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-20">
                      {height}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 font-medium px-1">
                <span>M</span><span>T</span><span>W</span><span>T</span><span>F</span><span>S</span><span>S</span>
              </div>
            </div>
          </div>
          <div className="mt-6 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">
            <p className="text-sm text-indigo-800 dark:text-indigo-300 font-medium mb-1">Weekly Goal Progress</p>
            <div className="h-2 w-full bg-indigo-200 dark:bg-indigo-800/50 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full" style={{ width: '65%' }}></div>
            </div>
            <p className="text-right text-xs text-indigo-600 dark:text-indigo-400 mt-2 font-bold">65%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
