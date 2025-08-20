import { useState, useEffect } from "react";
import { formatTime } from "../utility/changeDate";
import getServices from "../hooks/useFetchServices";
import { Appointment as PrismaAppointment, ServiceCategory as PrismaServiceCategory } from "@prisma/client";

interface Appointment extends PrismaAppointment {
  name: string;
  email: string;
  phone: string;
  price: number;
  services: Service[];
  startTime: string;
  endTime: string;
}

interface Service {
  id: number;
  serviceName: string;
  servicePrice?: number;
  serviceTime?: number;
}

interface ServiceCategory extends PrismaServiceCategory {
  services: Service[];
}

interface ViewAppointmentProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  appointment: any | null;
  onClose: () => void;
  onDelete: (id: string) => void;
  onUpdate: (id: number, updatedData: Appointment) => void;
}


const ViewAppointment: React.FC<ViewAppointmentProps> = ({
  appointment,
  onClose,
  onDelete,
  onUpdate,
}) => {
  const [updateMode, setUpdateMode] = useState(false);
  console.log("ViewAppointment component rendered with appointment:", appointment);
  const isAvailableSlot = appointment?.title === "Prosti termin";

  const [formData, setFormData] = useState({
    name: appointment?.title || "",
    email: appointment?.extendedProps?.email || "",
    phone: appointment?.extendedProps?.phone || "",
    price: appointment?.extendedProps?.price || "",
    startTime: formatTime(appointment?.start),
    endTime: formatTime(appointment?.end),
    services: appointment?.extendedProps?.services || [],
  });
  console.log("Initial form data:", formData);

  const [selectedServices, setSelectedServices] = useState<Service[]>(
    formData.services || []
  );
  const [services, setServices] = useState<ServiceCategory[]>([]);

  // Fetch services only when in update mode
  useEffect(() => {
    if (!updateMode) return;
    const fetchServices = async () => {
      const fetchedServices = await getServices();
      setServices(fetchedServices ?? []);
    };
    fetchServices();
  }, [updateMode]);

  if (!appointment) return null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleServiceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    service: Service
  ) => {
    setSelectedServices((prev) => {
      const updatedServices = e.target.checked
        ? [...prev, service]
        : prev.filter((s) => s.id !== service.id);
      setFormData({ ...formData, services: updatedServices });
      return updatedServices;
    });
  };

  const handleUpdate = () => {
    // Construct updated appointment object with all required fields
    const updatedAppointment: Appointment = {
      id: Number(appointment.id),
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      price: formData.price ? Number(formData.price) : 0,
      services: selectedServices,
      date: appointment.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      available: appointment.available,
      createdAt: appointment.createdAt,
      updatedAt: new Date(), 
    };
    console.log("Updated appointment data:", updatedAppointment);
    onUpdate(appointment.id, updatedAppointment);

    setUpdateMode(false);
    onClose();
  };

  return (
    <div className="fixed z-10 top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-full max-w-md bg-white p-6 rounded-xl shadow-lg space-y-4">
        <h2 className="text-2xl font-bold text-[var(--terracotta)]">
          Podrobnosti termina
        </h2>

        {updateMode ? (
          // --- UPDATE FORM ---
          <div className="space-y-3 overflow-y-auto max-h-[70vh]">
            {!isAvailableSlot ? (
              <>
                <div>
                  <label className="block font-semibold">Ime</label>
                  <input
                    type="text"
                    name="title"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block font-semibold">E-pošta</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Telefon</label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Začetek</label>
                  <input
                    type="time"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
                  <label className="block font-semibold">Konec</label>
                  <input
                    type="time"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
                <div>
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
                              onChange={(e) =>
                                handleServiceChange(e, service)
                              }
                              checked={selectedServices.some(
                                (s) => s.id === service.id
                              )}
                              className="mr-2"
                            />
                            <label htmlFor={`service-${service.id}`}>
                              {service.serviceName}
                            </label>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block font-semibold">Cena (€)</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full border rounded px-2 py-1"
                  />
                </div>
              </>
            ) : (
              // --- AVAILABLE SLOT FORM ---
              <>
                <p>
                  <span className="font-semibold">Termin:</span>{" "}
                  {appointment.title}
                </p>
                <label htmlFor="startTime">Začetek</label>
                <input
                  type="time"
                  id="startTime"
                  name="startTime"
                  value={formData.startTime}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
                <label htmlFor="endTime">Konec</label>
                <input
                  type="time"
                  id="endTime"
                  name="endTime"
                  value={formData.endTime}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                />
              </>
            )}

            <div className="flex gap-4 mt-4">
              <button
                className="flex-1 text-white py-2 px-4 rounded-lg"
                onClick={handleUpdate}
              >
                Shrani spremembe
              </button>
              <button
                className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-2 px-4 rounded-lg"
                onClick={() => setUpdateMode(false)}
              >
                Prekliči
              </button>
            </div>
          </div>
        ) : (
          // --- DETAILS VIEW ---
          <>
            {isAvailableSlot ? (
              <>
                <p>
                  <span className="font-semibold">Termin:</span>{" "}
                  {appointment.title}
                </p>
                <p>
                  <span className="font-semibold">Začetek:</span>{" "}
                  {formatTime(appointment.start)}
                </p>
                <p>
                  <span className="font-semibold">Konec:</span>{" "}
                  {formatTime(appointment.end)}
                </p>
              </>
            ) : (
              <>
                <p>
                  <span className="font-semibold">Ime:</span>{" "}
                  {appointment.title}
                </p>
                <p>
                  <span className="font-semibold">E-pošta:</span>{" "}
                  {appointment.extendedProps.email}
                </p>
                <p>
                  <span className="font-semibold">Telefon:</span>{" "}
                  {appointment.extendedProps.phone}
                </p>
                <p>
                  <span className="font-semibold">Začetek:</span>{" "}
                  {formatTime(appointment.start)}
                </p>
                <p>
                  <span className="font-semibold">Konec:</span>{" "}
                  {formatTime(appointment.end)}
                </p>
                <div>
                  <p className="font-semibold">Storitve:</p>
                  <ul className="list-disc list-inside ml-2">
                    {appointment.extendedProps.services.map(
                      (service: { serviceName: string }) => (
                        <li key={service.serviceName}>
                          {service.serviceName}
                        </li>
                      )
                    )}
                  </ul>
                </div>
                <p>
                  <span className="font-semibold">Cena:</span>{" "}
                  {appointment.extendedProps.price
                    ? `${appointment.extendedProps.price}€`
                    : "Ni podatka"}
                </p>
              </>
            )}

            <div className="flex flex-col gap-4 mt-6">
              <button
                className="flex-1 text-white py-2 px-4 rounded-lg"
                onClick={() => setUpdateMode(true)}
              >
                Spremeni
              </button>
              <div className="flex gap-4">
                <button
                  className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
                  onClick={() => onDelete(appointment.id)}
                >
                  Izbriši termin
                </button>
                <button
                  className="flex-1 bg-[var(--soft-rose)] hover:bg-[var(--soft-rose)] text-white py-2 px-4 rounded-lg"
                  onClick={onClose}
                >
                  Zapri
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ViewAppointment;