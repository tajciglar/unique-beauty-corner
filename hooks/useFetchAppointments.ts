import { Appointment } from "../types/types";

const fetchAppointments = async (): Promise<{ availableAppointments: Appointment[]; bookedAppointments: Appointment[] } | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error with getting appointments.');
    }

    const { availableAppointments, bookedAppointments } = await response.json();
    
    return {
      availableAppointments: availableAppointments as Appointment[],
      bookedAppointments: bookedAppointments as Appointment[],
    };
    
  } catch (err) {
    console.error(err);
    return null; 
  }
};

export default fetchAppointments;
