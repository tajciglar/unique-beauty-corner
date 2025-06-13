import React, { useState } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { sl } from "date-fns/locale";
import fetchAvaliableAppointments from "@/hooks/useFetchAvaliableAppointments";
import { formatDateToLocalISO } from "@/utility/changeDate";
import { Appointment } from "@/types/types";
interface ClientCalendarProps {
  onSelectTimeSlot: (date: Date, time: string, appointment: Appointment) => void;
}

export default function KoledarZaStranke({ onSelectTimeSlot }: ClientCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlots, setTimeSlots] = useState<{ LJUBLJANA: string[]; DOMZALE: string[] }>({
    LJUBLJANA: [],
    DOMZALE: [],
  });
  const [availableAppointments, setAvailableAppointments] = useState<Appointment[]>([]);


  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;

    setSelectedDate(date);
    const response = await fetchAvaliableAppointments(formatDateToLocalISO(date));

    if (response) {
      console.log("Available appointments:", response);
      setAvailableAppointments(response);
      
      const availableTimeSlotsLjubljana = response
        .filter((slot: { location: string }) => slot.location === "LJUBLJANA")
        .map((slot: { startTime: string }) => slot.startTime);
      const availableTimeSlotsDomzale = response
        .filter((slot: { location: string }) => slot.location === "DOMŽALE")
        .map((slot: { startTime: string }) => slot.startTime);
      setTimeSlots({
        LJUBLJANA: availableTimeSlotsLjubljana,
        DOMZALE: availableTimeSlotsDomzale,
      });
    } else {
      setTimeSlots({ LJUBLJANA: [], DOMZALE: [] });
    }
};

  const pickAppointment = (date: Date, time: string) => {
    
    const appointment = availableAppointments.find((a) => a.startTime === time);

    if (!appointment) return;
   
    onSelectTimeSlot(date, time, appointment); 
  };

  return (
    <div className="flex flex-col justify-center lg:px-4 m-0 sm:px-6 md:px-8">
      <h2 className="text-3xl font-bold">Izberite datum:</h2>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={handleDateSelect}
        locale={sl}
        classNames={{
          root: "bg-[var(--cream-white)] rounded-2xl shadow-lg p-4 mt-4",
          day_button: "w-10 h-10 lg:w-14 lg:h-14 p-0 bg-[var(--soft-rose)] hover:bg-[var(--soft-rose)] focus:bg-[var(--cream-white)] focus:text-[var(--dark-brown)] rounded-lg transition-all duration-200 ease-in-out", 
          selected: "bg-[var(--cream-white)] rounded-lg",
          today: "bg-[var(--cream-white)] rounded-lg text-2xl font-bold",
        }}
      />
      {selectedDate && (
      <div className="mt-8 w-full space-y-6">
        <h3 className="text-2xl font-bold text-[var(--terracotta)] p-0 mb-0 flex justify-center">{selectedDate?.toLocaleDateString("sl-SI").split(" ")}</h3>
        <div>
          <h4 className="text-xl font-semibold text-[var(--terracotta)] mb-2">Ljubljana</h4>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {timeSlots.LJUBLJANA.length > 0 ? (
              timeSlots.LJUBLJANA.map((slot, index) => (
                <li key={`lj-${index}`}>
                  <button
                    className="px-3 py-2 text-sm sm:text-base bg-[var(--terracotta)] text-white rounded-lg hover:bg-[var(--soft-rose)] focus:bg-[var(--soft-rose)] w-full"
                    onClick={() => pickAppointment(selectedDate, slot)}
                  >
                    {slot}
                  </button>
                </li>
              ))
            ) : (
              <p className="col-span-3 text-center text-lg">Ni prostih terminov za Ljubljano.</p>
            )}
          </ul>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-[var(--terracotta)] mb-2">Domžale</h4>
          <ul className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {timeSlots.DOMZALE.length > 0 ? (
              timeSlots.DOMZALE.map((slot, index) => (
                <li key={`dom-${index}`}>
                  <button
                    className="px-4 py-2 bg-[var(--terracotta)] text-white rounded-lg  focus:bg-[var(--soft-rose)] w-full"
                    onClick={() => pickAppointment(selectedDate, slot)}
                  >
                    {slot}
                  </button>
                </li>
              ))
            ) : (
              <p className="col-span-3 text-center text-lg">Ni prostih terminov za Domžale.</p>
            )}
          </ul>
        </div>
      </div>
    )}
    </div>
  );
}