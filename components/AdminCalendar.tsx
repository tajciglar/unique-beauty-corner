import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Appointment } from '../types/types';
import ViewAppointment from './ViewAppointment';
import AddAppointment from './AddAppointment';

interface AdminCalendarProps {
  clientAppointments: Appointment[];
  availableAppointments: Appointment[];
}

const AdminCalendar: React.FC<AdminCalendarProps> = ({ clientAppointments, availableAppointments }) => {
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<number | null>(null);
  const [openTermin, setOpenTermin] = useState(false);

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const [clientAppointmentsState, setClientAppointmentsState] = useState(clientAppointments);
  const [availableAppointmentsState, setAvailableAppointmentsState] = useState(availableAppointments);

  useEffect(() => {
    setClientAppointmentsState(clientAppointments);
  }, [clientAppointments]);

  useEffect(() => {
    setAvailableAppointmentsState(availableAppointments);
  }, [availableAppointments]);

  const handleDateClick = (info: { dateStr: string }) => {
    setSelectedDate(info.dateStr);
    setShowAddForm(true);
  };

  const handleSaveAppointment = async (appointmentData: Appointment) => {
    const appointmentExists =
      clientAppointmentsState.some(
        (appointment) =>
          appointment.date === appointmentData.date && appointment.startTime === appointmentData.startTime
      ) ||
      availableAppointmentsState.some(
        (appointment) =>
          appointment.date === appointmentData.date && appointment.startTime === appointmentData.startTime
      );

    if (appointmentExists) {
      alert('Appointment already exists at this time.');
      return;
    }

    try {
      const response = await fetch('/api/appointments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointmentData),
      });

      if (response.ok) {
        const { newAppointment } = await response.json();
        if (!newAppointment.available) {
          setClientAppointmentsState((prev) => [...prev, newAppointment]);
        } else {
          setAvailableAppointmentsState((prev) => [...prev, newAppointment]);
        }
      } else {
        console.error('Failed to save appointment');
      }
    } catch (err) {
      console.error(err);
    }

    setShowAddForm(false);
  };

  const deleteAppointment = async (id: string) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClientAppointmentsState((prev) => prev.filter((appointment) => `${appointment.id}` !== id));
        setAvailableAppointmentsState((prev) => prev.filter((appointment) => `${appointment.id}` !== id));
        setOpenTermin(false);
      } else {
        console.error('Failed to delete appointment');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const updateAppointment = async (id: number, updatedData: Appointment) => {
    try {
      const response = await fetch(`/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (response.ok) {
        const { updatedAppointment } = await response.json();
        setClientAppointmentsState((prev) =>
          prev.map((appointment) => (appointment.id === updatedAppointment.id ? updatedAppointment : appointment))
        );
        setAvailableAppointmentsState((prev) =>
          prev.map((appointment) => (appointment.id === updatedAppointment.id ? updatedAppointment : appointment))
        );
      } else {
        console.error('Failed to update appointment');
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle event click → pass ID only
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEventClick = (event: any) => {
    const appointmentId = Number(event.id);
    setSelectedAppointmentId(appointmentId);
    setOpenTermin(true);
  };

  return (
    <>
      <FullCalendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        editable={true}
        initialView="dayGridMonth"
        dateClick={handleDateClick}
        headerToolbar={{
          left: 'prev next',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        slotMinTime="05:00:00"
        slotMaxTime="24:00:00"
        allDaySlot={false}
        events={[
          ...availableAppointmentsState.map((appointment) => ({
            id: `${appointment.id}`,
            date: appointment.date,
            title: 'Prosti termin',
            start: `${appointment.date}T${appointment.startTime}:00`,
            end: `${appointment.date}T${appointment.endTime}:00`,
          })),
          ...clientAppointmentsState.map((appointment) => ({
            id: `${appointment.id}`,
            title: appointment.order?.name || 'Unknown',
            email: appointment.order?.email || 'Unknown',
            phone: appointment.order?.phone || 'Unknown',
            services: appointment.order?.services || [],
            price: appointment.order?.price || 0,
            date: appointment.date,
            start: `${appointment.date}T${appointment.startTime}:00`,
            end: `${appointment.date}T${appointment.endTime}:00`,
            backgroundColor: '#FFD700',
          })),
        ]}
        eventClick={(info) => handleEventClick(info.event)}
        locale="sl"
      />

      {openTermin && selectedAppointmentId && (
        <ViewAppointment
          appointmentId={selectedAppointmentId}
          onClose={() => setOpenTermin(false)}
          onDelete={deleteAppointment}
          onUpdate={updateAppointment}
        />
      )}

      {showAddForm && (
        <AddAppointment
          selectedDate={selectedDate}
          onClose={() => setShowAddForm(false)}
          onSave={handleSaveAppointment}
        />
      )}
    </>
  );
};

export default AdminCalendar;