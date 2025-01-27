'use client';

import { useState } from "react";
import { useService } from "@/context/ServiceContext";
import KoledarZaStranke from "../components/KoledarZaStranke";

export default function Termini() {
  const { servicesPicked } = useService();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [appointment, setAppointment] = useState<boolean>(false);
  const totalTime = servicesPicked.reduce((acc, curr) => acc + (curr.time || 0), 0);

  const handleSelectTimeSlot = (time: string) => {
    setSelectedTimeSlot(time);
  };

  const appointmentForm = () => { 
    setAppointment(true);
  }


  return (
    <>
    <div className="flex items-center justify-center min-h-screen bg-[var(--cream-white)] gap-10">
      <KoledarZaStranke onSelectTimeSlot={handleSelectTimeSlot} />
      <div className="mb-4 bg-[var(--soft-rose)] p-4 rounded-lg text-base">
        <h3 className="text-3xl font-bold">Izbrali ste:</h3>
        <ul>
          {servicesPicked.map((service, index) => (
            <li key={index}>
              {service.name} - {service.price}€
            </li>
          ))}
        </ul>
        <p>Čas storitve: {totalTime} min</p>
        {selectedTimeSlot && (
            <>
                <p className="mt-4 text-lg">
                Izbrani termin: <strong>{selectedTimeSlot}</strong>
            </p>
            <div className="flex justify-center">
                <button className="mt-4" onClick={() => appointmentForm()}>Potrdi</button>
            </div>
            </>
        )}
      </div>
      
    </div>
    {appointment && (
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
          <div className="absolute bg-[var(--soft-rose)] bg-opacity-90 p-4 rounded-lg text-base flex flex-col gap-4">
          <h2 className="text-xl">Obrazec za naročilo</h2>
          <form className="flex flex-col gap-3">
            <label htmlFor="name">Ime in priimek:</label>
            <input type="text" id="name" name="name" required/>
            <label htmlFor="phone">Telefonska številka:</label>
            <input type="text" id="phone" name="phone" required/>
            <h3 className="text-lg">Informacije o storitvi:</h3>
              <ul>
                {servicesPicked.map((service, key) => (
                <li key={key}>{service.name}</li>
                ))}
              </ul>
            <p>{selectedTimeSlot} ({totalTime} min)</p>
            <button type="submit">Naroči se</button>
            <button onClick={() => setAppointment(false)}>Prekliči</button>
          </form>
        </div>
      </div>
    )}
    </>
  );
}