import { Appointment, ClientAppointment } from "@/types/types";

const fetchAppointments = async (): Promise<{ availableAppointments: Appointment[]; bookedAppointments: ClientAppointment[] } | null> => {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/termini`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Error with getting appointments.');
    }

    const { terminiNaVoljo, bookiraniTermini } = await response.json();
    console.log(terminiNaVoljo, bookiraniTermini);

    // Return both arrays wrapped in an object
    return {
      availableAppointments: terminiNaVoljo as Appointment[],
      bookedAppointments: bookiraniTermini as ClientAppointment[],
    };
    
  } catch (err) {
    console.error(err);
    return null; 
  }
};

export default fetchAppointments;
