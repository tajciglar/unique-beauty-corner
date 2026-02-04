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
  const [isLoading, setIsLoading] = useState(true);

  // Fetch appointments and notifications on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch appointments
        const appointmentData = await fetchAppointments();
        if (appointmentData) {
          setClientAppointments(appointmentData.bookedAppointments as Appointment[]);
          setAvailableAppointments(appointmentData.availableAppointments);
        }

        // Fetch notifications from API
        const notificationsRes = await fetch('/api/notifications');
        if (notificationsRes.ok) {
          const notificationsData = await notificationsRes.json();
          setNotifications(notificationsData);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleAddNotification = async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(notification),
      });

      if (response.ok) {
        const newNotification = await response.json();
        setNotifications([newNotification, ...notifications]);
      }
    } catch (error) {
      console.error('Error adding notification:', error);
      alert('Napaka pri dodajanju obvestila');
    }
  };

  const handleUpdateNotification = async (id: string, updatedData: Partial<Notification>) => {
    try {
      const response = await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updatedData }),
      });

      if (response.ok) {
        const updatedNotification = await response.json();
        setNotifications(notifications.map(n => 
          n.id === id ? updatedNotification : n
        ));
      }
    } catch (error) {
      console.error('Error updating notification:', error);
      alert('Napaka pri posodabljanju obvestila');
    }
  };

  const handleDeleteNotification = async (id: string) => {
    if (!confirm('Ste prepričani, da želite izbrisati to obvestilo?')) {
      return;
    }

    try {
      const response = await fetch(`/api/notifications?id=${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setNotifications(notifications.filter(n => n.id !== id));
      }
    } catch (error) {
      console.error('Error deleting notification:', error);
      alert('Napaka pri brisanju obvestila');
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center">
        <p>Nalaganje...</p>
      </div>
    );
  }

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