import React from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';

export default function UrnikStrank() {
  const handleDateClick = (info: { dateStr: string }) => {
    console.log('Selected Date:', info.dateStr);
    // Fetch available times for the selected date
  };

  return (
    <FullCalendar
      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
      initialView="dayGridMonth"
      dateClick={handleDateClick}
      events={[
        { title: 'Available', start: '2025-01-27' },
        { title: 'Unavailable', start: '2025-01-28', color: 'red' },
      ]}
    />
  );
}
