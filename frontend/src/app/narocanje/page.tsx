'use client';

import { useState } from "react";
import { useService } from "@/context/ServiceContext";
import KoledarZaStranke from "../components/KoledarZaStranke";

export default function BookingPage() {
  const { servicesPicked } = useService();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const totalTime = servicesPicked.reduce((acc, curr) => acc + (curr.time || 0), 0);

  const handleSelectTimeSlot = (time: string) => {
    setSelectedTimeSlot(time);
  };

  return (
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
                <button className="mt-4" onClick={() => console.log("Naročilo uspešno oddano!")}>Naroči se</button>
            </div>
            </>
        )}
      </div>
    </div>
  );
}