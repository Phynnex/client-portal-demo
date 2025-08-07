"use client";
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CheckCircle,
  Clock,
  AlertCircle,
  X,
  Bell,
  Upload,
  FileText,
  CreditCard,
  Calendar,
  User,
  TrendingUp,
  Shield,
  Search,
  MoreVertical,
  Check,
} from 'lucide-react';
import { Button, Input, Select } from '@/components/ui';
import { useQuery } from '@tanstack/react-query';
import type { Task, Notification } from '@/types';

const iconMap = { Upload, FileText, Calendar, Shield, CreditCard, TrendingUp, AlertCircle, User };

const statusConfig = {
  pending: { color: 'text-orange-600', bg: 'bg-orange-100', label: 'Pending' },
  'in-progress': { color: 'text-blue-600', bg: 'bg-blue-100', label: 'In Progress' },
  completed: { color: 'text-green-600', bg: 'bg-green-100', label: 'Completed' }
};

const priorityConfig = {
  high: { color: 'text-red-600', bg: 'bg-red-100', label: 'High' },
  medium: { color: 'text-yellow-600', bg: 'bg-yellow-100', label: 'Medium' },
  low: { color: 'text-green-600', bg: 'bg-green-100', label: 'Low' }
};

const notificationTypes = {
  success: { color: 'text-green-600', bg: 'bg-green-100' },
  info: { color: 'text-blue-600', bg: 'bg-blue-100' },
  warning: { color: 'text-orange-600', bg: 'bg-orange-100' },
  error: { color: 'text-red-600', bg: 'bg-red-100' }
};

const filterSchema = z.object({
  search: z.string().default(''),
  status: z.enum(['all', 'pending', 'in-progress', 'completed']),
  priority: z.enum(['all', 'high', 'medium', 'low'])
});
type FilterForm = z.infer<typeof filterSchema>;

