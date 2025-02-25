import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Appointment } from '@/types/types';
import ViewAppointment from './ViewAppointment';
import AddAppointment from './AddAppointment';

interface AdminCalendarProps {
  clientAppointments: Appointment[];
  availableAppointments: Appointment[];
}

const AdminCalendar: React.FC<AdminCalendarProps> = ({ clientAppointments, availableAppointments }) => {

  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(appointmentData),
    });

    if (response.ok) {
      const { newAppointment } = await response.json();
      console.log(newAppointment)
      // Update state instantly
      if (!newAppointment.available) {
        console.log(newAppointment)
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setClientAppointmentsState((prev) => prev.filter((appointment) => `${appointment.id}` !== id));
        setAvailableAppointmentsState((prev) => prev.filter((appointment) => `${appointment.id}` !== id));
        console.log('Appointment deleted successfully');
        setOpenTermin(false)
      } else {
        console.error('Failed to delete appointment');
      }
    } catch (err) {
      console.error(err);
    }
  }

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
          left: 'prev next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
       events={[
          ...availableAppointmentsState.map((appointment) => {
            return {
              id: `${appointment.id}`, 
              title: "Prosti termin",
              start: `${appointment.date}T${appointment.startTime}:00`, 
              end: `${appointment.date}T${appointment.endTime}:00`,     
              location: `${appointment.location}`
            };
          }),
        ...clientAppointmentsState.map((appointment) => { 
          return {
            id:`${appointment.id}`,
            title: appointment.order?.name || 'Unknown',
            email: appointment.order?.email || 'Unknown',
            phone: appointment.order?.phone || 'Unknown',
            services: appointment.order?.services || [],
            price: appointment.order?.price || 0,
            start: `${appointment.date}T${appointment.startTime}:00`,
            end: `${appointment.date}T${appointment.endTime}:00`, 
            location: `${appointment.location}`
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


