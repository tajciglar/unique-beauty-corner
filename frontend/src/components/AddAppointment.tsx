import React, { useState, useEffect } from "react";
import { changeDate } from "@/utility/changeDate";
import { Order, Service, ServiceCategory } from "@/types/types";
import getServices from "@/hooks/useFetchServices";

interface AddAppointmentProps {
  selectedDate: string | null;
  onClose: () => void;
  onSave: (appointmentData: Order) => void;
}

const AddAppointment: React.FC<AddAppointmentProps> = ({ selectedDate, onClose, onSave }) => {
  const [purpose, setPurpose] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [location, setLocation] = useState<string>("Domžale");
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [services, setServices] = useState<ServiceCategory[] | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);
  console.log(location)
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
    
    const newAppointment: Order = {
      date: selectedDate,
      startTime,
      endTime,
      name,
      available: services ? false : true,
      phone,
      email,
      price,
      duration,
      location,
      services: selectedServices,
    };

    onSave(newAppointment); 

    onClose();
  };

  return (
    <div className="fixed z-10 top-0 left-0 w-full h-full flex items-center justify-center bg-[rgba(0,0,0,0.5)]">
      <div className="absolute bg-white p-4 rounded-lg text-base flex flex-col gap-4 max-h-[90vh] overflow-y-auto shadow-lg">
        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <h3 className="text-xl font-bold">
            Add Appointment for {selectedDate ? changeDate(selectedDate) : "Invalid Date"}
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
              <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border p-2 rounded" />

              <label htmlFor="endTime">Konec</label>
              <input type="time" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border p-2 rounded" />

              <label htmlFor="location">Lokacija</label>
              <select id="location" className="border p-2 rounded" value={location} onChange={(e) => setLocation(e.target.value)}>
                <option value="Domžale">Domžale</option>
                <option value="Ljubljana">Ljubljana</option>
              </select>
            </>
          )}

          {purpose === "client" && (
            <>
              <label htmlFor="name">Ime stranke</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" required />

              <label htmlFor="phone">Telefon</label>
              <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 rounded" required />

              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" required />

              <label htmlFor="startTime">Start Time</label>
              <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border p-2 rounded" />

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
                          required
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

              <label htmlFor="location">Lokacija</label>
              <select id="location" className="border p-2 rounded" onChange={(e) => setLocation(e.target.value)}>
                <option value="Domžale">Domžale</option>
                <option value="Ljubljana">Ljubljana</option>
              </select>

              <label>Price</label>
              <div className="border p-2 rounded">{price}€</div>

              <label>Čas storitve</label>
              <div className="border p-2 rounded">{duration} mins</div>
            </>
          )}

          <button type="submit" className="bg-blue-500 text-white py-2 px-4 rounded-lg">Dodaj</button>
          <button type="button" className="bg-gray-500 text-white py-2 px-4 rounded-lg" onClick={onClose}>Zapri</button>
        </form>
      </div>
    </div>
  );
};

export default AddAppointment;