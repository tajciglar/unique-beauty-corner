import React, { useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';


export default function UrnikStrank() {
  interface Termin {
    datum: string;
    startTime: string;
    endTime: string;
  }

  interface KategorijaStoritev {
    id: number;
    naslovKategorije: string;
    storitve: Storitev[];
  }

  interface ClientTermin extends Termin {
    ime: string;
    telefon: string;
    email: string;
    storitve: object[];
  }

  interface Storitev {
    id: number;
    imeStoritve: string;
    cenaStoritve: number;
    časStoritve: number
  }



  const [openForm, setOpenForm] = useState<boolean>(false);
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [namen, setNamen] = useState<string>('');
  const [startTime, setStartTime] = useState<string>('');
  const [endTime, setEndTime] = useState<string>('');
  const [termini, setTermini] = useState<Termin[]>([]);
  const [openTermin, setOpenTermin] = useState<boolean>(false);
  const [kategorija, setKategorija] = useState<KategorijaStoritev[] | undefined>();
  const [selectedServices, setSelectedServices] = useState<object[]>([]);
  // podatki za stranko
  const [ime, setName] = useState<string>('');
  const [telefon, setTel] = useState<string>('');
  const [email, setMail] = useState<string>('');


  // pridobi storitve
  const getServices = async () => { 
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error('Napaka pri pridobivanju storitev.');
      }

      const data = await response.json();
      setKategorija(data as KategorijaStoritev[]);
    } catch (error) { 
      console.log(error);
    }
  }

  
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
      const newTermin: Termin = {
        datum: selectedDate,
        startTime,
        endTime,
      };

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
      storitve: selectedServices,
    };

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
      console.log(data.message)
      setTermini((prev) => [...prev, narocilo]);
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
  };



  // odpri termin z klikom
  const getTermin = (event: any) => {
    console.log(event)
    if (event) {
      setOpenTermin(true);
    }
  }

  // izbriši termin
  const izbrišiTermin = () => { 
    setTermini(termini.filter((termin) => termin !== termin));
    setOpenTermin(false);
  }


  // formatiraj datum
  const spremeniDatum = (date: string) => {
    const [year, month, day] = date.split('-');
    return `${day}-${month}-${year}`;
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>, service: object) => {
    if (e.target.checked) {
      setSelectedServices([...selectedServices, service]);
      console.log(selectedServices)
      console.log()
    } else {
      setSelectedServices(selectedServices.filter(id => id !== service));
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
          ...termini.map((termin) => {
            return {
              id: `${termin.datum}-${termin.startTime}`, 
              title: "Prosti termin",
              start: `${termin.datum}T${termin.startTime}:00`, 
              end: `${termin.datum}T${termin.endTime}:00`,     
            };
          }),
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
                  <option defaultValue="" disabled selected>Izberi namen</option>
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
                      {kategorija.map((kat) => (
                        <div key={kat.id}>
                          <h3>{kat.naslovKategorije}</h3>
                          {kat.storitve.map((storitev) => (
                            <div key={storitev.id}>
                              <input
                                type="checkbox"
                                id={`storitev-${storitev.id}`}
                                value={storitev.imeStoritve}
                
                                onChange={(e) => handleCheckboxChange(e, storitev)}
                              />
                              <label htmlFor={`storitev-${storitev.id}`}>{storitev.imeStoritve}</label>
                            </div>
                          ))}
                        </div>
                      ))}
                    </div>
                  )}
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
                onClick={() => { setOpenForm(false); setNamen(''); }}
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
