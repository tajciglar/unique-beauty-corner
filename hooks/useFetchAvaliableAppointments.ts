const fetchAvaliableAppointments = async (date: string, duration?: number) => {
    if (!date) return null;
    try {
        const params = new URLSearchParams({ date });
        if (duration) {
            params.append('duration', duration.toString());
        }
        const response = await fetch(
        `/api/appointments/getAvailable?${params.toString()}`,
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