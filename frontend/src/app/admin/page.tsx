'use client';

import AdminCalendar from '../../components/AdminCalendar';
import fetchAppointments from '@/hooks/useFetchAppointments';
import { useState, useEffect } from 'react';
import { ClientAppointment, Appointment } from '@/types/types';

export default function AdminPage() {
  const [clientAppointments, setClientAppointments] = useState<ClientAppointment[]>([]);
  const [availableAppointments, setAvailableAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAppointments();
      if (data) {
        setClientAppointments(data.bookedAppointments);
        setAvailableAppointments(data.availableAppointments);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <AdminCalendar 
        clientAppointments={clientAppointments} 
        availableAppointments={availableAppointments} 
      />
    </div>
  );
}