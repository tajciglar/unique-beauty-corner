import { Appointment } from "@/types/types";

const fetchNewAppointment = async (): Promise<Appointment | null> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        console.log(response)
    
        if (!response.ok) {
            throw new Error('Error with getting new orders.');
        }
    
        const data = await response.json();
        console.log(data)
        return data as Appointment;
    } catch (error) {
        console.error("Errow while fetching new orders", error);    
        return null;
    }
}

export default fetchNewAppointment;