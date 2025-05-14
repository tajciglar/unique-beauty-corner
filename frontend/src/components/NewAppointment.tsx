import fetchNewOrders from "../hooks/useFetchNewOrder";
import { useState, useEffect } from "react";
import { Order } from "@/types/types";
import { changeDate } from "@/utility/changeDate";

const NewAppointment: React.FC = () => {
    const [newOrders, setNewOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);



    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await fetchNewOrders();
                if (data) {
                    setNewOrders(Array.isArray(data) ? data : [data]);
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

    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">Današnja naročila</h1>

            {loading && <p className="text-gray-500">Nalagam...</p>}
            {error && <p className="text-red-500">{error}</p>}

            {newOrders.length > 0 ? (
                <ul className="space-y-4 overflow-y-auto max-h-screen">
                    {newOrders.map((order) => (
                        <li key={order.appointment.id} className="border p-4 rounded shadow-sm">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h2 className="text-xl font-semibold">{order.name}</h2>
                                    <p className="text-lg text-gray-600">{changeDate(order.appointment.date)} / {order.appointment.startTime} – {order.appointment.endTime}</p>
                                    <p className="text-sm">Telefon:{order.phone}</p>
                                    <p className="text-sm">E-pošta:{order.email}</p>
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