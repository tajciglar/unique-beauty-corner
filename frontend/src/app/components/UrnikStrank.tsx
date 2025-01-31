import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


export default function UrnikStrank() {
  interface Termin {
    date: Date;
    startTime: string;
    endTime: string;
  }

  const [openForm, setOpenForm] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [termini, setTermini] = useState<Termin[]>([]);
  const [openTermin, setOpenTermin] = useState<boolean>(false);

  // dodaj nov termin z klikom na določen datum
  const handleDateClick = (info: { dateStr: string }) => {
    setSelectedDate(new Date(info.dateStr));
    setOpenForm(true);
  };

  const dodajTermin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedDate) {
      alert('Izberite datum.');
      return;
    }

    if (startTime >= endTime) {
      alert('Konec termina mora biti po začetku termina.');
      return;
    }

    const newTermin: Termin = {
      date: selectedDate,
      startTime,
      endTime,
    };

    try {
      const response = await fetch('http://localhost:3000/api/termin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newTermin),
      });

      if (!response.ok) {
        throw new Error('Napaka pri dodajanju termina.');
      }
    } catch (error) {
      alert(error);
      return;
    }


    setTermini((prev) => [...prev, newTermin]);
    setOpenForm(false);
    setStartTime('');
    setEndTime('');
  };


  // odpri termin z klikom
  const getTermin = (event: any) => {
    if (event) {
      setOpenTermin(true);
    }
  }

  // izbriši termin
  const izbrišiTermin = () => { 
    setTermini(termini.filter((termin) => termin !== termin));
    setOpenTermin(false);
  }



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
          ...termini.map((termin) => ({
            title: 'Prosti termin',
            start: `${termin.datum.toISOString().split('T')[0]}T${termin.startTime}`,
            end: `${termin.datum.toISOString().split('T')[0]}T${termin.endTime}`,
          })),
        ]}
        eventClick={(info) => getTermin(info.event)}
        locale="sl"
      />
      {openForm && (
        <div className="fixed z-10 top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="absolute bg-[var(--soft-rose)] bg-opacity-90 p-4 rounded-lg text-base flex flex-col gap-4">
            <form
              className="flex flex-col gap-3 items-center"
              onSubmit={dodajTermin}
            >
              <h3 className="text-xl">
                Dodaj prosti termin za datum{' '}
                {selectedDate?.toLocaleDateString('sl-SI')}:
              </h3>
              <label htmlFor="start">Začetek</label>
              <input
                type="time"
                id="start"
                className="w-1/2"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                required
              />
              <label htmlFor="end">Konec</label>
              <input
                type="time"
                id="end"
                className="w-1/2"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                required
              />
              <button
                type="submit"
                className="bg-blue-500 text-white py-1 px-3 rounded-lg"
              >
                Dodaj
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white py-1 px-3 rounded-lg"
                onClick={() => setOpenForm(false)}
              >
                Zapri
              </button>
            </form>
          </div>
        </div>
      )}
      { openTermin && (
        <div className="fixed z-10 top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="absolute bg-[var(--soft-rose)] bg-opacity-90 p-4 rounded-lg text-base flex flex-col gap-4">
            <h2 className="text-xl">Podrobnosti termina</h2>
            <p>Podrobnosti termina</p>
            <button className="bg-red-500 text-white py-1 px-3 rounded-lg" onClick={() => izbrišiTermin()}>
              Izbriši termin
            </button>
            <button
              className="bg-blue-500 text-white py-1 px-3 rounded-lg"
              onClick={() => setOpenTermin(false)}
            >
              Zapri
            </button>
          </div>
        </div>
      )

      }
    </>
  );
}
