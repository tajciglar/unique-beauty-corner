import React, { useEffect, useState } from 'react';
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

  const [namen, setNamen] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [openTermin, setOpenTermin] = useState<boolean>(false);;
  const [cena, setCena] = useState<number>()
  const [time, setTime] = useState<number>()
  const [selectedAppointment, setSelectedAppointment] = useState<any | null>(null);

  // podatki za stranko
  const [ime, setName] = useState<string>('');
  const [telefon, setTel] = useState<string>('');
  const [email, setMail] = useState<string>('');

  // dodaj nov termin z klikom na določen datum
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const handleDateClick = (info: { dateStr: string }) => {
    setSelectedDate(info.dateStr);
    setShowAddForm(true);
  };

  const handleSaveAppointment = (appointmentData: any) => {
    console.log("New Appointment:", appointmentData);
    // Here, you can send the data to the API or update state
    setShowAddForm(false);
  };

  const dodajTermin = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedDate) {
      alert("Izberite datum.");
      return;
    }

    if (startTime >= endTime) {
      alert("Konec termina mora biti po začetku termina.");
      return;
    }

    // Handle different cases based on 'namen'
    if (namen === "prostiTermin") {
   
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/termini`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(newTermin),
          }
        );

      if (!response.ok) {
        throw new Error("Napaka pri dodajanju termina.");
      }

        setTermini((prev) => [...prev, newTermin]);

      } catch (error) {
        alert(error);
        return;
      }

  // Dodajanje stranke
  } else if (namen === "stranka") {
    // Check if all required client fields are filled
    if (!ime || !telefon || !email || selectedServices.length === 0) {
      alert("Izpolnite vsa polja in izberite vsaj eno storitev.");
      return;
    }

    const narocilo: ClientTermin = {
      ime,
      telefon,
      email,
      datum: selectedDate,
      startTime,
      endTime,
      cena: cena || 0,
      storitve: selectedServices,
    };
    console.log("Narocilo", narocilo)
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/narocila`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(narocilo),
        }
      );

      if (!response.ok) {
        throw new Error("Napaka pri dodajanju termina za stranko.");
      }
      const data = await response.json();
      console.log(data)
      setClientTermin((prev) => [...prev, narocilo as ClientTermin]);
    } catch (error) {
      alert(error);
      return;
    }
  }

    // Reset form state after submission
    setOpenForm(false);
    setNamen("");
    setStartTime("");
    setEndTime("");
    setName("");
        setTel("");
    setMail("");
    setSelectedServices([]);
    setCena(0);
    setTime(0);
  };

  // odpri termin z klikom
  const getTermin = (event: any) => {
    console.log(event._def)
    setSelectedAppointment(event);
    setOpenTermin(true);
  };

  // izbriši termin
  const izbrišiTermin = () => { 
    setTermini(termini.filter((termin) => termin !== termin));
    setOpenTermin(false);
  }

  // checkbox 
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, service: Storitev) => {
      if (e.target.checked) {
        console.log(e.target.checked, service)
        setSelectedServices(prevSelectedServices => {
          const newSelectedServices = [...prevSelectedServices, service];
          console.log(newSelectedServices)
          const totalCena = newSelectedServices.reduce((total, srv) => total + srv.cena, 0);
          const totalTime = newSelectedServices.reduce((total, srv) => total + srv.časStoritve, 0)
          setCena(totalCena); 
          setTime(totalTime)
          return newSelectedServices;
        });
      } else {
        setSelectedServices(prevSelectedServices => {
          const newSelectedServices = prevSelectedServices.filter(srv => srv !== service);
          const totalCena = newSelectedServices.reduce((total, srv) => total + srv.cena, 0);
          const totalTime = newSelectedServices.reduce((total, srv) => total + srv.časStoritve, 0)
          setCena(totalCena); 
          setTime(totalTime)
          return newSelectedServices;
        });
      }
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
            title: appointment.orders.name,
            email: appointment.orders.email,
            services: appointment.orders.services,
            price: appointment.orders.price,
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


