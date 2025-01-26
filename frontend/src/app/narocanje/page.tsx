'use client'

import { useService } from "@/context/ServiceContext";
import BookingCalendar from "../components/UrnikStrank";
import KoledarZaStranke from "../components/KoledarZaStranke";

export default function BookingPage ({}) {
    const { servicesPicked } = useService();
    const totalTime = servicesPicked.reduce((acc, curr) => acc + (curr.time || 0), 0);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[var(--cream-white)]">
            <div>
                <h3>Izbrali ste:</h3>
                <ul>
                    {servicesPicked.map((service, index) => (
                        <li key={index}>{service.name} - {service.price}€</li>
                    ))}
                </ul>
            </div>
            <KoledarZaStranke />
        </div>
    )
}