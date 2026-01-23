'use client';
import AdminCalendar from '../../components/AdminCalendar';
import fetchAppointments from '../../hooks/useFetchAppointments';
import { useState, useEffect } from 'react';
import { Appointment } from '../../types/types';
import NewAppointment from '../../components/NewAppointment';
import NotificationManager from '../../components/NotificationManager';

interface Notification {
  id: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'alert';
  isActive: boolean;
  createdAt: Date;
}

export default function AdminPage() {
  const [clientAppointments, setClientAppointments] = useState<Appointment[]>([]);
  const [availableAppointments, setAvailableAppointments] = useState<Appointment[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAppointments();
      if (data) {
        setClientAppointments(data.bookedAppointments as Appointment[]);
        setAvailableAppointments(data.availableAppointments);
      }
    };
    fetchData();

    // Load notifications from localStorage
    const savedNotifications = localStorage.getItem('adminNotifications');
    if (savedNotifications) {
      setNotifications(JSON.parse(savedNotifications));
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    if (notifications.length > 0 || localStorage.getItem('adminNotifications')) {
      localStorage.setItem('adminNotifications', JSON.stringify(notifications));
    }
  }, [notifications]);

  const handleAddNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    setNotifications([newNotification, ...notifications]);
  };

  const handleUpdateNotification = (id: string, updatedData: Partial<Notification>) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, ...updatedData } : n
    ));
  };

  const handleDeleteNotification = (id: string) => {
    if (confirm('Ste prepričani, da želite izbrisati to obvestilo?')) {
      setNotifications(notifications.filter(n => n.id !== id));
    }
  };

  return (
    <div className="w-full h-full p-4 flex flex-col gap-4">
      {/* Notification Management Section */}
      <div className="w-full">
        <NotificationManager
          notifications={notifications}
          onAdd={handleAddNotification}
          onUpdate={handleUpdateNotification}
          onDelete={handleDeleteNotification}
        />
      </div>

      {/* Main Admin Content */}
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-4">
        <div className='h-auto'>
          <NewAppointment />
        </div>
        <div className="mt-4 md:mt-0 h-screen">  
          <AdminCalendar 
            clientAppointments={clientAppointments} 
            availableAppointments={availableAppointments} 
          />
        </div>
      </div>
    </div>
  );
}