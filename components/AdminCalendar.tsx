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

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  console.log("selectedAppointment", selectedAppointment);
  const [openTermin, setOpenTermin] = useState(false);

  // dodaj nov termin z klikom na določen datum
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateClick = (info: { dateStr: string }) => {
    setSelectedDate(info.dateStr);
    setShowAddForm(true);
  };

  const [clientAppointmentsState, setClientAppointmentsState] = useState(clientAppointments);
  const [availableAppointmentsState, setAvailableAppointmentsState] = useState(availableAppointments);
  
useEffect(() => {
  setClientAppointmentsState(clientAppointments);
}, [clientAppointments]);

useEffect(() => {
  setAvailableAppointmentsState(availableAppointments);
}, [availableAppointments]);

const handleSaveAppointment = async (appointmentData: Appointment) => {
  const appointmentExists = clientAppointmentsState.some(
    (appointment) => appointment.date === appointmentData.date && appointment.startTime === appointmentData.startTime
  ) || availableAppointmentsState.some(
    (appointment) => appointment.date === appointmentData.date && appointment.startTime === appointmentData.startTime
  );

  if (appointmentExists) {
    console.error('Appointment already exists at this time.');
    alert('Appointment already exists at this time.');
    return;
  }

  try { 
    const response = await fetch("/api/appointments/create", {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData),
    });
    
    if (response.ok) {
      const { newAppointment } = await response.json();
      // Update state instantly
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
        setOpenTermin(false)
      } else {
        console.error('Failed to delete appointment');
      }
    } catch (err) {
      console.error(err);
    }
  }

  const updateAppointment = async (id: number, updatedData: Partial<Appointment>) => {
  try {
    const response = await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });

    if (response.ok) {
      const data = await response.json();
      const updatedAppointment = data.updatedAppointment; // <-- extract correctly

      // Update client appointments
      setClientAppointmentsState((prev) =>
        prev.map((appointment) =>
          appointment.id === updatedAppointment.id ? updatedAppointment : appointment
        )
      );

      // Update available appointments
      setAvailableAppointmentsState((prev) =>
        prev.map((appointment) =>
          appointment.id === updatedAppointment.id ? updatedAppointment : appointment
        )
      );

      console.log("Appointment updated successfully:", updatedAppointment);
    } else {
      console.error('Failed to update appointment');
    }
  } catch (err) {
    console.error(err);
  }
};

  // odpri termin z klikom
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const getTermin = (event: any) => {
    setSelectedAppointment(event);
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
          ...availableAppointmentsState.map((appointment) => {
            return {
              id: `${appointment.id}`, 
              title: "Prosti termin",
              start: `${appointment.date}T${appointment.startTime}:00`, 
              end: `${appointment.date}T${appointment.endTime}:00`,     
            };
          }),
        ...clientAppointmentsState.map((appointment) => { 
            return {
            id: `${appointment.id}`,
            title: appointment.order?.name || 'Unknown',
            email: appointment.order?.email || 'Unknown',
            phone: appointment.order?.phone || 'Unknown',
            services: appointment.order?.services || [],
            price: appointment.order?.price || 0,
            start: `${appointment.date}T${appointment.startTime}:00`,
            end: `${appointment.date}T${appointment.endTime}:00`,
            backgroundColor: '#FFD700',
        
            }
        })
        ]}
        eventClick={(info) => getTermin(info.event)}
        locale="sl"
      />
      {openTermin && selectedAppointment && (
          <ViewAppointment 
              appointment={selectedAppointment} 
              onClose={() => setOpenTermin(false)}
              onDelete={(id) => deleteAppointment(id)} 
              onUpdate={(id, updatedData) => {
                // Logic to update appointment
                updateAppointment(id, updatedData);
              }}
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
}

export default AdminCalendar;


