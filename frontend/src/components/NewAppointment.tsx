import fetchNewOrders from "../hooks/useFetchNewAppointment";
import { useState, useEffect } from "react";
import { Appointment } from "@/types/types";

const NewAppointment: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await fetchNewOrders();
                if (data) {
                    setAppointments(Array.isArray(data) ? data : [data]);
                    console.log(data);
                }
            } catch (error) {
                setError("Napaka pri nalaganju naročil.");
                console.error("Error fetching new orders:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handleAccept = (id: string) => {
        console.log(`Accepted order with ID: ${id}`);
        // TODO: Add backend call to update status
    };

    const handleReject = (id: string) => {
        console.log(`Rejected order with ID: ${id}`);
        // TODO: Add backend call to update status
    };

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Naročila</h1>

            {loading && <p className="text-gray-500">Nalagam...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {appointments.length > 0 ? (
                <ul className="space-y-4">
                    {appointments.map((appointment) => (
                        <li key={appointment.id} className="border p-4 rounded shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold">{appointment.order?.name}</h2>
                                    <p className="text-sm text-gray-600">{appointment.startTime} – {appointment.endTime}</p>
                                    <p><strong>Telefon:</strong> {appointment.order?.phone}</p>
                                    <p><strong>E-pošta:</strong> {appointment.order?.email}</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button
                                        onClick={() => handleAccept(appointment.id)}
                                        className="bg-green-500 text-white px-4 py-1 rounded hover:bg-green-600"
                                    >
                                        Sprejmi
                                    </button>
                                    <button
                                        onClick={() => handleReject(appointment.id)}
                                        className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600"
                                    >
                                        ZavrnI
                                    </button>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                !loading && <p className="text-gray-500">Ni novih naročil.</p>
            )}
        </div>
    );
};

export default NewAppointment;