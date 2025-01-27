import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { sl } from "date-fns/locale";

interface KoledarZaStrankeProps {
  onSelectTimeSlot: (date: string) => void;
}

export default function KoledarZaStranke({ onSelectTimeSlot }: KoledarZaStrankeProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  const availableSlots: { [key: string]: string[] } = {
    "27.1.2025": ["10:00 AM", "11:30 AM", "13:00"],
    "28.1.2025": ["9:00 AM", "12:00 PM", "2:30 PM"],
  };

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      const formattedDate = date.toLocaleDateString("sl-SI").replace(/\s+/g, "");
      setTimeSlots(availableSlots[formattedDate] || []);
    }
  };

  const izbiraTermina = (date: Date, time: string) => {
    const dateTimeString = `${date.toLocaleDateString('sl-SI').replace(/\s+/g, "")} ${time}`;
    onSelectTimeSlot(dateTimeString)
  };

  return (
    <div className="flex flex-col justify-center">
      <h2 className="text-3xl font-bold">Izberite datum:</h2>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        locale={sl}
        classNames={{
          today: "text-lg font-semibold underline",
          selected: "bg-[var(--soft-rose)] text-white rounded-lg",
        }}
        styles={{
          day: { width: "4rem", height: "4rem", fontSize: "1.25rem" },
          nav: { marginBottom: "1rem" },
          day_button: { borderRadius: "0.5rem", width: "4rem", height: "4rem" },
          month_caption: { color: "#B77A65", fontSize: "1.5rem" },
          chevron: { fill: "#B77A65", width: "2rem", height: "2rem" },
        }}
      />
      {selectedDate && (
        <div className="mt-8 w-full">
          <h3 className="text-2xl font-semibold mb-4">
            Prosti termini:{" "}
            {selectedDate.toLocaleDateString("sl-SI", {
              weekday: "long",
              day: "numeric",
              month: "long",
            })}
          </h3>
          <ul className="grid grid-cols-3 gap-4">
            {timeSlots.length > 0 ? (
              timeSlots.map((slot, index) => (
                <li key={index}>
                  <button
                    className="px-4 py-2 bg-[var(--terracotta)] text-white rounded-lg hover:bg-[var(--soft-rose)] w-full"
                    onClick={() => izbiraTermina(selectedDate, slot)}
                  >
                    {slot}
                  </button>
                </li>
              ))
            ) : (
              <p className="col-span-3 text-center text-lg">
                Ni prostih terminov za izbrani datum.
              </p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}