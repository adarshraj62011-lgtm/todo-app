import React, { useState, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useTasks } from '../context/TaskContext';
import { useNavigate } from 'react-router-dom';

import enUS from 'date-fns/locale/en-US';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const CalendarView = () => {
  const { tasks, fetchTasks } = useTasks();
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  }, []);

  // Format tasks for the calendar
  const events = tasks
    .filter(task => task.dueDate) // Only tasks with due dates
    .map(task => ({
      id: task._id,
      title: task.title,
      start: new Date(task.dueDate),
      end: new Date(task.dueDate),
      allDay: true,
      resource: task
    }));

  const EventComponent = ({ event }) => {
    const isCompleted = event.resource.status === 'completed';
    return (
      <div className={`p-1 text-xs sm:text-sm font-medium rounded truncate ${
        isCompleted ? 'line-through text-slate-400' : 'text-slate-800 dark:text-white'
      }`}>
        {event.title}
      </div>
    );
  };

  const eventPropGetter = (event) => {
    let bgColor = '#3b82f6'; // default blue
    if (event.resource.status === 'completed') {
      bgColor = '#10b981'; // green
    } else if (event.resource.priority === 'High') {
      bgColor = '#ef4444'; // red
    } else if (event.resource.priority === 'Medium') {
      bgColor = '#f59e0b'; // amber
    }
    
    return {
      style: {
        backgroundColor: bgColor,
        borderRadius: '6px',
        opacity: 0.9,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  return (
    <div className="space-y-6 h-full flex flex-col animate-fade-in stagger-1">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Calendar View</h1>
      </div>
      
      <div className="flex-1 glass-card p-4 sm:p-6 min-h-[500px] sm:min-h-[600px] overflow-hidden flex flex-col">
        <style dangerouslySetInnerHTML={{__html: `
          .rbc-calendar { font-family: 'Inter', sans-serif; min-width: 600px; }
          .calendar-container { overflow-x: auto; flex: 1; border-radius: 12px; }
          .rbc-header { padding: 10px; font-weight: 600; color: #475569; border-bottom: 1px solid #e2e8f0; }
          .dark .rbc-header { color: #cbd5e1; border-color: #334155; }
          .rbc-month-view { border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden; }
          .dark .rbc-month-view { border-color: #334155; }
          .rbc-day-bg { border-left: 1px solid #e2e8f0; }
          .dark .rbc-day-bg { border-left: 1px solid #334155; }
          .rbc-month-row { border-top: 1px solid #e2e8f0; }
          .dark .rbc-month-row { border-top: 1px solid #334155; }
          .rbc-today { background-color: rgba(59, 130, 246, 0.05); }
          .dark .rbc-today { background-color: rgba(59, 130, 246, 0.1); }
          .rbc-off-range-bg { background-color: rgba(241, 245, 249, 0.5); }
          .dark .rbc-off-range-bg { background-color: rgba(15, 23, 42, 0.3); }
          .rbc-button-link { color: inherit; }
          .rbc-toolbar { margin-bottom: 20px; flex-wrap: wrap; gap: 10px; }
          .rbc-toolbar button { color: #475569; border-color: #e2e8f0; padding: 6px 12px; font-size: 14px; }
          .dark .rbc-toolbar button { color: #cbd5e1; border-color: #334155; }
          .rbc-toolbar button:active, .rbc-toolbar button.rbc-active { background-color: #f1f5f9; box-shadow: none; color: #0f172a; }
          .dark .rbc-toolbar button:active, .dark .rbc-toolbar button.rbc-active { background-color: #1e293b; color: #f8fafc; }
          .rbc-toolbar button:hover { background-color: #f8fafc; }
          .dark .rbc-toolbar button:hover { background-color: #334155; }
        `}} />
        <div className="calendar-container hide-scrollbar">
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: '100%' }}
            views={['month', 'week', 'agenda']}
            eventPropGetter={eventPropGetter}
            components={{
              event: EventComponent
            }}
            onSelectEvent={(event) => navigate('/tasks')}
          />
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
