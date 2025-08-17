const fetchAvaliableAppointments = async (date: string) => {
    if (!date) return null;
    try {
        const response = await fetch(
        "`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/available?date=${date}",
        {
            method: 'GET',
            headers: {
            'Content-Type': 'application/json',
            },
        }
        );

        if (!response.ok) {
            throw new Error('Error fetching available appointments.');
        }

        const data = await response.json();
        console.log('Available appointments:', data);
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export default fetchAvaliableAppointments;