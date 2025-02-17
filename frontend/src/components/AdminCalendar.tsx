import React, { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { Appointment, ClientAppointment } from '@/types/types';
import ViewAppointment from './ViewAppointment';

interface AdminCalendarProps {
  clientAppointments: Appointment[];
  availableAppointments: Appointment[];
}

const AdminCalendar: React.FC<AdminCalendarProps> = ({ clientAppointments, availableAppointments }) => {

  const [openForm, setOpenForm] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
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
  const handleDateClick = (info: { dateStr: string }) => {
    setSelectedDate(info.dateStr);
    setOpenForm(true);
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

  const Reset = () => {
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
  }


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
            };
          }),
        ...clientAppointments.map((appointment) => {
          console.log(clientAppointments)
           console.log( appointment.orders.services)
          return {
           
            id:`${appointment.date}-${appointment.startTime}`,
            title: appointment.orders.name,
            email: appointment.orders.email,
            services: appointment.orders.services,
            price: appointment.orders.price,
            start: `${appointment.date}T${appointment.startTime}:00`,
            end: `${appointment.date}T${appointment.endTime}:00`, 
          }
        })
        ]}
        eventClick={(info) => getTermin(info.event)}
        locale="sl"
      />
      {openForm && (
        <div className="fixed z-10 top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="absolute bg-[var(--soft-rose)] bg-opacity-90 p-4 rounded-lg text-base flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <form
              className="flex flex-col gap-3 items-center"
              onSubmit={dodajTermin}
            >
              <h3 className="text-xl">
                Dodaj termin za datum{' '}
                <b>{spremeniDatum(selectedDate as string)}:</b>
              </h3>
              <label htmlFor="namen">Namen</label>
                <select
                  name="namen"
                  id="namen"
                  className="w-1/2"
                  onChange={(e) => {
                    setNamen(e.target.value);
                    if (e.target.value === 'stranka') {
                    getServices();
                    }
                  }}
                  >
                  <option defaultValue="Izberi namen" >Izberi namen</option>
                  <option value="prostiTermin">Prosti termin</option>
                  <option value="stranka">Stranka</option>
                </select>

              {namen === 'prostiTermin' && (
                <>
                  <label htmlFor="startTime">Začetek termina</label>
                  <input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <label htmlFor="endTime">Konec termina</label>
                  <input
                    type="time"
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                  <label htmlFor="lokacija">Izberi lokacijo</label>
                  <select name='lokacija'>
                    <option >Izberi lokacijo</option>
                    <option value="DOMŽALE">Domžale</option>
                    <option value="LJUBLJANA">Ljubljana</option>
                  </select>
                </>
                
              )}

              {namen === 'stranka' && (
                <>
                  <label htmlFor="ime">Ime stranke</label>
                  <input
                    type="text"
                    id="ime"
                    value={ime}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <label htmlFor="tel">Telefon</label>
                  <input
                    type="tel"
                    id="tel"
                    value={telefon}
                    onChange={(e) => setTel(e.target.value)}
                    required
                  />
                  <label htmlFor="mail">E-pošta</label>
                  <input
                    type="email"
                    id="mail"
                    value={email}
                    onChange={(e) => setMail(e.target.value)}
                    required
                  />
                  <label htmlFor="startTime">Začetek termina</label>
                  <input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                  />
                  <label htmlFor="endTime">Konec termina</label>
                  <input
                    type="time"
                    id="endTime"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                  />
                  <label>Storitev</label>
                  {kategorija && (
                    <div>
                      {kategorija.map((kat, katIndex) => (
                        <div key={kat.id || katIndex}>
                          <h3>{kat.naslovKategorije}</h3>
                          {kat.storitve.map((storitev, storitevIndex) => (
                            <div key={storitev.id || `${katIndex}-${storitevIndex}`}>
                              <input
                                type="checkbox"
                                id={`storitev-${storitev.id || `${katIndex}-${storitevIndex}`}`}
                                value={storitev.imeStoritve}
                                onChange={(e) => handleCheckboxChange(e, storitev)}
                              />
                              <label htmlFor={`storitev-${storitev.id || `${katIndex}-${storitevIndex}`}`}>
                                {storitev.imeStoritve}
                              </label>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
                  <label>Cena</label>
                  <div>{cena}</div>
                  <label>Čas</label>
                  <div>{time}</div>
                </>
              )}
              <button
                type="submit"
                className="bg-blue-500 text-white py-1 px-3 rounded-lg"
              >
                Dodaj
              </button>
              <button
                type="button"
                className="bg-gray-500 text-white py-1 px-3 rounded-lg"
                onClick={() => { setOpenForm(false); setNamen(''); Reset(); }}
              >
                Zapri
              </button>
            </form>
          </div>
        </div>
        
      )}
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
    </>
  );
}

export default AdminCalendar;
