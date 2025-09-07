import React, { useState, useEffect } from "react";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { sl } from "date-fns/locale";
import fetchAppointments from "../hooks/useFetchAppointments"; // <-- using this one now
import fetchAvaliableAppointments from "../hooks/useFetchAvaliableAppointments";
import { formatDateToLocalISO } from "../utility/changeDate";
import { Appointment } from "../types/types";

interface ClientCalendarProps {
  onSelectTimeSlot: (date: Date, time: string, appointment: Appointment) => void;
}

export default function KoledarZaStranke({ onSelectTimeSlot }: ClientCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [availableAppointments, setAvailableAppointments] = useState<Appointment[]>([]);
  const [highlightedDays, setHighlightedDays] = useState<Date[]>([]);

  // Fetch all booked appointments when component mounts
  useEffect(() => {
    const fetchBookedAppointments = async () => {
      const response = await fetchAppointments();

      if (response) {
        const { availableAppointments } = response;
        // Extract unique booked dates
        const uniqueBookedDates = Array.from(
          new Set(availableAppointments.map((appointment) => appointment.date))
        );

        // Convert to JS Date objects
        const bookedDays = uniqueBookedDates.map((date) => new Date(date));
        setHighlightedDays(bookedDays);
      }
    };

    fetchBookedAppointments();
  }, []);

  // When selecting a date, fetch available slots
  const handleDateSelect = async (date: Date | undefined) => {
    if (!date) return;

    setSelectedDate(date);

    const response = await fetchAvaliableAppointments(formatDateToLocalISO(date));

    if (response) {
      setAvailableAppointments(response);
      setTimeSlots(response.map((slot: { startTime: string }) => slot.startTime));
    } else {
      setTimeSlots([]);
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
        modifiers={{
          booked: highlightedDays, // Days to highlight
        }}
        modifiersClassNames={{
          booked: "bg-[var(--beige)] text-xl rounded-lg", // Custom styles for booked days
        }}
        classNames={{
          root: "bg-[var(--cream-white)] rounded-2xl shadow-lg p-4 mt-4",
          day_button:
            "w-10 h-10 lg:w-14 lg:h-14 p-0 hover:bg-[var(--soft-rose)] focus:bg-[var(--cream-white)] focus:text-[var(--dark-brown)] rounded-lg transition-all duration-200 ease-in-out",
          selected: "bg-[var(--soft-rose)] text-white rounded-lg",
          today: "bg-[var(--cream-white)] rounded-lg text-2xl font-bold",
        }}
      />

      {selectedDate && (
        <div className="mt-8 w-full space-y-6 flex flex-col items-center">
          <h3 className="text-2xl font-bold text-[var(--terracotta)]">
            {selectedDate?.toLocaleDateString("sl-SI").split(" ")}
          </h3>

          <div className="flex flex-col items-center">
            <ul className="flex flex-wrap gap-4 justify-center">
              {timeSlots.length > 0 ? (
                timeSlots.map((slot, index) => (
                  <li key={`dom-${index}`}>
                    <button
                      className="button px-4 py-2 bg-[var(--terracotta)] text-white rounded-lg hover:bg-[var(--soft-rose)] focus:bg-[var(--soft-rose)] w-full transition transfrom hover:scale-105"
                      onClick={() => pickAppointment(selectedDate, slot)}
                    >
                      {slot}
                    </button>
                  </li>
                ))
              ) : (
                <p className="text-center text-lg">
                  Ni prostih terminov za izbran datum.
                </p>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}