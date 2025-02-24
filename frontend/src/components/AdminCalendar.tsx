import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Appointment, Order } from '@/types/types';
import ViewAppointment from './ViewAppointment';
import AddAppointment from './AddAppointment';

interface AdminCalendarProps {
  clientAppointments: Appointment[];
  availableAppointments: Appointment[];
}

const AdminCalendar: React.FC<AdminCalendarProps> = ({ clientAppointments, availableAppointments }) => {

  const [selectedAppointment, setSelectedAppointment] = useState<unknown | null>(null);
  const [openTermin, setOpenTermin] = useState(false);

  // dodaj nov termin z klikom na določen datum
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateClick = (info: { dateStr: string }) => {
    setSelectedDate(info.dateStr);
    setShowAddForm(true);
  };

  const handleSaveAppointment = async (appointmentData: Order) => {
    try { 
      const response = await fetch('http://localhost:4000/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData),
      });
      if (response.ok) {
        const data = await response.json();
        console.log(data);
      } else {
        console.error('Failed to save appointment');
      }
    } catch (err) {
      console.error(err);
    }
    setShowAddForm(false);
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
          left: 'prev next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
       events={[
          ...availableAppointments.map((appointment) => {
            return {
              id: `${appointment.date}-${appointment.startTime}`, 
              title: "Prosti termin",
              start: `${appointment.date}T${appointment.startTime}:00`, 
              end: `${appointment.date}T${appointment.endTime}:00`,     
              location: `${appointment.location}`
            };
          }),
        ...clientAppointments.map((appointment) => {  
          return {
            id:`${appointment.date}-${appointment.startTime}`,
            title: appointment.orders?.name || 'Unknown',
            email: appointment.orders?.email || 'Unknown',
            phone: appointment.orders?.phone || 'Unknown',
            services: appointment.orders?.services || [],
            price: appointment.orders?.price || 0,
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
              onDelete={(id) => {
                setTermini((prev) => prev.filter((t) => t.id !== id));
                setOpenTermin(false);
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


