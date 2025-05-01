'use client';

import AdminCalendar from '../../components/AdminCalendar';
import fetchAppointments from '@/hooks/useFetchAppointments';
import { useState, useEffect } from 'react';
import { Appointment } from '@/types/types';
import NewAppointment from '@/components/NewAppointment';

export default function AdminPage() {
  const [clientAppointments, setClientAppointments] = useState<Appointment[]>([]);
  const [availableAppointments, setAvailableAppointments] = useState<Appointment[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchAppointments();
      console.log('Fetched appointments:', data);
      if (data) {
        setClientAppointments(data.bookedAppointments as Appointment[]);
        setAvailableAppointments(data.availableAppointments);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="w-full h-full p-4 grid grid-cols-[300px_1fr] gap-4">
      <NewAppointment></NewAppointment>
      <div className='mt-4'>  
        <AdminCalendar 
        clientAppointments={clientAppointments} 
        availableAppointments={availableAppointments} 
      />
      </div>
    </div>
  );
}