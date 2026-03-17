import { Appointment } from "../types/types";

const fetchPublicAppointments = async (): Promise<Appointment[] | null> => {
  try {
    const response = await fetch("/api/appointments/public", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error fetching public appointments.");
    }

    const { availableAppointments } = await response.json();
    return availableAppointments as Appointment[];
  } catch (error) {
    console.error("Error in fetchPublicAppointments:", error);
    return null;
  }
};

export default fetchPublicAppointments;
