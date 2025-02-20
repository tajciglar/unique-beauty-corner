import React, { useState, useEffect } from "react";
import { changeDate } from "@/utility/changeDate";
import { Appointment, Service, ServiceCategory } from "@/types/types";
import getServices from "@/hooks/useFetchServices";

interface AddAppointmentProps {
  selectedDate: string | null;
  onClose: () => void;
  onSave: (appointmentData: ClientAppointment) => void;
}

const AddAppointment: React.FC<AddAppointmentProps> = ({ selectedDate, onClose, onSave }) => {
  const [purpose, setPurpose] = useState<string>("");
  const [startTime, setStartTime] = useState<string>("");
  const [endTime, setEndTime] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [location, setLocation] = useState<string>("");
  const [price, setPrice] = useState<number>(0);
  const [duration, setDuration] = useState<number>(0);
  const [services, setServices] = useState<ServiceCategory[] | null>(null);
  const [selectedServices, setSelectedServices] = useState<Service[]>([]);

  // Fetch services when "client" is selected
  useEffect(() => {
    if (purpose === "client") {
      const fetchServices = async () => {
        const data = await getServices();
        console.log(data)
        if (data) {
          setServices(data);
        }
      };
      fetchServices();
    }
  }, [purpose]);

  const handleServiceChange = (e: React.ChangeEvent<HTMLInputElement>, service: Service) => {
      setSelectedServices((prev) => {
        let updatedServices;
        if (e.target.checked) {
          updatedServices = [...prev, service];
        } else {
          updatedServices = prev.filter((s) => s.id !== service.id);
        }

        // Correct price and duration calculations
        const totalPrice = updatedServices.reduce((sum, s) => sum + Number(s.servicePrice), 0);
        console.log(totalPrice)
        const totalDuration = updatedServices.reduce((sum, s) => sum + s.serviceTime, 0);
        
        setPrice(totalPrice);
        setDuration(totalDuration);
        return updatedServices;
      });
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

    onSave({
      date: selectedDate,
      startTime,
      endTime,
      name,
      phone,
      email,
      price,
      duration,
      services: selectedServices,
    });

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
              <select id="location" className="border p-2 rounded" onChange={(e) => setLocation(e.target.value)}>
                <option value="Domžale">Domžale</option>
                <option value="Ljubljana">Ljubljana</option>
              </select>
            </>
          )}

          {purpose === "client" && (
            <>
              <label htmlFor="name">Client Name</label>
              <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} className="border p-2 rounded" required />

              <label htmlFor="phone">Phone</label>
              <input type="tel" id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 rounded" required />

              <label htmlFor="email">Email</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 rounded" required />

              <label htmlFor="startTime">Start Time</label>
              <input type="time" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="border p-2 rounded" />

              <label htmlFor="services">Storitve</label>
              {services?.map((category) => (
                <div key={category.id} className="mb-2">
                  {/* Service Category Checkbox */}
                  <label className="font-bold">
                    {category.categoryName}
                  </label>

                  {/* List of Services with Checkboxes */}
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
              <input type="time" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="border p-2 rounded" />

              <label htmlFor="location">Lokacija</label>
              <select id="location" className="border p-2 rounded" onChange={(e) => setLocation(e.target.value)}>
                <option value="Domžale">Domžale</option>
                <option value="Ljubljana">Ljubljana</option>
              </select>

              <label>Price</label>
              <div className="border p-2 rounded">{price}€</div>

              <label>Duration</label>
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