export default function TasksNotificationsPage() {
  const [activeTab, setActiveTab] = useState('tasks');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotificationBanner, setShowNotificationBanner] = useState(true);

  const { register, watch, formState: { errors } } = useForm<FilterForm>({
    resolver: zodResolver(filterSchema),
    defaultValues: { search: '', status: 'all', priority: 'all' }
  });
  const searchTerm = watch('search');
  const filterStatus = watch('status');
  const filterPriority = watch('priority');

  const { data: tasksQueryData = [], isLoading: tasksLoading, isError: tasksError } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/tasks');
      if (!res.ok) {
        throw new Error('Failed to fetch tasks');
      }
      return res.json();
    },
  });

  const { data: notificationsQueryData = [], isLoading: notifLoading, isError: notifError } = useQuery<Notification[]>({
    queryKey: ['notifications'],
    queryFn: async () => {
      const res = await fetch('/api/notifications');
      if (!res.ok) {
        throw new Error('Failed to fetch notifications');
      }
      return res.json();
    },
  });

  useEffect(() => {
    setTasks(tasksQueryData);
  }, [tasksQueryData]);

  useEffect(() => {
    setNotifications(notificationsQueryData);
  }, [notificationsQueryData]);

  if (tasksLoading || notifLoading) {
    return <div className="p-4 sm:p-6 lg:p-8">Loading...</div>;
  }

  if (tasksError || notifError) {
    return <div className="p-4 sm:p-6 lg:p-8">Error loading data.</div>;
  }

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || task.priority === filterPriority;
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesPriority && matchesSearch;
  });

  // Get task counts
  const taskCounts = {
    pending: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };

  // Get unread notifications count
  const unreadCount = notifications.filter(n => !n.read).length;

 


  const handleTaskStatusUpdate = (taskId: number, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

 

  const handleMarkAsRead = (notificationId: number) => {
    setNotifications(notifications.map((notification: Notification) => 
      notification.id === notificationId ? { ...notification, read: true } : notification
    ));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map(notification => ({ ...notification, read: true })));
  };

  const formatDate = (dateString: string | number | Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTimestamp = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (Number(now) - Number(date)) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      });
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Tasks & Notifications</h1>
        <p className="text-slate-600">Manage your pending tasks and stay updated with important notifications</p>
      </div>

      {/* Notification Banner */}
      {showNotificationBanner && unreadCount > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bell className="h-5 w-5 text-blue-600" />
            <div>
              <p className="font-medium text-blue-900">You have {unreadCount} unread notifications</p>
              <p className="text-sm text-blue-700">Stay updated with your latest account activities</p>
            </div>
          </div>
          <Button
            onClick={() => setShowNotificationBanner(false)}
            variant="ghost"
            className="text-blue-500 hover:text-blue-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100 rounded-lg p-1 mb-6 w-fit">
        <Button
          onClick={() => setActiveTab('tasks')}
          variant="ghost"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
            activeTab === 'tasks'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Tasks
          {taskCounts.pending > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {taskCounts.pending}
            </span>
          )}
        </Button>
        <Button
          onClick={() => setActiveTab('notifications')}
          variant="ghost"
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors relative ${
            activeTab === 'notifications'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Notifications
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </div>

      {/* Tasks Tab */}
      {activeTab === 'tasks' && (
        <div>
          {/* Task Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Pending Tasks</p>
                  <p className="text-2xl font-bold text-orange-600">{taskCounts.pending}</p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{taskCounts['in-progress']}</p>
                </div>
                <AlertCircle className="h-8 w-8 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{taskCounts.completed}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </div>

          {/* Task Filters */}
          <div className="bg-white rounded-lg border border-slate-200 p-4 mb-6">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search tasks..."
                  className="w-full pl-10 pr-4 py-2 text-sm"
                  {...register('search')}
                />
                {errors.search && (
                  <p className="text-red-600 text-xs mt-1">{errors.search.message}</p>
                )}
              </div>

              {/* Filters */}
              <div className="flex items-center space-x-4">
                <div className="flex flex-col">
                  <Select className="px-3 py-2 text-sm" {...register('status')}>
                    <option value="all">All Status</option>
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </Select>
                  {errors.status && (
                    <p className="text-red-600 text-xs mt-1">{errors.status.message}</p>
                  )}
                </div>

                <div className="flex flex-col">
                  <Select className="px-3 py-2 text-sm" {...register('priority')}>
                    <option value="all">All Priority</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </Select>
                  {errors.priority && (
                    <p className="text-red-600 text-xs mt-1">{errors.priority.message}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Tasks List */}
          <div className="space-y-4">
        {filteredTasks.map((task) => {
          const Icon = iconMap[task.icon as keyof typeof iconMap];
              const statusInfo = statusConfig[task.status as keyof typeof statusConfig];
              const priorityInfo = priorityConfig[task.priority as keyof typeof priorityConfig];

              return (
                <div key={task.id} className="bg-white rounded-lg border border-slate-200 p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      <div className="bg-slate-100 p-3 rounded-lg">
                        <Icon className="h-6 w-6 text-slate-600" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{task.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.bg} ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${priorityInfo.bg} ${priorityInfo.color}`}>
                            {priorityInfo.label} Priority
                          </span>
                        </div>
                        
                        <p className="text-slate-600 mb-3">{task.description}</p>
                        
                        <div className="flex items-center justify-between text-sm text-slate-500">
                          <div className="flex items-center space-x-4">
                            <span>Due: {formatDate(task.dueDate)}</span>
                            <span>Created: {formatDate(task.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {task.status === 'pending' && (
                        <Button
                          onClick={() => handleTaskStatusUpdate(task.id, 'in-progress')}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm"
                        >
                          Start
                        </Button>
                      )}
                      {task.status === 'in-progress' && (
                        <Button
                          onClick={() => handleTaskStatusUpdate(task.id, 'completed')}
                          className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm"
                        >
                          Complete
                        </Button>
                      )}
                      {task.status === 'completed' && (
                        <div className="flex items-center space-x-1 text-green-600">
                          <Check className="h-4 w-4" />
                          <span className="text-sm font-medium">Done</span>
                        </div>
                      )}
                      <Button variant="ghost" className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <CheckCircle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No tasks found</h3>
              <p className="text-slate-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </div>
      )}

      {/* Notifications Tab */}
      {activeTab === 'notifications' && (
        <div>
          {/* Notification Actions */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-lg font-semibold text-slate-900">Recent Notifications</h2>
              {unreadCount > 0 && (
                <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="ghost"
                className="text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                Mark all as read
              </Button>
            )}
          </div>

          {/* Notifications List */}
          <div className="space-y-2">
            {notifications.map((notification) => {
              const Icon = iconMap[notification.icon as keyof typeof iconMap];
              const typeInfo = notificationTypes[notification.type];

              return (
                <div
                  key={notification.id}
                  className={`bg-white border border-slate-200 rounded-lg p-4 hover:shadow-sm transition-shadow cursor-pointer ${
                    !notification.read ? 'border-l-4 border-l-blue-500' : ''
                  }`}
                  onClick={() => handleMarkAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-2 rounded-lg ${typeInfo.bg}`}>
                      <Icon className={`h-5 w-5 ${typeInfo.color}`} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className={`font-medium ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                          {notification.title}
                        </h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs text-slate-500">{formatTimestamp(notification.timestamp)}</span>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                      <p className={`text-sm ${!notification.read ? 'text-slate-600' : 'text-slate-500'}`}>
                        {notification.message}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-12">
              <Bell className="h-12 w-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-900 mb-2">No notifications</h3>
              <p className="text-slate-600">You&apos;re all caught up! New notifications will appear here.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}