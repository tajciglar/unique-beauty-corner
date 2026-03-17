"use client"
import { useEffect, useState } from "react";
import { Order } from "../../../types/types";
import { changeDate } from "../../../utility/changeDate";

export default function ConfirmationPage() {    

    const [bookingData, setBookingData] = useState<Order>()
    const [calendarToken, setCalendarToken] = useState<string | null>(null);

    useEffect(() => {
        const lastBooking = localStorage.getItem("lastBooking");
        if (lastBooking) {
            const parsed = JSON.parse(lastBooking);
            setBookingData(parsed as Order);
            setCalendarToken(parsed?.calendarToken ?? null);
        } else {
            setBookingData(undefined);
            setCalendarToken(null);
        }
    }, [])

    const calendarUrl =
        bookingData?.id && calendarToken
            ? `/api/calendar?orderId=${bookingData.id}&token=${calendarToken}`
            : null;
   
    return (
        <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold mb-4">Potrditev termina</h1>
        <div className="bg-white rounded-lg p-4 shadow-md mb-3">
            <ul>
                <li>Ime: {bookingData?.name}</li>
                <li>Email: {bookingData?.email}</li>
                <li>Telefon: {bookingData?.phone}</li>
                
                <li>Storitve: {bookingData?.services?.map((service) => {
                    return ( 
                           <div className="text-sm" key={service.id}> - {service.serviceName} </div> 
                    )
                })}</li>
                <li>Cena: {Number(bookingData?.price)}€</li>
                <li>Čas trajanja: {bookingData?.duration} minut</li>
                <li>Datum in ura: {changeDate(bookingData?.appointment?.date || "").split("-").join(".")} ob {bookingData?.appointment?.startTime}</li>
            </ul>
        </div>
        <p className="text-lg mb-4">Vaš termin je bil uspešno potrjen!</p>
        <p className="text-lg mb-4">Hvala, da ste izbrali našo storitev.</p>
        <p className="text-lg mb-4">Veselimo se srečanja z vami!</p>
        {calendarUrl && (
            <a
                className="button px-4 py-2 mb-4"
                href={calendarUrl}
            >
                Dodaj v koledar
            </a>
        )}
        <h4>Lokacija termina: <a href="https://maps.app.goo.gl/EeHtG1MYY8LKpWgQA">Jesenova ulica 31, 1230 Domžale</a></h4>
        </div>
    );
}
