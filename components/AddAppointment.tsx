import React, { useState, useEffect } from "react";
import { changeDate } from "../utility/changeDate";
import { Appointment, Service, ServiceCategory } from "../types/types";
import getServices from "../hooks/useFetchServices";

interface AddAppointmentProps {
  selectedDate: string | null;
  onClose: () => void;
  onSave: (appointmentData: Appointment) => void;
}

const AddAppointment: React.FC<AddAppointmentProps> = ({ selectedDate, onClose, onSave }) => {
  const [purpose, setPurpose] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [services, setServices] = useState<ServiceCategory[] | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  useEffect(() => {
    if (purpose === "client") {
      const fetchServices = async () => {
        const data = await getServices();
        if (data) {
          setServices(data);
        }
      };
      fetchServices();
    }
  }, [purpose]);

  useEffect(() => {
    if (selectedDate) {
      setPurpose("");
      setStartTime("");
      setEndTime("");
      setName("");
      setPhone("");
      setEmail("");
      setPrice(0);
      setDuration(0);
      setSelectedServices([]);
      setServices(null);
    }
  }, [selectedDate]);

  // Update total duration and price when services are selected
  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>, service: Service) => {
    setSelectedServices((prev) => {
      let updatedServices;
      if (e.target.checked) {
        updatedServices = [...prev, service];
      } else {
        updatedServices = prev.filter((s) => s.id !== service.id);
      }

      const totalPrice = updatedServices.reduce((sum, s) => sum + Number(s.servicePrice), 0);
      const totalDuration = updatedServices.reduce((sum, s) => sum + s.serviceTime, 0);
      
      setPrice(totalPrice);
      setDuration(totalDuration);
      
      if (startTime) {
        const newEndTime = calculateEndTime(startTime, totalDuration);
        setEndTime(newEndTime);
      }
      
      return updatedServices;
    });
  };

  // Calculate end time based on start time and total duration
  const calculateEndTime = (start: string, durationInMinutes: number): string => {
    const startDate = new Date(`1970-01-01T${start}:00`); 
    startDate.setMinutes(startDate.getMinutes() + durationInMinutes);
    
    const hours = String(startDate.getHours()).padStart(2, "0");
    const minutes = String(startDate.getMinutes()).padStart(2, "0");
    
    return `${hours}:${minutes}`;
  };

  const handleSubmit = (e: React.FormEvent) => {
  
  e.preventDefault();

  if (!selectedDate || !startTime || !endTime) {
    alert("Please fill in all required fields.");
    return;
  }

  if (startTime > endTime) {
    alert("Začetni čas ne more biti večji od zaključka!");
    return;
  }

  let newAppointment: Appointment;

  if (purpose === "client") {
    if (!name.trim() || !phone.trim() || !email.trim()) {
      alert("Prosim, izpolnite vsa polja za stranko.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\-\s()]{6,}$/;

    if (!emailRegex.test(email)) {
      alert("Prosimo, vnesite veljaven email naslov.");
      return;
    }

    if (!phoneRegex.test(phone)) {
      alert("Prosimo, vnesite veljavno telefonsko številko.");
      return;
    }

    newAppointment = {
      date: selectedDate,
      startTime,
      endTime,
      available: false,
      order: {
        name,
        email,
        phone,
        price,
        duration,
        services: selectedServices,
        appointment: {
          date: selectedDate,
          startTime,
          endTime,
          available: false,
        },
      },
    };
  } else {
    // purpose === "availableSlot"
    newAppointment = {
      date: selectedDate,
      startTime,
      endTime,
      available: true,
    };
  }

  onSave(newAppointment);
  onClose();
};

  return (
    <div className="fixed z-10 top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="absolute bg-white p-4 rounded-lg text-base flex flex-col gap-4 max-h-[90vh] overflow-y-auto shadow-lg">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <h3 className="text-xl font-bold">
            Dodaj termin za: {selectedDate ? changeDate(selectedDate) : "Invalid Date"}
          </h3>
          
          <label htmlFor="purpose">Izberi:</label>
          <select id="purpose" className="border p-2 rounded" onChange={(e) => setPurpose(e.target.value)}>
            <option value=""></option>
            <option value="availableSlot">Prosti termin</option>
            <option value="client">Stranka</option>
          </select>

          {purpose === "availableSlot" && (
            <>
              <label htmlFor="startTime">Začetek</label>
              <input type="time" lang="en-GB" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border p-2 rounded" />

              <label htmlFor="endTime">Konec</label>
              <input type="time" lang="en-GB" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border p-2 rounded" />
            </>
          )}

          {purpose === "client" && (
            <>
              <label htmlFor="name">Ime stranke</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" required />

              <label htmlFor="phone">Telefon</label>
              <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 rounded" required />

              <label htmlFor="email">Email</label>
              <input type="email" lang="en-GB" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" required />

              <label htmlFor="startTime">Start Time</label>
              <input type="time" lang="en-GB" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border p-2 rounded" />

              <label htmlFor="services">Storitve</label>
              {services?.map((category) => (
                <div key={category.id} className="mb-2">
                  <label className="font-bold">
                    {category.categoryName}
                  </label>

                  <ul className="ml-4">
                    {category.services.map((service) => (
                      <li key={service.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`service-${service.id}`}
                          value={service.id}
                          onChange={(e) => handleServiceChange(e, service)}
                          checked={selectedServices.includes(service)}
                          className="mr-2"
                        />
                        <label htmlFor={`service-${service.id}`}>{service.serviceName}</label>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

              <label htmlFor="endTime">End Time</label>
              <input type="time" id="endTime" value={endTime} readOnly className="border p-2 rounded" />

              <label>Price</label>
              <div className="border p-2 rounded">{price}€</div>

              <label>Čas storitve</label>
              <div className="border p-2 rounded">{duration} mins</div>
            </>
          )}

          <button type="submit" className=" text-white py-2 px-4 rounded-lg">Dodaj</button>
          <button type="button" className="bg-[var(--soft-rose)] text-white py-2 px-4 rounded-lg" onClick={onClose}>Zapri</button>
        </form>
      </div>
    </div>
  );
};

export default AddAppointment;